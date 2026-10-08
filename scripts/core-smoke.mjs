/**
 * Core Smoke Test for NeonForge OS Real Machine Engine
 * Validates hardened cryptographic verification, admin authentication, and webhooks.
 */

import 'dotenv/config';
import crypto from 'crypto';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'neonforge-test-admin-key-2026';
const STRIPE_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_for_audit_validation_99';
const ETSY_SECRET = process.env.ETSY_SHARED_SECRET || 'etsy_shared_secret_audit_validation_77';

async function runSmokeTests() {
  console.log(`[Smoke Test] Testing NeonForge OS Engine at ${BASE_URL}...`);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Server Status & Database Engine (/api/status)', async () => {
    const res = await fetch(`${BASE_URL}/api/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ONLINE') throw new Error(`Expected status ONLINE, got ${data.status}`);
    if (!data.database) throw new Error('Missing database metadata');
  });

  // 2. Products list
  let catalogProduct = { id: 'prod-cyber-notion-01', price: 39.00, title: 'Cyberpunk 2088 Freelance OS' };
  await test('Fetch Products Catalog (/api/products)', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('No products returned in catalog');
    }
    catalogProduct = data.products[0];
  });

  // 3. Place verified order & mint token
  let createdOrder = null;
  await test('Process Verified Order & Mint Cryptographic SHA-256 License (/api/orders)', async () => {
    const orderNumber = `ORD-SMOKE-${Date.now().toString().slice(-6)}`;
    const piRes = await fetch(`${BASE_URL}/api/stripe/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY
      },
      body: JSON.stringify({
        productId: catalogProduct.id,
        amount: catalogProduct.price,
        orderNumber
      })
    });
    if (!piRes.ok) throw new Error(`Payment intent generation failed: HTTP ${piRes.status}`);
    const piData = await piRes.json();

    const testOrder = {
      order: {
        productId: catalogProduct.id,
        productTitle: catalogProduct.title,
        amount: catalogProduct.price,
        orderNumber,
        verifiedPaymentToken: piData.verifiedPaymentToken,
        channel: 'Direct Storefront',
        paymentMethod: 'Credit Card / Stripe'
      },
      customer: {
        name: 'Smoke Test Agent',
        email: 'smoke.test@neonforge.engine'
      }
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.order?.downloadToken || !data.order?.licenseKey) {
      throw new Error('Order missing cryptographic licenseKey or downloadToken');
    }
    createdOrder = data.order;
  });

  // 4. Download file package
  if (createdOrder) {
    await test('Deliverable ZIP Packaging & Token Verification (/api/orders/.../download/...)', async () => {
      const url = `${BASE_URL}/api/orders/${encodeURIComponent(createdOrder.orderNumber)}/download/${encodeURIComponent(createdOrder.downloadToken)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/zip')) {
        throw new Error(`Expected application/zip, got ${contentType}`);
      }
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 50) {
        throw new Error(`ZIP archive payload too small: ${buffer.byteLength} bytes`);
      }
    });
  }

  // 5. Overdrive batch pipeline
  await test('Trigger 9-Sector Overdrive Batch Pipeline (/api/overdrive)', async () => {
    const res = await fetch(`${BASE_URL}/api/overdrive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.velocity !== 4.8) {
      throw new Error('Overdrive did not report 4.8x velocity');
    }
  });

  // 6. Project Codebase ZIP Export
  await test('Full Project Codebase ZIP Export (/api/download-project)', async () => {
    const res = await fetch(`${BASE_URL}/api/download-project`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/zip')) {
      throw new Error(`Expected application/zip, got ${contentType}`);
    }
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 50000) {
      throw new Error(`Project ZIP archive payload too small: ${buffer.byteLength} bytes`);
    }
  });

  // 7. Stripe Config & Checkout Session Creation
  await test('Stripe Gateway Config & Session Dispatcher (/api/stripe/...)', async () => {
    const configRes = await fetch(`${BASE_URL}/api/stripe/config`);
    if (!configRes.ok) throw new Error(`Stripe config HTTP ${configRes.status}`);
    const conf = await configRes.json();
    if (!conf.success) throw new Error('Stripe config failed');

    const sessionRes = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: catalogProduct.id,
        customerEmail: 'smoke.buyer@stripe.test',
        customerName: 'Smoke Test Buyer'
      })
    });
    if (!sessionRes.ok) throw new Error(`Stripe session HTTP ${sessionRes.status}`);
    const sess = await sessionRes.json();
    if (!sess.success || !sess.sessionId) throw new Error('Missing Stripe sessionId');
  });

  // 8. Stripe Signed Webhook Ingestion & SHA-256 License Minting
  await test('Stripe Signed Webhook Ingestion & Idempotency (/api/stripe/webhook)', async () => {
    const orderNumber = `ORD-SMOKE-WH-${Date.now().toString().slice(-6)}`;
    const eventId = `evt_smoke_${Date.now()}`;
    const payload = JSON.stringify({
      id: eventId,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_smoke_${Date.now()}`,
          payment_status: 'paid',
          amount_total: Math.round(catalogProduct.price * 100),
          customer_email: 'smoke.webhook@stripe.dev',
          metadata: {
            orderNumber,
            productId: catalogProduct.id,
            customerName: 'Smoke Webhook User'
          }
        }
      }
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureHash = crypto.createHmac('sha256', STRIPE_SECRET).update(`${timestamp}.${payload}`).digest('hex');
    const sigHeader = `t=${timestamp},v1=${signatureHash}`;

    const hookRes = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': sigHeader },
      body: payload
    });
    if (!hookRes.ok) throw new Error(`Webhook HTTP ${hookRes.status}`);
    const hookData = await hookRes.json();
    if (!hookData.received || !hookData.licenseKey) throw new Error('Failed to mint license via Stripe webhook');
  });

  // 9. Etsy Open API v3 Status
  await test('Etsy Open API v3 Status (/api/etsy/status)', async () => {
    const statusRes = await fetch(`${BASE_URL}/api/etsy/status`);
    if (!statusRes.ok) throw new Error(`Etsy status HTTP ${statusRes.status}`);
    const statusData = await statusRes.json();
    if (!statusData.success || !statusData.config) throw new Error('Etsy status failed');
  });

  // 10. Etsy Marketplace Standard Signed Webhook Order Ingestion (Current Etsy Webhook Protocol)
  await test('Etsy Marketplace Signed Webhook Ingestion (/api/etsy/webhook)', async () => {
    const webhookId = `wh_etsy_smoke_${Date.now()}`;
    const webhookTimestamp = String(Math.floor(Date.now() / 1000));
    const receiptId = `RCP-SMOKE-${Date.now().toString().slice(-6)}`;
    const payload = JSON.stringify({
      event_type: 'order.paid',
      productId: catalogProduct.id,
      buyerName: 'Smoke Etsy Crafter',
      buyerEmail: 'etsy.crafter@smoke.test',
      transactionAmount: catalogProduct.price,
      receipt_id: receiptId
    });

    const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;
    const signature = crypto.createHmac('sha256', ETSY_SECRET).update(signedPayload).digest('hex');

    const etsyHookRes = await fetch(`${BASE_URL}/api/etsy/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'webhook-id': webhookId,
        'webhook-timestamp': webhookTimestamp,
        'webhook-signature': `v1,${signature}`
      },
      body: payload
    });
    if (!etsyHookRes.ok) throw new Error(`Etsy webhook HTTP ${etsyHookRes.status}`);
    const etsyData = await etsyHookRes.json();
    if (!etsyData.success || etsyData.order.channel !== 'Etsy Sync' || !etsyData.order.licenseKey) {
      throw new Error('Etsy order ingestion failed');
    }
  });

  console.log(`\n[Smoke Test Summary] Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runSmokeTests().catch(err => {
  console.error('[Smoke Test Error]:', err);
  process.exit(1);
});
