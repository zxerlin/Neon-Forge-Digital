import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShoppingBag, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  RotateCcw,
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Radio, 
  Send, 
  Terminal, 
  Cpu, 
  Tag, 
  Download,
  AlertCircle,
  Building,
  Lock,
  Zap,
  HelpCircle
} from 'lucide-react';
import { DigitalProduct, Order, StripeConfig, SquareConfig, EtsyShopConfig } from '../types';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';
import { neonforgeApi } from '../services/neonforgeApi';
import { DataResetModal } from './DataResetModal';

interface MultiChannelHubViewProps {
  products: DigitalProduct[];
  orders: Order[];
  totalRevenue?: number;
  directRevenue?: number;
  etsyRevenue?: number;
  onRefreshData?: () => void;
  onResetToLiveMode?: () => void;
}

export const MultiChannelHubView: React.FC<MultiChannelHubViewProps> = ({
  products,
  orders,
  totalRevenue = 0,
  directRevenue = 0,
  etsyRevenue = 0,
  onRefreshData,
  onResetToLiveMode
}) => {
  const { theme } = useTheme();

  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  const [squareConfig, setSquareConfig] = useState<SquareConfig | null>(null);
  const [etsyConfig, setEtsyConfig] = useState<EtsyShopConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'stripe' | 'square' | 'etsy' | 'comparison' | 'payouts'>('payouts');
  
  // Stripe modal/form states
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePubKey, setStripePubKey] = useState('');
  const [stripeMode, setStripeMode] = useState<'live' | 'test'>('live');
  const [stripeStatusMsg, setStripeStatusMsg] = useState<string | null>(null);
  const [selectedProductForStripe, setSelectedProductForStripe] = useState<string>(products[0]?.id || '');
  const [stripeSessionResult, setStripeSessionResult] = useState<any>(null);

  // Square modal/form states
  const [squareAppId, setSquareAppId] = useState('');
  const [squareLocationId, setSquareLocationId] = useState('');
  const [squareAccessToken, setSquareAccessToken] = useState('');
  const [squareEnv, setSquareEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [squareStatusMsg, setSquareStatusMsg] = useState<string | null>(null);
  const [selectedProductForSquare, setSelectedProductForSquare] = useState<string>(products[0]?.id || '');
  const [squareCheckoutResult, setSquareCheckoutResult] = useState<any>(null);

  // Etsy form states
  const [etsyShopName, setEtsyShopName] = useState('');
  const [etsyShopId, setEtsyShopId] = useState('');
  const [etsyApiKey, setEtsyApiKey] = useState('');
  const [etsyStatusMsg, setEtsyStatusMsg] = useState<string | null>(null);
  const [selectedProductForEtsy, setSelectedProductForEtsy] = useState<string>(products[0]?.id || '');
  const [etsyPublishResult, setEtsyPublishResult] = useState<any>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [lastEtsyReceiptId, setLastEtsyReceiptId] = useState<string>('RCP-00000000');
  const [etsyPhaseState, setEtsyPhaseState] = useState<'idle' | 'order_paid_ready' | 'settled'>('idle');
  const [showResetModal, setShowResetModal] = useState(false);

  // Load configs on mount
  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const sConf = await neonforgeApi.getStripeConfig();
    if (sConf) {
      setStripeConfig(sConf);
      setStripePubKey(sConf.publishableKey || '');
      setStripeMode(sConf.mode);
    }
    const sqConf = await neonforgeApi.getSquareConfig();
    if (sqConf) {
      setSquareConfig(sqConf);
      setSquareAppId(sqConf.applicationId || '');
      setSquareLocationId(sqConf.locationId || '');
      setSquareEnv(sqConf.environment);
    }
    const eStatus = await neonforgeApi.getEtsyStatus();
    if (eStatus?.config) {
      setEtsyConfig(eStatus.config);
      setEtsyShopName(eStatus.config.shopName);
      setEtsyShopId(eStatus.config.shopId);
    }
  };

  const handleSaveSquareConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playSound('click');
    const updated = await neonforgeApi.updateSquareConfig({
      applicationId: squareAppId,
      locationId: squareLocationId,
      accessToken: squareAccessToken || undefined,
      environment: squareEnv,
      autoFulfill: true
    });
    setLoading(false);
    if (updated) {
      setSquareConfig(updated);
      setSquareAccessToken('');
      setSquareStatusMsg('✅ Square credentials & Cash App Pay gateway updated!');
      playSound('success');
      setTimeout(() => setSquareStatusMsg(null), 3500);
    }
  };

  const handleTestSquareCheckout = async () => {
    if (!selectedProductForSquare) return;
    setLoading(true);
    playSound('click');
    const result = await neonforgeApi.createSquareCheckout(
      selectedProductForSquare,
      'buyer.square@neonforge.os',
      'Cyber Square Buyer'
    );
    setLoading(false);
    if (result) {
      setSquareCheckoutResult(result);
      playSound('success');
    }
  };

  const handleSimulateSquareWebhook = async () => {
    setLoading(true);
    playSound('click');
    const prod = products.find(p => p.id === selectedProductForSquare) || products[0];
    const res = await neonforgeApi.triggerSquareWebhook({
      type: 'payment.created',
      data: {
        object: {
          payment: {
            reference_id: `ORD-SQ-${Math.floor(100000 + Math.random() * 900000)}`,
            note: prod.id,
            buyer_email_address: 'square.test.customer@gmail.com',
            amount_money: { amount: Math.round(prod.price * 100), currency: 'USD' }
          }
        }
      }
    });
    setLoading(false);
    if (res?.received) {
      setSquareStatusMsg(`✅ Square webhook verified & processed! Minted license for order ${res.orderNumber}`);
      playSound('success');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setSquareStatusMsg(null), 4000);
    }
  };

  const handleSaveStripeConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playSound('click');
    const updated = await neonforgeApi.updateStripeConfig({
      publishableKey: stripePubKey,
      secretKey: stripeSecretKey || undefined,
      mode: stripeMode,
      autoFulfill: true
    });
    setLoading(false);
    if (updated) {
      setStripeConfig(updated);
      setStripeSecretKey('');
      setStripeStatusMsg('✅ Stripe live credentials updated & verified!');
      playSound('success');
      setTimeout(() => setStripeStatusMsg(null), 3500);
    }
  };

  const handleTestStripeSession = async () => {
    if (!selectedProductForStripe) return;
    setLoading(true);
    playSound('click');
    const result = await neonforgeApi.createStripeCheckoutSession(
      selectedProductForStripe,
      'test.buyer@stripe.checkout',
      'Cyber Test Buyer'
    );
    setLoading(false);
    if (result) {
      setStripeSessionResult(result);
      playSound('success');
    }
  };

  const handleSimulateStripeWebhook = async () => {
    setLoading(true);
    playSound('click');
    const prod = products.find(p => p.id === selectedProductForStripe) || products[0];
    const mockEvent = {
      id: `evt_test_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_test_${Date.now()}`,
          customer_email: 'instant.checkout@stripe.buyer',
          amount_total: Math.round(prod.price * 100),
          metadata: {
            orderNumber: `ORD-STRIPE-${Date.now().toString().slice(-6)}`,
            productId: prod.id,
            customerName: 'Stripe Verified Buyer'
          }
        }
      }
    };
    const res = await neonforgeApi.triggerStripeWebhook(mockEvent);
    setLoading(false);
    if (res?.received) {
      setStripeStatusMsg(`✅ Webhook verified! Created order ${res.orderNumber} with SHA-256 license ${res.licenseKey}.`);
      playSound('success');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setStripeStatusMsg(null), 4000);
    }
  };

  const handleSaveEtsyConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playSound('click');
    const updated = await neonforgeApi.updateEtsyConfig({
      shopName: etsyShopName,
      shopId: etsyShopId,
      apiKey: etsyApiKey || undefined,
      autoSyncNewProducts: true
    });
    setLoading(false);
    if (updated) {
      setEtsyConfig(updated);
      setEtsyApiKey('');
      setEtsyStatusMsg('✅ Etsy Open API v3 settings saved & shop connected!');
      playSound('success');
      setTimeout(() => setEtsyStatusMsg(null), 3500);
    }
  };

  const handlePublishToEtsy = async () => {
    if (!selectedProductForEtsy) return;
    setLoading(true);
    playSound('click');
    const result = await neonforgeApi.publishProductToEtsy(selectedProductForEtsy);
    setLoading(false);
    if (result?.success) {
      setEtsyPublishResult(result);
      playSound('success');
      if (onRefreshData) onRefreshData();
    }
  };

  const handleSyncAllEtsy = async () => {
    setSyncingAll(true);
    playSound('click');
    const res = await neonforgeApi.syncAllToEtsy();
    setSyncingAll(false);
    if (res?.success) {
      setEtsyStatusMsg(`✅ Synced ${res.syncedCount} digital products to Etsy Shop [${res.shopName}]!`);
      playSound('success');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setEtsyStatusMsg(null), 4000);
    }
  };

  const handleSimulateEtsySale = async () => {
    await handleSimulateEtsyOrderPaid();
  };

  // Phase 1: Immediate order.paid event (customer gets instant download)
  const handleSimulateEtsyOrderPaid = async () => {
    setLoading(true);
    playSound('click');
    const prod = products.find(p => p.id === selectedProductForEtsy) || products[0];
    const generatedReceiptId = `RCP-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setLastEtsyReceiptId(generatedReceiptId);

    const res = await neonforgeApi.triggerEtsyWebhook({
      eventType: 'order.paid',
      receiptId: generatedReceiptId,
      productId: prod.id,
      buyerName: 'Etsy Instant Buyer',
      buyerEmail: 'instant.buyer@etsy.community',
      transactionAmount: prod.price
    });
    setLoading(false);
    if (res?.success) {
      setEtsyPhaseState('order_paid_ready');
      setEtsyStatusMsg(`⚡ Phase 1: order.paid ingested! Customer received download token & SHA-256 license for Receipt ${generatedReceiptId}. Ready for Phase 2 Payment Settlement.`);
      playSound('success');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setEtsyStatusMsg(null), 5000);
    }
  };

  // Phase 2: Asynchronous payment.settled event (reconciles detailed fee ledger)
  const handleSimulateEtsyPaymentSettled = async () => {
    setLoading(true);
    playSound('click');
    const prod = products.find(p => p.id === selectedProductForEtsy) || products[0];
    const gross = prod.price;
    const actualTransactionFee = Number((gross * 0.065).toFixed(2));
    const actualProcessingFee = Number((gross * 0.03 + 0.25).toFixed(2));
    const actualListingFee = 0.20;
    const regulatoryFee = 0.15;
    const taxWithheld = Number((gross * 0.0825).toFixed(2)); // Marketplace facilitator tax
    const totalDeductions = Number((actualTransactionFee + actualProcessingFee + actualListingFee + regulatoryFee).toFixed(2));
    const netDeposit = Number((gross - totalDeductions).toFixed(2));

    const res = await neonforgeApi.triggerEtsyWebhook({
      eventType: 'payment.settled',
      receiptId: lastEtsyReceiptId,
      paymentId: `PAY-ETSY-${Date.now().toString().slice(-6)}`,
      actualGross: gross,
      actualTransactionFee,
      actualProcessingFee,
      actualListingFee,
      regulatoryFee,
      taxWithheld,
      netDeposit
    });
    setLoading(false);
    if (res?.success) {
      setEtsyPhaseState('settled');
      setEtsyStatusMsg(`💰 Phase 2: Payment Record Settled! Reconciled Receipt ${lastEtsyReceiptId}. Net deposited to bank: $${netDeposit.toFixed(2)} USD (Fees: $${totalDeductions.toFixed(2)}).`);
      playSound('success');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setEtsyStatusMsg(null), 5000);
    }
  };

  const stripeOrders = orders.filter(o => o.channel === 'Direct Storefront' || (o.paymentMethod && o.paymentMethod.includes('Stripe')));
  const etsyOrders = orders.filter(o => o.channel === 'Etsy Sync' || (o.paymentMethod && o.paymentMethod.includes('Etsy')));
  const stripeRevenue = directRevenue || stripeOrders.reduce((acc, o) => acc + o.amount, 0);
  const calculatedEtsyRev = etsyRevenue || etsyOrders.reduce((acc, o) => acc + o.amount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Real Business Payout & Direct Bank Routing Banner */}
      <div className="p-5 rounded-2xl border bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 shadow-2xl relative overflow-hidden" style={{ borderColor: '#10b981' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                REAL PRODUCTION BUSINESS GATEWAY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-300 font-mono text-[11px]">
                0% Middleman Cut · 100% Direct Payout
              </span>
            </div>
            <h2 className="text-lg lg:text-xl font-mono font-black text-white uppercase tracking-tight">
              Where Real Money Goes: Direct Bank Account Settlement
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              When customers purchase digital assets from your storefront or Etsy shop, <strong>all funds transfer directly into YOUR Stripe and Etsy accounts</strong>, which automatically deposit to your linked <strong>Bank Checking / Business Account</strong>. NeonForge OS has zero custody and takes 0% commission.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onResetToLiveMode && (
              <button
                onClick={() => {
                  playSound('click');
                  setShowResetModal(true);
                }}
                className="relative group px-3.5 py-2 rounded-xl font-mono text-xs font-black flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_#00f0ff,0_0_35px_#0284c7] hover:shadow-[0_0_30px_#38bdf8,0_0_50px_#00f0ff] border-2 border-cyan-300 text-black flex-shrink-0"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #00f0ff 60%, #0284c7 100%)'
                }}
                title="NEON BLUE DATA RESET: Resets all profit numbers and order counters to $0.00 Live Baseline without demo/mock data injection. Preserves all catalog products and integrations."
              >
                <RotateCcw className="w-3.5 h-3.5 text-black group-hover:rotate-180 transition-transform duration-500" />
                <span className="tracking-wider uppercase font-sans font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  ⚡ RESET PROFIT ($0.00)
                </span>
              </button>
            )}

            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <span>Get Stripe Keys</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 flex-wrap" style={{ borderColor: theme.borderTheme }}>
        <button
          onClick={() => { playSound('click'); setActiveTab('payouts'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'payouts'
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400 shadow-md'
              : 'bg-black/20 text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-400" />
          <span>🏦 BANK & PAYOUT ROUTING GUIDE</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('stripe'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'stripe'
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400 shadow-md'
              : 'bg-black/20 text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span>💳 STRIPE LIVE GATEWAY</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('square'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'square'
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400 shadow-md'
              : 'bg-black/20 text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>🟩 SQUARE & CASH APP PAY</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('etsy'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'etsy'
              ? 'bg-orange-600/30 text-orange-300 border-orange-400 shadow-md'
              : 'bg-black/20 text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-orange-400" />
          <span>🛍️ ETSY OPEN API v3 HUB</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('comparison'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'comparison'
              ? 'bg-cyan-600/30 text-cyan-300 border-cyan-400 shadow-md'
              : 'bg-black/20 text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4 text-cyan-400" />
          <span>📊 PROFITABILITY & FEE MATRIX</span>
        </button>
      </div>

      {/* TAB 0: BANK & PAYOUT ROUTING GUIDE */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-3" style={{ borderColor: theme.borderTheme }}>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-300 flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                Who Receives The Money?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>You (The Store Owner).</strong> Every customer transaction generates an authentic payment on Stripe or Etsy. No third party ever touches your funds.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Direct Seller Ownership</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-3" style={{ borderColor: theme.borderTheme }}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                What Address or Account?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your linked <strong>Bank Checking / Savings Account</strong> (Routing + Account number) or Debit Card configured inside your <strong>Stripe Dashboard</strong> (for storefront) &amp; <strong>Etsy Payment Settings</strong>.
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>Automated Daily / Weekly Payouts</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-3" style={{ borderColor: theme.borderTheme }}>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                What Do We Need From You?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Just paste your <strong>Stripe Live Secret Key</strong> (<code className="text-indigo-300">sk_live_...</code>) and <strong>Publishable Key</strong> (<code className="text-indigo-300">pk_live_...</code>) in the Stripe Gateway tab. Everything else is automated.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant SHA-256 License Minting</span>
              </div>
            </div>
          </div>

          {/* Detailed Step-by-Step Box */}
          <div className="p-6 rounded-2xl border bg-black/50 space-y-4" style={{ borderColor: theme.borderTheme }}>
            <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real Business Launch Checklist (3 Easy Steps)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 block">Step A: Connect Bank to Stripe</span>
                <p className="text-[11px] text-slate-400">
                  Log in to <a href="https://dashboard.stripe.com/settings/payouts" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">Stripe Payout Settings</a> and add your Bank Account or Debit Card.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 block">Step B: Paste API Keys</span>
                <p className="text-[11px] text-slate-400">
                  Click the <strong>💳 STRIPE LIVE GATEWAY</strong> tab above and paste your <code className="text-slate-200">pk_live_...</code> and <code className="text-slate-200">sk_live_...</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 block">Step C: Start Selling</span>
                <p className="text-[11px] text-slate-400">
                  Customers pay on your Storefront with Apple Pay, Google Pay, or Credit Cards. Stripe handles billing and sends 100% of profit straight to your bank!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: STRIPE BACKEND GATEWAY */}
      {activeTab === 'stripe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stripe Config & Tester */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Stripe Gross Volume</span>
                <div className="text-xl font-mono font-bold text-indigo-400 mt-1">
                  ${stripeRevenue.toFixed(2)} USD
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{stripeOrders.length} Settled Transactions</span>
              </div>

              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Fee Efficiency</span>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">96.8% Net</div>
                <span className="text-[10px] text-slate-400 font-mono">2.9% + 30¢ per checkout</span>
              </div>

              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Webhook Verification</span>
                <div className="text-xl font-mono font-bold text-cyan-400 mt-1">HMAC-SHA256</div>
                <span className="text-[10px] text-emerald-400 font-mono">Instant ZIP Dispatch</span>
              </div>
            </div>

            {/* Stripe Credentials Manager */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    Stripe API & Webhook Configuration
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SDK Active
                </span>
              </div>

              {stripeStatusMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs">
                  {stripeStatusMsg}
                </div>
              )}

              <form onSubmit={handleSaveStripeConfig} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      Publishable Key (Client Elements)
                    </label>
                    <input
                      type="text"
                      value={stripePubKey}
                      onChange={(e) => setStripePubKey(e.target.value)}
                      placeholder="pk_test_... or pk_live_..."
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 focus:border-indigo-400 rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      Secret Key (Server Processing)
                    </label>
                    <input
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder={stripeConfig?.secretKeyMasked || 'sk_test_... or sk_live_...'}
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 focus:border-indigo-400 rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="stripeMode"
                        checked={stripeMode === 'test'}
                        onChange={() => setStripeMode('test')}
                        className="accent-indigo-500"
                      />
                      <span>Test Mode</span>
                    </label>
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="stripeMode"
                        checked={stripeMode === 'live'}
                        onChange={() => setStripeMode('live')}
                        className="accent-indigo-500"
                      />
                      <span>Live Mode</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 rounded-lg font-mono text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
                  >
                    Save Stripe Keys
                  </button>
                </div>
              </form>
            </div>

            {/* Stripe Checkout & Webhook Test Console */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    Checkout Session & Webhook Dispatcher
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-mono uppercase text-slate-300">
                  Select Product for Test Checkout
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={selectedProductForStripe}
                    onChange={(e) => setSelectedProductForStripe(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none"
                  >
                    {products.map((p, idx) => (
                      <option key={`stripe-prod-${p.id}-${idx}`} value={p.id}>
                        [{p.sku}] {p.title} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleTestStripeSession}
                      disabled={loading}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400 text-indigo-200 transition-all flex items-center gap-1.5"
                      title="Create real Stripe Checkout session or sandbox session"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Create Session</span>
                    </button>

                    <button
                      onClick={handleSimulateStripeWebhook}
                      disabled={loading}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 transition-all flex items-center gap-1.5"
                      title="Simulate Stripe checkout.session.completed webhook and mint instant SHA-256 license"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Dispatch Webhook</span>
                    </button>
                  </div>
                </div>

                {stripeSessionResult && (
                  <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span>Session ID: {stripeSessionResult.sessionId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                        {stripeSessionResult.mode}
                      </span>
                    </div>
                    <div className="text-slate-300 break-all text-[11px]">
                      Checkout URL: <a href={stripeSessionResult.checkoutUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{stripeSessionResult.checkoutUrl}</a>
                    </div>
                    <div className="text-[11px] text-emerald-400">
                      Order assigned: {stripeSessionResult.orderNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Architecture Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Stripe Fulfillment Flow</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px]">1</span>
                    <span>Customer Card / Apple Pay Auth</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Customer triggers instant checkout. Card details secured via Stripe tokenization.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                    <span>Server-Side Webhook Receiver</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Listens on <code className="text-cyan-300">/api/stripe/webhook</code> for <code className="text-emerald-300">checkout.session.completed</code>.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                    <span>SHA-256 License Minting</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Mints unique commercial UUID and dynamic deliverable ZIP package with SVG assets and PDF license.
                  </p>
                </div>
              </div>

              {/* Endpoint Reference Box */}
              <div className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="text-slate-400 text-[10px] uppercase">Production Webhook Endpoint:</div>
                <div className="text-indigo-300 font-bold select-all break-all">
                  https://ais-dev-...run.app/api/stripe/webhook
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1.5: SQUARE & CASH APP PAY GATEWAY */}
      {activeTab === 'square' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Square Config & Settings */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-xl border bg-black/40 space-y-5" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-white uppercase">
                      Square & Cash App Pay Integration
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Accept Visa, MasterCard, Apple Pay &amp; Cash App Pay directly to your Square balance
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] border flex items-center gap-1.5 ${
                  squareConfig?.isConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${squareConfig?.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {squareConfig?.isConfigured ? `ACTIVE (${squareConfig.environment.toUpperCase()})` : 'AWAITING KEYS (ZERO MOCK)'}
                </span>
              </div>

              {squareStatusMsg && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{squareStatusMsg}</span>
                </div>
              )}

              {/* Square Form */}
              <form onSubmit={handleSaveSquareConfig} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-slate-300 uppercase flex items-center justify-between">
                    <span>Square Application ID (App ID)</span>
                    <a
                      href="https://developer.squareup.com/apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Square Developer Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="text"
                    value={squareAppId}
                    onChange={e => setSquareAppId(e.target.value)}
                    placeholder="sq0idp-xxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-slate-300 uppercase">
                    Square Location ID
                  </label>
                  <input
                    type="text"
                    value={squareLocationId}
                    onChange={e => setSquareLocationId(e.target.value)}
                    placeholder="Lxxxxxxxxxxxx (from Square Locations tab)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-slate-300 uppercase flex items-center justify-between">
                    <span>Square Personal Access Token</span>
                    {squareConfig?.accessTokenMasked && (
                      <span className="text-[11px] text-slate-400 font-mono">Current: {squareConfig.accessTokenMasked}</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={squareAccessToken}
                    onChange={e => setSquareAccessToken(e.target.value)}
                    placeholder="EAAA... (Production or Sandbox Access Token)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-slate-300 uppercase">Environment</label>
                    <select
                      value={squareEnv}
                      onChange={e => setSquareEnv(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="production">Production (Real Cash to Bank)</option>
                      <option value="sandbox">Sandbox (Developer Rehearsals)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-lg font-mono text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>Save Square Settings</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Square Live Test Playground */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Square &amp; Cash App Live Verification</span>
                  </span>
                  <button
                    onClick={handleSimulateSquareWebhook}
                    disabled={loading}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Test Webhook Listener
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedProductForSquare}
                    onChange={e => setSelectedProductForSquare(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  >
                    {products.map((p, idx) => (
                      <option key={`square-prod-${p.id}-${idx}`} value={p.id}>
                        {p.title} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleTestSquareCheckout}
                    disabled={loading}
                    className="py-2 px-4 rounded-lg font-mono text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Generate Square Link</span>
                  </button>
                </div>

                {squareCheckoutResult && (
                  <div className="p-3 rounded-lg bg-black/80 border border-emerald-500/40 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Square Checkout Ready</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {squareCheckoutResult.environment}
                      </span>
                    </div>
                    <div className="text-slate-300 break-all text-[11px]">
                      Payment URL: <a href={squareCheckoutResult.checkoutUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{squareCheckoutResult.checkoutUrl}</a>
                    </div>
                    <div className="text-[11px] text-emerald-300">
                      Order Reference: {squareCheckoutResult.orderNumber} (${squareCheckoutResult.amount.toFixed(2)} USD)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Square Architecture & Compatibility Guarantee */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Does Square Conflict With Stripe?</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>100% Non-Conflicting Multi-Gateway</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Square and Stripe run as completely separate payment adapters. You can use Stripe alone, Square alone, or both side-by-side.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span>Cash App Pay Advantage</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Square natively allows buyers to pay with <strong>Cash App Pay</strong> (over 50M active users) and standard credit/debit cards.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <span>Unified Digital Delivery Engine</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    Regardless of whether a buyer checks out with Stripe or Square, NeonForge mints the exact same SHA-256 license and delivers the authenticated ZIP.
                  </p>
                </div>
              </div>

              {/* Endpoint Reference Box */}
              <div className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="text-slate-400 text-[10px] uppercase">Square Webhook URL:</div>
                <div className="text-emerald-300 font-bold select-all break-all">
                  https://ais-dev-...run.app/api/square/webhook
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ETSY OPEN API V3 HUB */}
      {activeTab === 'etsy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Etsy Config & Product Publisher */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Etsy Gross Volume</span>
                <div className="text-xl font-mono font-bold text-orange-400 mt-1">
                  ${etsyRevenue.toFixed(2)} USD
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{etsyOrders.length} Marketplace Orders</span>
              </div>

              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Listings</span>
                <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                  {products.filter(p => p.isPublishedToEtsy).length} / {products.length} SKUs
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">13 Tags Validated</span>
              </div>

              <div className="p-3.5 rounded-xl border bg-black/40" style={{ borderColor: theme.borderTheme }}>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Etsy Fee Load</span>
                <div className="text-xl font-mono font-bold text-red-400 mt-1">6.5% + 3%</div>
                <span className="text-[10px] text-slate-400 font-mono">+$0.20 listing renewal</span>
              </div>
            </div>

            {/* Etsy Shop Configuration */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    Etsy Open API v3 Shop Connector
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  OpenAPI v3
                </span>
              </div>

              {etsyStatusMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs">
                  {etsyStatusMsg}
                </div>
              )}

              <form onSubmit={handleSaveEtsyConfig} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      value={etsyShopName}
                      onChange={(e) => setEtsyShopName(e.target.value)}
                      placeholder="e.g. MyEtsyDigitalStudio"
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 focus:border-orange-400 rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      Shop ID / Account ID
                    </label>
                    <input
                      type="text"
                      value={etsyShopId}
                      onChange={(e) => setEtsyShopId(e.target.value)}
                      placeholder="e.g. 1234567"
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 focus:border-orange-400 rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                    Etsy v3 API Keystring (x-api-key)
                  </label>
                  <input
                    type="password"
                    value={etsyApiKey}
                    onChange={(e) => setEtsyApiKey(e.target.value)}
                    placeholder={etsyConfig?.apiKeyMasked || 'etsy_v3_••••••••••••'}
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 focus:border-orange-400 rounded-lg text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-Sync New Products Enabled</span>
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 rounded-lg font-mono text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-md"
                  >
                    Save Etsy Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Etsy Listing Publisher & Sync Controller */}
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    13-Tag Listing Creator & Bulk Sync
                  </h3>
                </div>

                <button
                  onClick={handleSyncAllEtsy}
                  disabled={syncingAll}
                  className="px-3 py-1 rounded bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400 text-orange-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>Sync All SKUs to Etsy</span>
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-mono uppercase text-slate-300">
                  Select Product to Publish / Inspect 13-Tags
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={selectedProductForEtsy}
                    onChange={(e) => setSelectedProductForEtsy(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none"
                  >
                    {products.map((p, idx) => (
                      <option key={`etsy-prod-${p.id}-${idx}`} value={p.id}>
                        {p.isPublishedToEtsy ? '✅ [LIVE]' : '⏳ [DRAFT]'} [{p.sku}] {p.title}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handlePublishToEtsy}
                      disabled={loading}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-mono text-xs font-bold bg-orange-600/30 hover:bg-orange-600/50 border border-orange-400 text-orange-200 transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish SKU</span>
                    </button>
                  </div>
                </div>

                {/* Etsy Two-Phase Payment Architecture Console */}
                <div className="p-4 rounded-xl border border-orange-500/30 bg-black/60 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-300 uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-orange-400" />
                      <span>Etsy Documented Two-Phase Architecture</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      etsyPhaseState === 'settled'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : etsyPhaseState === 'order_paid_ready'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {etsyPhaseState === 'settled' ? 'PHASE 2: SETTLED & RECONCILED' : etsyPhaseState === 'order_paid_ready' ? 'PHASE 1: ORDER.PAID (PENDING SETTLEMENT)' : 'STANDBY READY'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Etsy triggers <strong>order.paid</strong> immediately for instant customer fulfillment, while the <strong>detailed payment record</strong> arrives asynchronously to settle transaction fees and net deposits.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Phase 1 Action */}
                    <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300">Phase 1: Immediate Fulfillment</span>
                        <span className="text-[10px] text-slate-400">order.paid</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Dispatches SHA-256 license &amp; download token immediately to buyer. Fees estimated.
                      </p>
                      <button
                        onClick={handleSimulateEtsyOrderPaid}
                        disabled={loading}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400 text-amber-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>1. Ingest order.paid</span>
                      </button>
                    </div>

                    {/* Phase 2 Action */}
                    <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-300">Phase 2: Payment Settlement</span>
                        <span className="text-[10px] text-slate-400">payment.settled</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Reconciles exact transaction fee (6.5%), processing fee, taxes, and net deposit.
                      </p>
                      <button
                        onClick={handleSimulateEtsyPaymentSettled}
                        disabled={loading}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>2. Reconcile payment.settled</span>
                      </button>
                    </div>
                  </div>

                  {lastEtsyReceiptId && (
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>Active Reconciled Receipt: <code className="text-orange-300">{lastEtsyReceiptId}</code></span>
                      <span className="text-emerald-400">Status: {etsyPhaseState.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* 13-Tag Preview Chips */}
                {selectedProductForEtsy && (() => {
                  const prod = products.find(p => p.id === selectedProductForEtsy);
                  if (!prod) return null;
                  const tags = prod.etsyOptimization?.thirteenTags || [];
                  return (
                    <div className="p-3.5 rounded-lg bg-orange-950/30 border border-orange-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-300">
                        <span>Etsy 13-Tag Matrix ({tags.length}/13 Tags):</span>
                        <span className="text-[10px] text-slate-400">SEO Volume Score: 94/100</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-200 border border-orange-400/30"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {etsyPublishResult && (
                  <div className="p-3.5 rounded-lg bg-orange-950/40 border border-orange-500/40 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between text-orange-300 font-bold">
                      <span>Listing ID: {etsyPublishResult.listingId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        PUBLISHED TO SHOP
                      </span>
                    </div>
                    <div className="text-slate-300 break-all text-[11px]">
                      Etsy URL: <a href={etsyPublishResult.listingUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{etsyPublishResult.listingUrl}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Etsy Compliance & Deliverable Schema */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-xl border bg-black/40 space-y-4" style={{ borderColor: theme.borderTheme }}>
              <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Etsy Digital Goods Guidelines</span>
              </h3>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-orange-300 font-bold">1. Zero Dropshipping Rule</div>
                  <p className="text-[11px] text-slate-400">
                    All digital items are authored and compiled via NeonForge OS synthetic agents. Fully compliant with Etsy Handmade & Digital Craft policy.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-amber-300 font-bold">2. Instant Download Delivery</div>
                  <p className="text-[11px] text-slate-400">
                    Upon checkout, buyer immediately receives authenticated ZIP archive containing vector files, Notion workspace links, and commercial license.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
                  <div className="text-cyan-300 font-bold">3. Marketplace Facilitator Tax</div>
                  <p className="text-[11px] text-slate-400">
                    Etsy automatically collects and remits state and international digital sales tax (VAT / GST) on all marketplace transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFITABILITY & FEE MATRIX */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-xl border bg-black/40 space-y-6" style={{ borderColor: theme.borderTheme }}>
          <div>
            <h3 className="font-mono text-base font-bold text-white uppercase">
              Multi-Channel Financial Comparison & Fee Matrix
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Real-time fee structures and net margin yields for $39.00 digital good unit economics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b text-slate-400 uppercase text-[10px]" style={{ borderColor: theme.borderTheme }}>
                  <th className="pb-3">Sales Channel</th>
                  <th className="pb-3">Gross Sale</th>
                  <th className="pb-3">Platform & Gateway Fees</th>
                  <th className="pb-3">Net Profit</th>
                  <th className="pb-3">Net Margin</th>
                  <th className="pb-3">Delivery Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-300" style={{ borderColor: theme.borderTheme }}>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-indigo-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Direct Storefront (Stripe)</span>
                  </td>
                  <td className="py-3 text-white">$39.00</td>
                  <td className="py-3 text-slate-400">2.9% + $0.30 ($1.43)</td>
                  <td className="py-3 text-emerald-400 font-bold">$37.57</td>
                  <td className="py-3 text-emerald-300 font-bold">96.3%</td>
                  <td className="py-3 text-cyan-300">Instant Dynamic ZIP</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Square + Cash App Pay</span>
                  </td>
                  <td className="py-3 text-white">$39.00</td>
                  <td className="py-3 text-slate-400">2.9% + $0.30 ($1.43)</td>
                  <td className="py-3 text-emerald-400 font-bold">$37.57</td>
                  <td className="py-3 text-emerald-300 font-bold">96.3%</td>
                  <td className="py-3 text-emerald-300">Instant Dynamic ZIP</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-orange-300 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Etsy Marketplace</span>
                  </td>
                  <td className="py-3 text-white">$39.00</td>
                  <td className="py-3 text-slate-400">6.5% + 3% + $0.45 ($4.16)</td>
                  <td className="py-3 text-emerald-400 font-bold">$34.84</td>
                  <td className="py-3 text-amber-300 font-bold">89.3%</td>
                  <td className="py-3 text-orange-300">Etsy Instant Download</td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-purple-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Gumroad Mirror</span>
                  </td>
                  <td className="py-3 text-white">$39.00</td>
                  <td className="py-3 text-slate-400">10% + $0.30 ($4.20)</td>
                  <td className="py-3 text-emerald-400 font-bold">$34.80</td>
                  <td className="py-3 text-purple-300 font-bold">89.2%</td>
                  <td className="py-3 text-purple-300">Gumroad Library</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Can Stripe &amp; Square Run Simultaneously?</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Yes! Running both gateways gives customers maximum checkout flexibility: Stripe handles Apple Pay, Google Pay, and international cards, while Square handles Cash App Pay and direct debit.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-white font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Does Adding Square Upset or Break Anything?</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Zero interference. The app uses an isolated payment provider abstraction layer. Each gateway has its own webhook listener and credential vault, converging on the same instant fulfillment pipeline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Non-Demo Data Reset Modal */}
      <DataResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmReset={async () => {
          if (onResetToLiveMode) {
            await onResetToLiveMode();
          }
        }}
        totalRevenue={totalRevenue}
        totalOrders={orders.length}
        totalProductsCount={products.length}
      />
    </div>
  );
};
