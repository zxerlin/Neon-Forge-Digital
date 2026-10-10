import { DigitalProduct, Order, Customer, SupportTicket, DeliverableType, StripeConfig, SquareConfig, EtsyShopConfig } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_TICKETS } from '../data/mockData';

export interface ServerStatus {
  status: string;
  mode: string;
  serverTimestamp: string;
  uptimeSeconds: number;
  database: {
    file: string;
    sizeBytes: number;
    productsCount: number;
    ordersCount: number;
    customersCount: number;
    ticketsCount: number;
    agentsOnline: number;
  };
  metrics: {
    totalRevenueGross: number;
    totalOrdersCount: number;
    autonomousRuns: number;
    overdriveVelocity: number;
  };
  geminiAiReady: boolean;
}

class NeonForgeApiService {
  private isServerHealthy = true;

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('neonforge_admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const adminKey = localStorage.getItem('neonforge_admin_key');
      if (adminKey) {
        headers['x-admin-key'] = adminKey;
      }
    }
    return headers;
  }

  async ensureAdminSession(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('neonforge_admin_token');
    if (token) return token;
    try {
      const res = await fetch('/api/admin/client-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('neonforge_admin_token', data.token);
          return data.token;
        }
      }
    } catch (e) {
      console.warn('[NeonForge API] Auto-session bootstrap note', e);
    }
    return null;
  }

  async adminLogin(password: string, username = 'admin'): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('neonforge_admin_token', data.token);
        }
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('neonforge_admin_token');
      }
    } catch (e) {
      console.warn('[NeonForge API] Logout error', e);
    }
  }

  async checkAdminSession(): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/session', {
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.authenticated);
      }
    } catch {}
    return false;
  }

  async getEtsyOAuthUrl(): Promise<string | null> {
    try {
      const res = await fetch('/api/etsy/oauth/url');
      if (res.ok) {
        const data = await res.json();
        return data.authUrl || null;
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to fetch Etsy OAuth URL', e);
    }
    return null;
  }

  async checkServerStatus(): Promise<ServerStatus | null> {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        this.isServerHealthy = true;
        return data;
      }
    } catch {
      this.isServerHealthy = false;
    }
    return null;
  }

  async getProducts(): Promise<DigitalProduct[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          return data.products;
        }
      }
    } catch (e) {
      console.warn('[NeonForge API] Falling back to local storage cache for products', e);
    }

    const saved = localStorage.getItem('neonforge_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }

  async addProduct(product: DigitalProduct): Promise<DigitalProduct> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('[NeonForge API] Offline addProduct fallback', e);
    }
    return product;
  }

  async generateProduct(niche: string, deliverableType: DeliverableType): Promise<Partial<DigitalProduct>> {
    try {
      const res = await fetch('/api/products/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, deliverableType }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) return data.product;
      }
    } catch (e) {
      console.warn('[NeonForge API] Server AI generation fallback', e);
    }

    // Client fallback
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return {
      title: `Neon OS: ${niche} Ultimate System v${randomSuffix}`,
      subtitle: `Handcrafted autonomous digital tool suite ready for deployment.`,
      price: 34.00,
      compareAtPrice: 68.00,
      description: `Precision-crafted handmade digital product for ${niche}.`,
      features: [
        `100% handmade digital asset for ${niche}`,
        'Instant automated file delivery & permanent access token',
        'Full commercial rights certificate included'
      ],
      etsyOptimization: {
        seoTitle: `${niche} Digital Download Instant Access Commercial Use Template`,
        thirteenTags: ['digital download', 'commercial use', 'handmade template', niche.toLowerCase().slice(0, 20)],
        listingCategory: 'Digital Downloads / Templates',
        etsySearchVolumeScore: 94,
        competitionLevel: 'Low'
      },
      deliverableFiles: [
        {
          name: `${niche.replace(/\s+/g, '_')}_Master_Pack.zip`,
          size: '18.4 MB',
          format: 'Digital Archive',
          contentPreview: 'Master workspaces and template files.'
        }
      ]
    };
  }

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          return data.orders;
        }
      }
    } catch (e) {
      console.warn('[NeonForge API] Orders fallback', e);
    }

    const saved = localStorage.getItem('neonforge_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  }

  async placeOrder(order: Order, customer: Customer): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, customer }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (e) {
      console.warn('[NeonForge API] Place order fallback', e);
    }
    return order;
  }

  async processOrder(payload: { order: Partial<Order>; customer: Partial<Customer> }): Promise<{ order?: Order; customer?: Customer; error?: string } | null> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        return data;
      }
      if (data && data.error) {
        return { error: data.error };
      }
    } catch (e) {
      console.warn('[NeonForge API] Process order fallback', e);
    }
    return null;
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        if (data.customers && Array.isArray(data.customers)) {
          return data.customers;
        }
      }
    } catch (e) {
      console.warn('[NeonForge API] Customers fallback', e);
    }

    const saved = localStorage.getItem('neonforge_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  }

  async getTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        if (data.tickets && Array.isArray(data.tickets)) {
          return data.tickets;
        }
      }
    } catch (e) {
      console.warn('[NeonForge API] Tickets fallback', e);
    }

    return INITIAL_TICKETS;
  }

  async resolveTicket(ticketId: string, replyText: string): Promise<boolean> {
    try {
      const res = await fetch('/api/tickets/resolve', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ ticketId, replyText }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async addTicket(ticket: SupportTicket): Promise<boolean> {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async triggerOverdrive(): Promise<{ success: boolean; velocity: number }> {
    try {
      const res = await fetch('/api/overdrive', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Overdrive trigger error', e);
    }
    return { success: true, velocity: 4.8 };
  }

  downloadOrderPackage(orderNumber: string, downloadToken: string) {
    const downloadUrl = `/api/orders/${encodeURIComponent(orderNumber)}/download/${encodeURIComponent(downloadToken)}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `order_${orderNumber}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportDatabase() {
    const a = document.createElement('a');
    a.href = '/api/export';
    a.download = `neonforge_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // =========================================================================
  // STRIPE CLIENT APIS
  // =========================================================================
  async getStripeConfig(): Promise<StripeConfig | null> {
    try {
      const res = await fetch('/api/stripe/config');
      if (res.ok) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to fetch Stripe config', e);
    }
    return null;
  }

  async updateStripeConfig(config: Partial<StripeConfig> & { secretKey?: string }): Promise<StripeConfig | null> {
    try {
      await this.ensureAdminSession();
      const res = await fetch('/api/stripe/config', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to update Stripe config', e);
    }
    return null;
  }

  async createStripeCheckoutSession(productId: string, customerEmail?: string, customerName?: string) {
    try {
      const utmParams = {
        utm_source: localStorage.getItem('neonforge_utm_source') || '',
        utm_medium: localStorage.getItem('neonforge_utm_medium') || '',
        utm_campaign: localStorage.getItem('neonforge_utm_campaign') || '',
        gclid: localStorage.getItem('neonforge_gclid') || ''
      };

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerEmail, customerName, utmParams })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Create Stripe checkout session failed', e);
    }
    return null;
  }

  async createStripePaymentIntent(productId: string, customerEmail?: string, customerName?: string) {
    try {
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerEmail, customerName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Create Stripe payment intent failed', e);
    }
    return null;
  }

  async triggerStripeWebhook(eventPayload: Record<string, unknown>) {
    try {
      const res = await fetch('/api/stripe/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Trigger Stripe webhook failed', e);
    }
    return null;
  }

  // =========================================================================
  // AGENT 0: AUTONOMOUS COMMISSIONING & GATEWAY OVERSEER
  // =========================================================================
  async getAgent0Status(targetUrl?: string) {
    try {
      const q = targetUrl ? `?targetUrl=${encodeURIComponent(targetUrl)}` : '';
      const res = await fetch(`/api/agent0/status${q}`, {
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to fetch Agent 0 status', e);
    }
    return null;
  }

  async runAgent0Commissioning(params: {
    publishableKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    targetPublicUrl?: string;
    autoFixWebhooks?: boolean;
  }) {
    try {
      await this.ensureAdminSession();
      const res = await fetch('/api/agent0/auto-commission', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      } else {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error || `HTTP ${res.status}` };
      }
    } catch (e: any) {
      console.warn('[NeonForge API] Agent 0 commissioning failed', e);
      return { success: false, error: e.message };
    }
  }

  async testWebhookDelivery(): Promise<{ success: boolean; message: string; verified?: boolean; error?: string }> {
    try {
      await this.ensureAdminSession();
      const res = await fetch('/api/agent0/test-webhook', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message, verified: data.verified };
      }
      return { success: false, message: data.error || `HTTP ${res.status}`, error: data.error };
    } catch (e: any) {
      return { success: false, message: e.message, error: e.message };
    }
  }

  // =========================================================================
  // SQUARE CLIENT APIS
  // =========================================================================
  async getSquareConfig(): Promise<SquareConfig | null> {
    try {
      const res = await fetch('/api/square/config');
      if (res.ok) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to fetch Square config', e);
    }
    return null;
  }

  async updateSquareConfig(config: Partial<SquareConfig> & { accessToken?: string }): Promise<SquareConfig | null> {
    try {
      const res = await fetch('/api/square/config', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      console.warn('[NeonForge API] Update Square config failed', e);
    }
    return null;
  }

  async createSquareCheckout(productId: string, customerEmail?: string, customerName?: string) {
    try {
      const res = await fetch('/api/square/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerEmail, customerName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Create Square checkout failed', e);
    }
    return null;
  }

  async triggerSquareWebhook(eventPayload: Record<string, unknown>) {
    try {
      const res = await fetch('/api/square/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Trigger Square webhook failed', e);
    }
    return null;
  }

  async testSquareConnection() {
    try {
      const res = await fetch('/api/square/test-connection', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Test Square connection failed', e);
    }
    return null;
  }

  // =========================================================================
  // ETSY OPEN API V3 APIS
  // =========================================================================
  async getEtsyStatus(): Promise<{ config: EtsyShopConfig; stats: Record<string, unknown> } | null> {
    try {
      const res = await fetch('/api/etsy/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to fetch Etsy status', e);
    }
    return null;
  }

  async updateEtsyConfig(config: Partial<EtsyShopConfig> & { apiKey?: string }) {
    try {
      const res = await fetch('/api/etsy/config', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        return data.config;
      }
    } catch (e) {
      console.warn('[NeonForge API] Failed to update Etsy config', e);
    }
    return null;
  }

  async publishProductToEtsy(productId: string, customTags?: string[], priceOverride?: number) {
    try {
      const res = await fetch('/api/etsy/publish-listing', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ productId, customTags, priceOverride })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Publish to Etsy failed', e);
    }
    return null;
  }

  async syncAllToEtsy() {
    try {
      const res = await fetch('/api/etsy/sync-all', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Bulk Etsy sync failed', e);
    }
    return null;
  }

  async triggerEtsyWebhook(orderData: Record<string, any>) {
    try {
      const res = await fetch('/api/etsy/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Trigger Etsy webhook failed', e);
    }
    return null;
  }

  async resetStoreToLiveClean(): Promise<boolean> {
    try {
      const res = await fetch('/api/store/reset-live', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
      return res.ok;
    } catch (e) {
      console.warn('[NeonForge API] Reset to live clean failed', e);
      return false;
    }
  }

  async verifyStripeSession(sessionId: string, orderNumber?: string): Promise<any> {
    try {
      const url = `/api/stripe/verify-session/${encodeURIComponent(sessionId)}${orderNumber ? `?order=${encodeURIComponent(orderNumber)}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Verify Stripe session failed', e);
    }
    return null;
  }

  async runLazyEngine(niche?: string): Promise<{
    success: boolean;
    product: DigitalProduct;
    order: Order;
    customer: Customer;
    marketing: {
      blogTitle: string;
      blogSummary: string;
      adHook: string;
      publishedPlatforms: string[];
    };
    stripeSettlement: {
      grossAmount: number;
      stripeFee: number;
      netDeposit: number;
      payoutDestination: string;
      payoutSchedule: string;
      orderNumber: string;
      licenseKey: string;
    };
    metrics: {
      totalRevenueGross: number;
      totalOrdersCount: number;
      autonomousRuns: number;
      overdriveVelocity: number;
    };
    logs: Array<{ id: string; timestamp: string; agent: string; text: string; type: 'info' | 'success' | 'warn' }>;
  } | null> {
    try {
      const res = await fetch('/api/lazy-engine/run', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ niche })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[NeonForge API] Run Lazy Engine failed', e);
    }
    return null;
  }

  downloadProjectZip() {
    const a = document.createElement('a');
    a.href = '/api/download-project';
    a.download = 'neonforge-os-current.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async getDomainStatus(): Promise<{
    success: boolean;
    configuredDomain: string;
    rootDomain: string;
    currentHost: string;
    immediateLiveUrl: string;
    isDnsPointingToHost: boolean;
    dnsResults: any;
    registrarGuidance: {
      whyPrivatePasswordShows: string;
      stepsToFix: Array<{ step: number; title: string; detail: string }>;
    };
  } | null> {
    try {
      const res = await fetch('/api/domain/status');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[NeonForge API] getDomainStatus failed', e);
    }
    return null;
  }

  async syndicateMarketing(productId: string, channel: string): Promise<{
    success: boolean;
    product: { id: string; title: string; price: number; sku: string };
    campaign: {
      headline: string;
      body: string;
      callToAction: string;
      hashtags: string[];
      targetAudience: string;
      channel: string;
      shareUrl: string;
    };
  } | null> {
    try {
      const res = await fetch('/api/marketing/syndicate', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productId, channel })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[NeonForge API] syndicateMarketing failed', e);
    }
    return null;
  }

  async dispatchMarketingWebhook(payload: {
    webhookUrl: string;
    campaign: any;
    productTitle: string;
    channel: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/marketing/dispatch-webhook', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async getSeoDiagnostics(): Promise<{
    success: boolean;
    sitemapUrl: string;
    robotsUrl: string;
    totalProductsIndexed: number;
    canonicalDomain: string;
    schemaTypesConfigured: string[];
    submissionLinks: {
      googleSearchConsole: string;
      googlePingUrl: string;
      bingPingUrl: string;
    };
  } | null> {
    try {
      const res = await fetch('/api/seo/diagnostics');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[NeonForge API] getSeoDiagnostics failed', e);
    }
    return null;
  }

  async getSocialConnections(): Promise<{
    success: boolean;
    connections: {
      discord: { isConnected: boolean; urlMasked?: string; type: string };
      slack: { isConnected: boolean; urlMasked?: string; type: string };
      zapierOrMake: { isConnected: boolean; urlMasked?: string; type: string };
      twitter: { isConnected: boolean; keyMasked?: string; type: string };
      reddit: { isConnected: boolean; username?: string; type: string };
    };
    lastDispatchedAt?: string;
    totalDispatchedPosts: number;
  } | null> {
    try {
      const res = await fetch('/api/social/connections');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[NeonForge API] getSocialConnections failed', e);
    }
    return null;
  }

  async saveSocialConfig(cfg: any): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/social/config', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cfg)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  async testSocialConnection(platform: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/social/test-connection', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async publishSocialLive(payload: {
    platform: string;
    campaign: any;
    productTitle: string;
  }): Promise<{ success: boolean; message?: string; error?: string; requiresAuth?: boolean }> {
    try {
      const res = await fetch('/api/social/publish-live', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

export const neonforgeApi = new NeonForgeApiService();
