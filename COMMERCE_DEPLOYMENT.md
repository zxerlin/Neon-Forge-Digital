# NeonForge OS Commerce Deployment & Production Verification Guide

## 1. Pre-Deployment Verification Sequence

Before transitioning NeonForge OS from staging/sandbox to live production cash flow, run this full verification pipeline:

```bash
# 1. Install pristine dependencies
npm install

# 2. Type-checking & strict linting
npm run lint

# 3. Comprehensive automated test suite (Observability, PII, Multi-Channel)
npm test

# 4. Production build artifact generation
npm run build

# 5. Database schema migration (if using PostgreSQL/Cloud SQL)
psql -U $DB_USER -d $DB_NAME -f db/schema.sql
```

---

## 2. Etsy Open API v3 Two-Phase Payment Model

### Phase 1: `order.paid` (Immediate Fulfillment)
- **When**: Fires instantaneously when the buyer completes checkout on Etsy.
- **Action**:
  - Immediately generates and delivers the authenticated digital asset package.
  - Mints the SHA-256 license key (`LIC-ETSY-...`) and download token (`tok_etsy_...`).
  - Sets payment status to `pending_settlement` with standard estimated Etsy deductions (6.5% transaction + 3% + $0.25 processing + $0.20 listing).
  - Customer receives their download immediately without waiting for banking clearance.

### Phase 2: `payment.settled` (Financial Ledger Reconciliation)
- **When**: Fires when Etsy Payments processes the payment batches and finalizes the ledger.
- **Action**:
  - Reconciles the existing order using the `receiptId` / `orderNumber`.
  - Records the actual fees: `transactionFee`, `processingFee`, `listingFee`, `regulatoryFee`, `taxWithheld`.
  - Adjusts net profit to match the exact `netDeposit` deposited into your seller bank account.
  - Updates payment status to `settled`.
  - Zero duplicate order creation; historical audit ledger maintained.

---

## 3. Stripe & Square Multi-Gateway Routing

| Provider | Production Webhook URL | Events Handled | Payout Destination |
| :--- | :--- | :--- | :--- |
| **Stripe** | `/api/stripe/webhook` | `checkout.session.completed`, `payment_intent.succeeded` | Direct to your linked Checking / Business Bank Account |
| **Square** | `/api/square/webhook` | `payment.created`, `payment.updated` | Direct to your Square Balance / Checking Account (Cash App Pay enabled) |
| **Etsy** | `/api/etsy/webhook` | `order.paid`, `payment.settled`, `shop.receipt.paid` | Direct to your Etsy Payments Bank Account |

---

## 4. Environment Variables Checklist (`.env`)

```env
# Stripe Live Credentials
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Square Live Credentials
SQUARE_APPLICATION_ID=sq0idp-...
SQUARE_LOCATION_ID=L...
SQUARE_ACCESS_TOKEN=EAAA...
SQUARE_WEBHOOK_SIGNATURE_KEY=...

# Etsy Open API v3 Credentials
ETSY_API_KEY=...
ETSY_SHARED_SECRET=...
ETSY_SHOP_ID=...
```
