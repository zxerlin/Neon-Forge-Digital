import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  Download, 
  ShieldCheck, 
  CreditCard, 
  Check, 
  Lock, 
  Zap, 
  Eye, 
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Tag,
  Layers,
  FileCode,
  Flame,
  X,
  SlidersHorizontal,
  Gift,
  Plus,
  Video,
  Send,
  HelpCircle,
  Globe,
  Headphones,
  Award,
  Clock,
  Terminal,
  Cpu,
  Share2,
  TrendingUp,
  PackageCheck,
  CheckCircle
} from 'lucide-react';
import { DigitalProduct, Order, Customer, SupportTicket } from '../types';
import { playSound } from '../utils/audio';
import { neonforgeApi } from '../services/neonforgeApi';

interface LiveStorefrontViewProps {
  products: DigitalProduct[];
  onPlaceOrder: (order: Order, customer: Customer) => void;
  onDispatchTicket?: (ticket: SupportTicket) => void;
}

export const LiveStorefrontView: React.FC<LiveStorefrontViewProps> = ({
  products,
  onPlaceOrder,
  onDispatchTicket
}) => {
  const [activeChannel, setActiveChannel] = useState<'store' | 'etsy'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inspection Modal State
  const [inspectProduct, setInspectProduct] = useState<DigitalProduct | null>(null);

  // Checkout Drawer / Modal State
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [customerName, setCustomerName] = useState('Alex Rivers');
  const [customerEmail, setCustomerEmail] = useState('alex.rivers@creatorstudios.co');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card / Stripe' | 'Apple Pay' | 'Etsy Payments'>('Credit Card / Stripe');
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Digital Product Options & Bumps State
  const [selectedLicense, setSelectedLicense] = useState<'Personal Use' | 'Commercial Standard' | 'Extended Resale Pro'>('Commercial Standard');
  const [selectedPackage, setSelectedPackage] = useState<'Standard Asset Vault' | 'Deluxe Creator Studio Bundle'>('Standard Asset Vault');
  const [selectedBumps, setSelectedBumps] = useState<string[]>(['bump_reels_pack']);

  // Commission & Contact Form State
  const [commissionForm, setCommissionForm] = useState({
    name: '',
    email: '',
    assetType: 'Custom Notion Operating System',
    budget: '$150 - $400',
    deadline: 'Within 72 Hours',
    description: ''
  });
  const [commissionSubmitted, setCommissionSubmitted] = useState(false);

  // Quick Ticket Support State
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    issueType: 'Download Issue' as SupportTicket['issueType'],
    message: ''
  });
  const [ticketStatusMsg, setTicketStatusMsg] = useState<string | null>(null);
  const [isDispatchingTicket, setIsDispatchingTicket] = useState(false);

  // Price mappings for options
  const licensePriceMap: Record<string, number> = {
    'Personal Use': 0,
    'Commercial Standard': 12,
    'Extended Resale Pro': 29
  };

  const packagePriceMap: Record<string, number> = {
    'Standard Asset Vault': 0,
    'Deluxe Creator Studio Bundle': 15
  };

  const availableBumps = [
    {
      id: 'bump_reels_pack',
      title: '50 Faceless Viral Video Reels + Hooks Pack',
      tagline: 'Ready-to-post short-form video templates for Instagram Reels & TikTok',
      price: 9.99,
      badge: 'POPULAR ADD-ON',
      deliverable: {
        name: '50_Faceless_Reels_Video_Templates.zip',
        size: '142.5 MB',
        format: 'MP4 / Canva Reels Templates',
        contentPreview: '50 Faceless aesthetic reels + viral hook audio templates.'
      }
    },
    {
      id: 'bump_vip_support',
      title: 'VIP Express Priority Delivery & License Certification',
      tagline: '1-on-1 priority support, lifetime update pass & verified certificate',
      price: 14.99,
      badge: 'VIP PASS',
      deliverable: {
        name: 'VIP_Express_License_Certificate.pdf',
        size: '1.2 MB',
        format: 'Verified VIP Certificate',
        contentPreview: 'Priority license validation certificate and direct priority support key.'
      }
    },
    {
      id: 'bump_mrr_resell',
      title: 'Master Resale Rights (MRR) Franchise Pass',
      tagline: 'Sell this product on Etsy or direct store & keep 100% of profits',
      price: 29.99,
      badge: '100% PROFIT',
      deliverable: {
        name: 'Master_Resale_Rights_License_Contract.pdf',
        size: '2.4 MB',
        format: 'MRR Reseller Agreement',
        contentPreview: 'Full Master Resale Rights contract & ready-to-use marketing copy.'
      }
    }
  ];

  // Calculated Price Totals
  const basePrice = selectedProduct?.price || 0;
  const optionsAdjustment = (licensePriceMap[selectedLicense] || 0) + (packagePriceMap[selectedPackage] || 0);
  const bumpsAmount = selectedBumps.reduce((acc, bumpId) => {
    const b = availableBumps.find(item => item.id === bumpId);
    return acc + (b ? b.price : 0);
  }, 0);
  const totalPrice = Number((basePrice + optionsAdjustment + bumpsAmount).toFixed(2));

  // Categories list
  const categories = [
    'ALL',
    'SaaS Blueprints & Neural Tools',
    'AI Prompts & Neural Workflows',
    'Notion & Productivity Systems',
    'Financial Models & Cyber Spreadsheets'
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.niche === selectedCategory;
    const q = (searchQuery || '').toLowerCase();
    const titleMatch = Boolean(p.title && p.title.toLowerCase().includes(q));
    const nicheMatch = Boolean(p.niche && p.niche.toLowerCase().includes(q));
    const subtitleMatch = Boolean(p.subtitle && p.subtitle.toLowerCase().includes(q));
    const matchesQuery = !q || titleMatch || nicheMatch || subtitleMatch;
    return matchesCategory && matchesQuery;
  });

  const handleInspect = (product: DigitalProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setInspectProduct(product);
    playSound('click');
  };

  const handleOpenCheckout = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setCheckoutStep('payment');
    setIsCheckoutOpen(true);
    setInspectProduct(null);
    playSound('click');
  };

  const toggleBump = (bumpId: string) => {
    playSound('click');
    const bumps = selectedBumps || [];
    if (bumps.includes(bumpId)) {
      setSelectedBumps(bumps.filter(id => id !== bumpId));
    } else {
      setSelectedBumps([...bumps, bumpId]);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || isProcessingPayment) return;

    setPaymentError(null);
    setIsProcessingPayment(true);
    setCheckoutStep('processing');
    playSound('warp');

    const amount = totalPrice;
    const platformFee = activeChannel === 'store' ? Number((amount * 0.029 + 0.30).toFixed(2)) : Number((amount * 0.065 + 0.20).toFixed(2));
    const netProfit = Number((amount - platformFee).toFixed(2));
    const orderNumber = `#NF-${Math.floor(8000 + Math.random() * 2000)}`;

    try {
      // Step 1: Initiate authorized payment session with server to obtain verifiedPaymentToken
      const paymentIntentRes = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          customerEmail,
          customerName,
          orderNumber,
          amount
        })
      });

      let verifiedPaymentToken = '';
      if (paymentIntentRes.ok) {
        const piData = await paymentIntentRes.json();
        verifiedPaymentToken = piData.verifiedPaymentToken || '';
      }

      const orderPayload = {
        order: {
          orderNumber,
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          amount,
          platformFee,
          netProfit,
          channel: (activeChannel === 'store' ? 'Direct Storefront' : 'Etsy Sync') as 'Direct Storefront' | 'Etsy Sync',
          paymentMethod: (activeChannel === 'store' ? paymentMethod : 'Etsy Payments') as 'Credit Card / Stripe' | 'Apple Pay' | 'Etsy Payments',
          selectedOptions: {
            'License Tier': selectedLicense,
            'Deliverable Package': selectedPackage
          },
          selectedOrderBumps: selectedBumps,
          optionsPriceAdjustment: optionsAdjustment,
          orderBumpsAmount: bumpsAmount,
          verifiedPaymentToken
        },
        customer: {
          name: customerName || 'Valued Creator',
          email: customerEmail || 'creator@example.com',
          location: 'San Francisco, CA, USA',
        }
      };

      const serverResult = await neonforgeApi.processOrder(orderPayload);
      if (serverResult?.order && serverResult?.customer) {
        setRecentOrder(serverResult.order);
        onPlaceOrder(serverResult.order, serverResult.customer);
        setCheckoutStep('success');
        playSound('cash');
      } else {
        const errMsg = serverResult?.error || 'Payment Required (402): Authoritative payment verification required. Unverified order rejected.';
        setPaymentError(errMsg);
        setCheckoutStep('payment');
        playSound('alert');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[Storefront] Order submission error:', msg);
      setPaymentError(`Payment failed: ${msg}`);
      setCheckoutStep('payment');
      playSound('alert');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadFile = (fileName: string, content?: string) => {
    playSound('click');
    const blob = new Blob([content || `NEON FORGE DIGITAL (neonforgedigital.net) AUTHENTIC DELIVERABLE\nItem: ${selectedProduct?.title}\nLicense: ${recentOrder?.licenseKey}\nHost: https://www.neonforgedigital.net\nStatus: Verified Non-Physical Asset`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionForm.name || !commissionForm.email) return;
    playSound('cash');
    setCommissionSubmitted(true);
    // Auto-create a commission support ticket in CRM as well
    const commissionTicket: SupportTicket = {
      id: `comm-${Date.now()}`,
      customerName: commissionForm.name,
      customerEmail: commissionForm.email,
      productTitle: `Commission: ${commissionForm.assetType}`,
      issueType: 'Customization Request',
      subject: `[Bespoke Order] ${commissionForm.assetType} ($${commissionForm.budget})`,
      customerMessage: `Budget: ${commissionForm.budget} | Timeline: ${commissionForm.deadline}\nDetails: ${commissionForm.description || 'Custom digital system creation.'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      aiDraftReply: `Thank you ${commissionForm.name}! The Neon Forge engineering foundry has received your custom brief for "${commissionForm.assetType}". Our team is reviewing the architecture and will contact you at ${commissionForm.email} within 12 hours.`
    };
    if (onDispatchTicket) {
      onDispatchTicket(commissionTicket);
    }
    neonforgeApi.addTicket(commissionTicket).catch(console.warn);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.email || !ticketForm.message) return;
    setIsDispatchingTicket(true);
    playSound('click');

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      customerName: ticketForm.name || 'Store Customer',
      customerEmail: ticketForm.email,
      productTitle: 'Storefront Direct Inquiry',
      issueType: ticketForm.issueType,
      subject: ticketForm.subject || `Inquiry from ${ticketForm.email}`,
      customerMessage: ticketForm.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      aiDraftReply: `Hello ${ticketForm.name || 'there'}, your ticket was routed to Agent Kai (Support Specialist). We have recorded your ${ticketForm.issueType} and will resolve it promptly.`
    };

    try {
      await neonforgeApi.addTicket(newTicket);
      if (onDispatchTicket) onDispatchTicket(newTicket);
      setTicketStatusMsg(`Ticket dispatched! Agent Kai assigned ID #${newTicket.id.slice(-6)} to ${ticketForm.email}.`);
      setTicketForm({ name: '', email: '', subject: '', issueType: 'Download Issue', message: '' });
      playSound('success');
    } catch {
      setTicketStatusMsg('Ticket recorded in local queue. Support team notified.');
    } finally {
      setIsDispatchingTicket(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* =========================================================================
          1. HERO SECTION: High-impact Cyberpunk Celestial Branding & Live Telemetry
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0a1024] via-[#060a17] to-[#04060d] p-6 lg:p-10 shadow-[0_0_60px_rgba(0,243,255,0.15)]">
        {/* Radiant Ambient Background Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Domain & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Domain & Live Status Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  OFFICIAL STOREFRONT
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-slate-200 tracking-wide">
                  www.neonforgedigital.net
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                ⚡ 99.4% NET MARGIN
              </div>
            </div>

            {/* Radiant Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight text-white leading-tight">
                NEON FORGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">DIGITAL</span>
              </h1>
              <p className="text-sm sm:text-base font-sans text-slate-300 mt-3 max-w-xl leading-relaxed">
                Autonomous digital manufacturing foundry. Production-grade Notion operating systems, curated neural prompt matrices, vector design bundles, and financial engines delivered with instant cryptographic SHA-256 license keys. Zero inventory. 100% net profit velocity.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#product-matrix"
                onClick={() => playSound('click')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Digital Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#commission-desk"
                onClick={() => playSound('click')}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Custom Commission</span>
              </a>

              <a
                href="#about-foundry"
                onClick={() => playSound('click')}
                className="px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Foundry Blueprint</span>
              </a>
            </div>

            {/* Channel Switcher */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Checkout Channel:</span>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => { setActiveChannel('store'); playSound('click'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeChannel === 'store'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span>Direct Storefront (Stripe)</span>
                </button>
                <button
                  onClick={() => { setActiveChannel('etsy'); playSound('click'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeChannel === 'etsy'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Etsy Sync Channel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Hero Artwork & Live Telemetry Badge */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm rounded-2xl p-1 bg-gradient-to-b from-amber-400/50 via-cyan-500/40 to-fuchsia-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)] hover:shadow-[0_0_55px_rgba(0,243,255,0.4)] transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[9/14] flex items-center justify-center">
                {/* Official Cover Thumbnail: Sovereign Guardian Command Desk */}
                <img
                  src="/assets/neon_forge_cover.jpg"
                  alt="Neon Forge Digital - Sovereign Celestial Guardian at Cyber Command Desk"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to logo asset if cover fails
                    (e.target as HTMLImageElement).src = '/assets/neon_forge_logo.jpg';
                  }}
                />

                {/* Ambient Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                {/* Top Badge on Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/50 shadow">
                    COMMAND GUARDIAN
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/50 shadow">
                    SOVEREIGN NEXUS
                  </span>
                </div>

                {/* Bottom Details on Image */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-center space-y-1">
                  <div className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                    Neon Forge Command Matrix
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300">
                    www.neonforgedigital.net · Official Cover
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Telemetry Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400">Total Asset Catalog</div>
            <div className="text-xl font-mono font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
              <span>{products.length} Products</span>
              <span className="text-[10px] text-emerald-400 font-normal">Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400">Gross Margin</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              99.4%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400">Fulfillment Latency</div>
            <div className="text-xl font-mono font-bold text-amber-400 mt-1 flex items-center gap-1.5">
              <span>&lt; 0.4s</span>
              <span className="text-[10px] text-slate-400 font-normal">Instant DL</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400">License Verification</div>
            <div className="text-xl font-mono font-bold text-fuchsia-400 mt-1 flex items-center gap-1.5">
              <span>SHA-256</span>
              <span className="text-[10px] text-slate-400 font-normal">Cryptographic</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CURATED PRODUCT MATRIX: Filterable Grid, Previews & Instant Buy
          ========================================================================= */}
      <section id="product-matrix" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Curated Catalog</span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-white">
              DIGITAL ASSET MATRIX
            </h2>
            <p className="text-xs font-sans text-slate-400 mt-1">
              Production-ready assets engineered for instant deployment. Instant file delivery upon checkout confirmation.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workspaces, prompts, SFX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, i) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={`cat-${i}`}
                onClick={() => { setSelectedCategory(cat); playSound('click'); }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p, index) => {
            const primaryColor = p.mockupTheme?.primaryColor || '#00f0ff';
            const secondaryColor = p.mockupTheme?.secondaryColor || '#ff007f';
            const ratingVal = typeof p.rating === 'number' ? p.rating : 5.0;
            const comparePrice = typeof p.compareAtPrice === 'number' ? p.compareAtPrice : (p.price || 0);
            const currentPrice = typeof p.price === 'number' ? p.price : 0;
            const deliverableLabel = p.deliverableType ? p.deliverableType.replace('_', ' ').toUpperCase() : 'DIGITAL ASSET';
            const licenseLabel = p.licenseType || 'Commercial Standard';

            return (
              <div
                key={`${p.id}-${index}`}
                className="group relative bg-[#090d18] border border-slate-800/90 hover:border-cyan-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:-translate-y-1.5"
              >
                {/* Top Theme Accent Bar */}
                <div 
                  className="h-1.5 w-full rounded-full mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                />

                <div className="space-y-3">
                  {/* Header Metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase font-bold">
                      {p.sku}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{ratingVal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-mono text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-1">
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Badges / License */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      ⚡ {deliverableLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold">
                      🛡️ {licenseLabel}
                    </span>
                  </div>

                  {/* Deliverables summary */}
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
                    <span>📦 Files included:</span>
                    <span className="text-slate-200 font-bold">{p.deliverableFiles?.length || 1} packaged assets</span>
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="pt-4 border-t border-slate-800/80 mt-5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-slate-500 line-through text-[11px] font-mono block">
                      ${comparePrice.toFixed(2)}
                    </span>
                    <span className="text-emerald-400 font-mono text-lg font-bold">
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleInspect(p, e)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Product Deliverable Details & Sample Data"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenCheckout(p)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all active:scale-95"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. BRAND STORY & FOUNDRY BLUEPRINT: "About Neon Forge Digital"
          ========================================================================= */}
      <section id="about-foundry" className="rounded-3xl border border-slate-800 bg-[#070b16] p-6 lg:p-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <Award className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">Foundry Blueprint & Origin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            THE ARCHITECTURE OF HIGH-MARGIN DIGITAL CREATION
          </h2>
          <p className="text-sm font-sans text-slate-300 leading-relaxed">
            Founded under the domain <span className="text-cyan-400 font-mono font-semibold">neonforgedigital.net</span>, Neon Forge Digital replaces traditional inventory overhead with automated digital intellectual property. By synthesizing neural intelligence, verified creator templates, and cryptographic license minting, we deliver assets that creators, agencies, and entrepreneurs deploy instantly.
          </p>
        </div>

        {/* 3 Pillars of the Foundry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center border border-cyan-400/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white">01. Autonomous Forge</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every system is engineered from raw structural code into clean, frictionless deliverables (Notion databases, prompts, spreadsheets, and vector kits) ready to scale without human bottleneck.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-fuchsia-500/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-950 flex items-center justify-center border border-fuchsia-400/40 text-fuchsia-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white">02. Cryptographic Licensing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every purchase generates an immutable SHA-256 license certificate granting legal Commercial, Extended, or Master Resale rights authenticated directly via <span className="font-mono text-cyan-300">neonforgedigital.net</span>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center border border-amber-400/40 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white">03. Zero Latency Delivery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No physical warehousing, zero shipping friction, and 0.4s download dispatch. Buyers receive immediate access, lifetime revision mirrors, and dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CUSTOMER TOUCHPOINTS: Bespoke Commission Form & Support Dispatch
          ========================================================================= */}
      <section id="commission-desk" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Custom Commission Request */}
        <div className="lg:col-span-7 rounded-3xl border border-indigo-500/30 bg-[#080d1e] p-6 lg:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Commission Desk</span>
            </div>
            <h3 className="text-xl font-mono font-bold text-white">
              CUSTOM DIGITAL SYSTEM COMMISSION
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Need a bespoke Notion OS for your agency, an AI prompt dataset, or tailored SVG icon set? Brief our digital foundry team directly.
            </p>
          </div>

          {commissionSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-mono font-bold text-white">COMMISSION BRIEF TRANSMITTED</h4>
              <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                Thank you, {commissionForm.name}! Your commission request has been queued in the Neon Forge pipeline. We will review your specification and reach out at <span className="text-cyan-400 font-mono">{commissionForm.email}</span> within 12 hours.
              </p>
              <button
                onClick={() => setCommissionSubmitted(false)}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Vane"
                    value={commissionForm.name}
                    onChange={(e) => setCommissionForm({ ...commissionForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={commissionForm.email}
                    onChange={(e) => setCommissionForm({ ...commissionForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">System Type</label>
                  <select
                    value={commissionForm.assetType}
                    onChange={(e) => setCommissionForm({ ...commissionForm, assetType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  >
                    <option>Custom Notion Operating System</option>
                    <option>Neural AI Prompt Matrix</option>
                    <option>Vector Icon / UI Kit</option>
                    <option>Financial Model Spreadsheet</option>
                    <option>Full Agency Rebrand Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Target Budget</label>
                  <select
                    value={commissionForm.budget}
                    onChange={(e) => setCommissionForm({ ...commissionForm, budget: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  >
                    <option>$75 - $150</option>
                    <option>$150 - $400</option>
                    <option>$400 - $1,000</option>
                    <option>$1,000+ Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Turnaround</label>
                  <select
                    value={commissionForm.deadline}
                    onChange={(e) => setCommissionForm({ ...commissionForm, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                  >
                    <option>Within 48 Hours</option>
                    <option>Within 72 Hours</option>
                    <option>1 - 2 Weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Project Specification</label>
                <textarea
                  rows={3}
                  placeholder="Outline key database relations, specific target niches, visual style, or specific API integrations needed..."
                  value={commissionForm.description}
                  onChange={(e) => setCommissionForm({ ...commissionForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Commission Brief to Foundry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Live Customer Support Dispatch */}
        <div className="lg:col-span-5 rounded-3xl border border-cyan-500/30 bg-[#070c1a] p-6 lg:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Headphones className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Live Support Terminal</span>
            </div>
            <h3 className="text-xl font-mono font-bold text-white">
              DISPATCH SUPPORT TICKET
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Have an inquiry about a license key, download link, or refund? Our automated CRM agent Kai responds in under 5 minutes.
            </p>
          </div>

          {ticketStatusMsg && (
            <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center justify-between">
              <span>{ticketStatusMsg}</span>
              <button onClick={() => setTicketStatusMsg(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="customer@domain.com"
                value={ticketForm.email}
                onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Issue Type</label>
              <select
                value={ticketForm.issueType}
                onChange={(e) => setTicketForm({ ...ticketForm, issueType: e.target.value as SupportTicket['issueType'] })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
              >
                <option value="Download Issue">Download Issue / Resend Files</option>
                <option value="Commercial License Inquiry">Commercial License Rights Inquiry</option>
                <option value="Customization Request">Customization Request</option>
                <option value="Refund Request">Refund Request</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">Message</label>
              <textarea
                rows={3}
                required
                placeholder="Describe your issue or order number (e.g. #NF-8104)..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isDispatchingTicket}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{isDispatchingTicket ? 'Dispatching...' : 'Dispatch to Agent Kai'}</span>
            </button>
          </form>

          {/* Official Domain & Security Footer Badge */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SSL 256-Bit Encrypted</span>
            </span>
            <span className="text-cyan-400 font-semibold">www.neonforgedigital.net</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MODALS: Product Inspection & Checkout Flow
          ========================================================================= */}
      {/* Product Detail Inspection Modal */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0a0e18] border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(0,243,255,0.25)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase font-bold">
                  {inspectProduct.sku}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                  {inspectProduct.deliverableType}
                </span>
              </div>

              <h3 className="font-mono text-xl font-bold text-white">
                {inspectProduct.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {inspectProduct.subtitle}
              </p>

              {/* Packaged Deliverable Files Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>Packaged Master Deliverables ({inspectProduct.deliverableFiles?.length || 0})</span>
                </div>
                <div className="space-y-1.5">
                  {inspectProduct.deliverableFiles?.map((f, i) => (
                    <div key={`file-${i}`} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-white font-bold">{f.name}</div>
                        <div className="text-[10px] text-slate-400">{f.format} · {f.size}</div>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Ready to Download
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Etsy 13 Tag Algorithmic Keyword Index */}
              {inspectProduct.etsyOptimization && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Synchronized Etsy 13-Tag Algorithmic Matrix</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectProduct.etsyOptimization.thirteenTags?.map((tag, i) => (
                      <span key={`tag-${i}`} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-emerald-400 text-xl font-mono font-bold">
                  ${(inspectProduct.price ?? 0).toFixed(2)} USD
                </span>

                <button
                  onClick={() => handleOpenCheckout(inspectProduct)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Configure & Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout & Delivery Modal */}
      {isCheckoutOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0a0e18] border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(0,243,255,0.25)] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>

            {checkoutStep === 'payment' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                    INSTANT CHECKOUT · WWW.NEONFORGEDIGITAL.NET
                  </span>
                  <h3 className="font-mono text-lg font-bold text-white mt-1">
                    {selectedProduct.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 line-through text-xs font-mono">
                      ${(selectedProduct.compareAtPrice ?? selectedProduct.price ?? 0).toFixed(2)}
                    </span>
                    <span className="text-emerald-400 text-lg font-mono font-bold">
                      ${totalPrice.toFixed(2)} USD
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">· Instant Download</span>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-bold">
                        Customer Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-bold">
                        Delivery Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* License Tier Option */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40 space-y-3">
                    <div className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Select License Rights</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(['Personal Use', 'Commercial Standard', 'Extended Resale Pro'] as const).map(tier => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => { setSelectedLicense(tier); playSound('click'); }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                            selectedLicense === tier
                              ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold">{tier}</div>
                          <div className="text-[10px] text-emerald-400 mt-1">
                            {licensePriceMap[tier] === 0 ? 'Included' : `+$${licensePriceMap[tier]}.00`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Bumps Section */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                      Recommended Upgrades & Bonus Passes:
                    </span>
                    {availableBumps.map(bump => {
                      const isSelected = selectedBumps.includes(bump.id);
                      return (
                        <div
                          key={bump.id}
                          onClick={() => toggleBump(bump.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-amber-400 w-4 h-4 rounded"
                            />
                            <div>
                              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                                <span>{bump.title}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                                  {bump.badge}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-sans mt-0.5">{bump.tagline}</div>
                            </div>
                          </div>
                          <div className="text-amber-400 font-mono font-bold text-xs whitespace-nowrap">
                            +${bump.price.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {paymentError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
                      {paymentError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                  >
                    <Lock className="w-4 h-4 text-black" />
                    <span>Confirm Order · Pay ${totalPrice.toFixed(2)} USD</span>
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                <h4 className="font-mono text-base font-bold text-white">
                  MINTING CRYPTOGRAPHIC SHA-256 LICENSE...
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Settling transaction and preparing direct package download via neonforgedigital.net
                </p>
              </div>
            )}

            {checkoutStep === 'success' && recentOrder && (
              <div className="space-y-6">
                <div className="text-center space-y-2 border-b border-slate-800 pb-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-mono font-bold text-white">ORDER VERIFIED & SETTLED</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Receipt #{recentOrder.orderNumber} issued to {customerEmail}
                  </p>
                </div>

                {/* License Key Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold">CRYPTOGRAPHIC LICENSE KEY:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(recentOrder.licenseKey);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey ? 'COPIED!' : 'COPY'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 select-all break-all">
                    {recentOrder.licenseKey}
                  </div>
                </div>

                {/* Deliverables Download Links */}
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase text-white font-bold block">
                    Download Your Purchased Assets:
                  </span>
                  {selectedProduct.deliverableFiles?.map((f, i) => (
                    <div
                      key={`suc-file-${i}`}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div>
                        <div className="text-white font-bold">{f.name}</div>
                        <div className="text-slate-400 text-[10px]">{f.format} · {f.size}</div>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(f.name, f.contentPreview)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,243,255,0.3)]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}

                  {/* Bonus order bumps download links */}
                  {selectedBumps.map((bumpId, i) => {
                    const bump = availableBumps.find(b => b.id === bumpId);
                    if (!bump) return null;
                    return (
                      <div
                        key={`suc-bump-${i}`}
                        className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs font-mono"
                      >
                        <div>
                          <div className="text-amber-300 font-bold">🎁 [BONUS] {bump.deliverable.name}</div>
                          <div className="text-slate-400 text-[10px]">{bump.deliverable.format} · {bump.deliverable.size}</div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(bump.deliverable.name, bump.deliverable.contentPreview)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-colors"
                >
                  Return to Storefront
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
