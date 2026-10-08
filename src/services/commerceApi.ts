import { Order, DigitalProduct, EtsyPaymentDetails } from '../types';
import { neonforgeApi } from './neonforgeApi';

export interface EtsyOrderPaidPayload {
  productId?: string;
  buyerName?: string;
  buyerEmail?: string;
  transactionAmount?: number;
  receiptId?: string;
}

export interface EtsyPaymentSettledPayload {
  receiptId?: string;
  orderNumber?: string;
  paymentId?: string;
  actualGross?: number;
  actualTransactionFee?: number;
  actualProcessingFee?: number;
  actualListingFee?: number;
  regulatoryFee?: number;
  taxWithheld?: number;
  netDeposit?: number;
}

export class CommerceApiService {
  /**
   * Phase 1: Ingest Etsy order.paid event (immediate digital asset delivery)
   */
  static async triggerEtsyOrderPaid(payload: EtsyOrderPaidPayload): Promise<{
    success: boolean;
    order: Order;
    event: 'order.paid';
    paymentStatus: 'pending_settlement';
  } | null> {
    try {
      const res = await fetch('/api/etsy/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'order.paid',
          ...payload
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Commerce API] Etsy order.paid failed', e);
    }
    return null;
  }

  /**
   * Phase 2: Ingest Etsy payment.settled event (reconcile detailed fee ledger)
   */
  static async triggerEtsyPaymentSettled(payload: EtsyPaymentSettledPayload): Promise<{
    success: boolean;
    order: Order;
    event: 'payment.settled';
    reconciled: boolean;
    netAdjustment: number;
  } | null> {
    try {
      const res = await fetch('/api/etsy/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'payment.settled',
          ...payload
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Commerce API] Etsy payment.settled failed', e);
    }
    return null;
  }

  /**
   * Reconcile any Etsy receipt via dedicated settlement endpoint
   */
  static async reconcileEtsyPayment(payload: EtsyPaymentSettledPayload): Promise<{
    success: boolean;
    order: Order;
    reconciled: boolean;
    netAdjustment: number;
  } | null> {
    try {
      const res = await fetch('/api/etsy/payment-settlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Commerce API] Etsy payment reconciliation failed', e);
    }
    return null;
  }
}
