import { Order, EtsyPaymentDetails } from '../types';

/**
 * Financial Truth Engine for NeonForge OS
 * Implements authoritative fee models and Etsy's two-phase payment reconciliation:
 * Phase 1: order.paid arrives immediately (instant customer fulfillment & estimated fees)
 * Phase 2: payment.settled / detailed ledger arrives asynchronously (actual processing fees, taxes, net deposit)
 */

export interface FeeBreakdown {
  channel: 'Direct Storefront' | 'Etsy Sync' | 'Square Pay' | 'Gumroad Mirror';
  gross: number;
  gatewayFee: number;
  marketplaceFee: number;
  listingFee: number;
  regulatoryFee: number;
  taxWithheld: number;
  totalDeductions: number;
  netProfit: number;
  marginPercent: number;
}

export class FinancialTruthService {
  /**
   * Phase 1: Estimated Etsy Fees at immediate order.paid arrival
   * Standard Etsy Rates:
   * - 6.5% Transaction Fee on listing price
   * - 3.0% + $0.25 Payment Processing Fee
   * - $0.20 Listing Auto-Renew Fee
   */
  static estimateEtsyFees(grossAmount: number): {
    transactionFee: number;
    processingFee: number;
    listingFee: number;
    totalFee: number;
    estimatedNet: number;
  } {
    const transactionFee = Number((grossAmount * 0.065).toFixed(2));
    const processingFee = Number((grossAmount * 0.03 + 0.25).toFixed(2));
    const listingFee = 0.20;
    const totalFee = Number((transactionFee + processingFee + listingFee).toFixed(2));
    const estimatedNet = Number((grossAmount - totalFee).toFixed(2));

    return {
      transactionFee,
      processingFee,
      listingFee,
      totalFee,
      estimatedNet,
    };
  }

  /**
   * Phase 2: Final Payment Record Reconciliation
   * Reconciles the order when Etsy Payments issues the settled ledger entry
   */
  static reconcileEtsyPayment(
    existingOrder: Order,
    settlement: {
      receiptId?: string;
      paymentId?: string;
      actualGross?: number;
      actualTransactionFee?: number;
      actualProcessingFee?: number;
      actualListingFee?: number;
      regulatoryFee?: number;
      taxWithheld?: number;
      netDeposit?: number;
    }
  ): {
    updatedOrder: Order;
    netAdjustment: number;
  } {
    const gross = settlement.actualGross ?? existingOrder.amount;
    const estimates = this.estimateEtsyFees(gross);

    const transactionFee = settlement.actualTransactionFee ?? estimates.transactionFee;
    const processingFee = settlement.actualProcessingFee ?? estimates.processingFee;
    const listingFee = settlement.actualListingFee ?? estimates.listingFee;
    const regulatoryFee = settlement.regulatoryFee ?? 0;
    const taxWithheld = settlement.taxWithheld ?? 0;

    const totalFees = Number(
      (transactionFee + processingFee + listingFee + regulatoryFee).toFixed(2)
    );
    const finalNet = settlement.netDeposit !== undefined
      ? Number(settlement.netDeposit.toFixed(2))
      : Number((gross - totalFees).toFixed(2));

    const previousNet = existingOrder.netProfit;
    const netAdjustment = Number((finalNet - previousNet).toFixed(2));

    const etsyDetails: EtsyPaymentDetails = {
      receiptId: settlement.receiptId || existingOrder.etsyPaymentDetails?.receiptId || `RCP-${existingOrder.orderNumber}`,
      paymentId: settlement.paymentId || `PAY-ETSY-${Date.now().toString().slice(-6)}`,
      paymentStatus: 'settled',
      grossAmount: gross,
      transactionFee,
      processingFee,
      listingFee,
      regulatoryFee,
      taxWithheld,
      netDeposit: finalNet,
      settledAt: new Date().toISOString(),
    };

    const updatedOrder: Order = {
      ...existingOrder,
      amount: gross,
      platformFee: totalFees,
      netProfit: finalNet,
      etsyPaymentDetails: etsyDetails,
    };

    return { updatedOrder, netAdjustment };
  }

  /**
   * Stripe standard fee: 2.9% + $0.30
   */
  static calculateStripeFees(grossAmount: number): { fee: number; net: number } {
    const fee = Number((grossAmount * 0.029 + 0.30).toFixed(2));
    const net = Number((grossAmount - fee).toFixed(2));
    return { fee, net };
  }

  /**
   * Square standard fee: 2.9% + $0.30 (Cards & Cash App Pay)
   */
  static calculateSquareFees(grossAmount: number): { fee: number; net: number } {
    const fee = Number((grossAmount * 0.029 + 0.30).toFixed(2));
    const net = Number((grossAmount - fee).toFixed(2));
    return { fee, net };
  }
}
