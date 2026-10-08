# Etsy Open API v3 & Multi-Gateway Technical Architecture

## Authoritative Commerce Engine Specifications

NeonForge OS implements multi-channel commerce across three payment channels:
1. **Direct Storefront (Stripe)**: Cards, Apple Pay, Google Pay, dynamic Checkout Sessions.
2. **Direct Storefront (Square)**: Cards, Cash App Pay, Square Payment Links.
3. **Etsy Open API v3**: Automatic product sync with 13 SEO tags, instant digital fulfillment, and asynchronous payment ledger reconciliation.

---

## The Etsy Two-Phase Financial Architecture

Etsy's documented payment lifecycle dictates that order placement and payment settlement occur in distinct asynchronous phases:

```
[Buyer Completes Checkout on Etsy]
             │
             ▼
[Etsy sends webhook: "order.paid"]
             │
             ├──► 1. NeonForge locates product in store catalog.
             ├──► 2. Mints SHA-256 license key (LIC-ETSY-...).
             ├──► 3. Generates cryptographic download token (tok_etsy_...).
             ├──► 4. Marks order status: "Completed & Delivered".
             ├──► 5. Sets etsyPaymentDetails.paymentStatus = "pending_settlement".
             └──► 6. Computes estimated platform fees (6.5% + 3% + $0.25 + $0.20).
             │
             ▼
[Buyer instantly downloads ZIP archive with commercial rights]
             │
   ... Time passes (Etsy Payments batch clears) ...
             │
             ▼
[Etsy sends webhook: "payment.settled" with actual fee ledger]
             │
             ├──► 1. NeonForge finds order by receiptId / orderNumber.
             ├──► 2. Extracts actual transactionFee, processingFee, listingFee, regulatoryFee, and taxWithheld.
             ├──► 3. Reconciles netProfit to equal exact netDeposit.
             ├──► 4. Sets etsyPaymentDetails.paymentStatus = "settled".
             └──► 5. Updates store total revenue metrics with exact financial truth.
```

### Webhook Endpoints & Payload Formats

- **Order Intake**: `POST /api/etsy/webhook`
  - Immediate `order.paid` payload:
    ```json
    {
      "eventType": "order.paid",
      "receiptId": "RCP-88329104",
      "productId": "prod-1",
      "buyerName": "Jane Doe",
      "buyerEmail": "jane@example.com",
      "transactionAmount": 39.00
    }
    ```
  - Payment Settlement `payment.settled` payload:
    ```json
    {
      "eventType": "payment.settled",
      "receiptId": "RCP-88329104",
      "paymentId": "PAY-992144",
      "actualGross": 39.00,
      "actualTransactionFee": 2.54,
      "actualProcessingFee": 1.42,
      "actualListingFee": 0.20,
      "regulatoryFee": 0.15,
      "taxWithheld": 3.12,
      "netDeposit": 34.69
    }
    ```

- **Dedicated Settlement Endpoint**: `POST /api/etsy/payment-settlement`
