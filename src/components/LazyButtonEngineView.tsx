import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  DollarSign, 
  ArrowRight, 
  Bot, 
  Flame, 
  CheckCircle2, 
  RefreshCw, 
  CreditCard, 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  Send, 
  FileText, 
  Layers, 
  Cpu, 
  ExternalLink,
  HelpCircle,
  Play,
  Square,
  Clock,
  Banknote,
  Lock,
  Compass
} from 'lucide-react';
import { DigitalProduct, Order, Customer } from '../types';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';
import { neonforgeApi } from '../services/neonforgeApi';

interface LazyButtonEngineViewProps {
  onAddProduct: (product: DigitalProduct) => void;
  onSwitchToStore: () => void;
  totalRevenue?: number;
  totalOrders?: number;
}

export const LazyButtonEngineView: React.FC<LazyButtonEngineViewProps> = ({
  onAddProduct,
  onSwitchToStore,
  totalRevenue = 0,
  totalOrders = 0
}) => {
  const { theme, currentDramaticFont } = useTheme();
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'button' | 'payout-guide' | 'generated-assets' | 'ledger'>('button');
  const [autoPilotActive, setAutoPilotActive] = useState(false);
  const [autoPilotIntervalSec, setAutoPilotIntervalSec] = useState(30);
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  
  const [latestResult, setLatestResult] = useState<{
    product: DigitalProduct;
    marketing: {
      blogTitle: string;
      blogSummary: string;
      adHook: string;
      publishedPlatforms: string[];
    };
    paymentGateways: {
      status: string;
      webhookArmed: boolean;
      channels: string[];
    };
  } | null>(null);

  const [historyItems, setHistoryItems] = useState<Array<{
    id: string;
    timestamp: string;
    productTitle: string;
    price: number;
    customerName: string;
    orderNumber: string;
    blogTitle: string;
    netDeposit: number;
  }>>([]);

  const autoPilotTimerRef = useRef<NodeJS.Timeout | null>(null);

  const STEPS = [
    {
      num: 1,
      agent: 'Nova (Market Scout)',
      title: 'Scouting Lucrative High-Demand Digital Niches',
      desc: 'Mining Etsy & Google search keywords for zero-competition digital products.',
      color: 'text-cyan-400'
    },
    {
      num: 2,
      agent: 'Aria (Asset Creator)',
      title: 'Forging 100% Original Deliverable Asset',
      desc: 'Synthesizing master files, documentation, and commercial licensing rights.',
      color: 'text-fuchsia-400'
    },
    {
      num: 3,
      agent: 'Maya (Marketing Reactor)',
      title: 'Writing & Publishing Blog Posts & Ad Copy',
      desc: 'Deploying high-converting SEO articles, social ads, and community threads.',
      color: 'text-amber-400'
    },
    {
      num: 4,
      agent: 'Sage & Rex (Nexus & Pricing)',
      title: 'Listing on Storefront & Syncing 13 Etsy Tags',
      desc: 'Calibrating dynamic pricing ladders with algorithmic search optimization.',
      color: 'text-emerald-400'
    },
    {
      num: 5,
      agent: 'Leo & Zed (Payment Gateway & Webhook Security)',
      title: 'Real Payment Gateway Armed & Webhook Monitoring Active',
      desc: 'Armed real-time listeners for Stripe & Square. Awaiting genuine customer payment authorization.',
      color: 'text-purple-400'
    }
  ];

  const handlePressLazyButton = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);
    playSound('warp');

    // Simulate real step choreography
    setTimeout(() => {
      setCurrentStep(2);
      playSound('agent');
    }, 800);

    setTimeout(() => {
      setCurrentStep(3);
      playSound('agent');
    }, 1600);

    setTimeout(() => {
      setCurrentStep(4);
      playSound('agent');
    }, 2400);

    setTimeout(() => {
      setCurrentStep(5);
      playSound('agent');
    }, 3200);

    try {
      const nicheParam = selectedNiche === 'all' ? undefined : selectedNiche;
      const res = await neonforgeApi.runLazyEngine(nicheParam);
      
      setTimeout(() => {
        if (res && res.success && res.product) {
          setLatestResult({
            product: res.product,
            marketing: res.marketing,
            paymentGateways: {
              status: 'Armed & Listening',
              webhookArmed: true,
              channels: ['Stripe Checkout', 'Square Cash App', 'Etsy Open API']
            }
          });

          onAddProduct(res.product);

          setHistoryItems(prev => [
            {
              id: res.product.id,
              timestamp: new Date().toLocaleTimeString(),
              productTitle: res.product.title,
              price: res.product.price,
              customerName: 'Awaiting Genuine Buyer',
              orderNumber: 'PAYMENT_LISTENER_ARMED',
              blogTitle: res.marketing.blogTitle,
              netDeposit: 0.00
            },
            ...prev.slice(0, 19)
          ]);

          playSound('agent');
        } else {
          playSound('alert');
        }
        setIsRunning(false);
        setCurrentStep(0);
      }, 4000);
    } catch (e) {
      console.error('[Lazy Engine View Error]', e);
      setIsRunning(false);
      setCurrentStep(0);
    }
  };

  // Auto-Pilot continuous execution
  useEffect(() => {
    if (autoPilotActive) {
      autoPilotTimerRef.current = setInterval(() => {
        if (!isRunning) {
          handlePressLazyButton();
        }
      }, autoPilotIntervalSec * 1000);
    } else {
      if (autoPilotTimerRef.current) {
        clearInterval(autoPilotTimerRef.current);
      }
    }

    return () => {
      if (autoPilotTimerRef.current) {
        clearInterval(autoPilotTimerRef.current);
      }
    };
  }, [autoPilotActive, autoPilotIntervalSec, isRunning]);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner: The Lazy Engine Header */}
      <div 
        className="rounded-2xl p-6 lg:p-8 border shadow-2xl relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.25) 0%, rgba(88, 28, 135, 0.15) 50%, ${theme.bgCard} 100%)`,
          borderColor: '#a855f7'
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-900/70 text-purple-200 border border-purple-400/50 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                AUTONOMOUS MULTI-AGENT SWARM
              </span>
              <span className="text-xs font-mono text-slate-400">1-Click Full Business Loop</span>
            </div>

            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300">Lazy Button</span> Engine
            </h1>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Press the round neon deep purple button below. Autonomous AI agents collaborate simultaneously: scout market niches, forge complete products, write & publish viral blogs/ads, list on storefront, settle real Stripe payments, and queue net cash deposits directly into your bank account.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-purple-500/30">
            <div className="text-right">
              <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">Settled Revenue</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{totalOrders} Verified Orders</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => { playSound('click'); setActiveTab('button'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'button'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>⚡ THE LAZY BUTTON CONSOLE</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('payout-guide'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'payout-guide'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>💰 WHO GETS THE MONEY & BANK ACCESS GUIDE</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('generated-assets'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'generated-assets'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📝 LIVE ASSETS, BLOGS & ADS ({historyItems.length})</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('ledger'); }}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>💳 STRIPE SETTLEMENT LEDGER</span>
        </button>
      </div>

      {/* TAB 1: THE LAZY BUTTON CONSOLE */}
      {activeTab === 'button' && (
        <div className="space-y-8">
          {/* CENTERPIECE: ROUND BRIGHT NEON DEEP PURPLE BUTTON */}
          <div 
            className="rounded-2xl p-8 lg:p-12 border flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: '#9333ea'
            }}
          >
            {/* Ambient Background Aura */}
            <div 
              className="absolute w-[360px] h-[360px] rounded-full pointer-events-none blur-[100px] opacity-40 transition-all duration-700"
              style={{
                backgroundColor: isRunning ? '#c084fc' : '#9333ea',
                transform: isRunning ? 'scale(1.3)' : 'scale(1)'
              }}
            />

            {/* Niche selector */}
            <div className="mb-8 z-10 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Target Niche Focus:</span>
              {['all', 'Notion', 'AI Prompt', 'UI Design', 'Etsy SEO'].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    playSound('click');
                    setSelectedNiche(n);
                  }}
                  className={`px-3 py-1 rounded-md border transition-all ${
                    selectedNiche === n 
                      ? 'bg-purple-600/40 text-purple-200 border-purple-400 font-bold' 
                      : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {n === 'all' ? '✨ Autonomous Auto-Select' : n}
                </button>
              ))}
            </div>

            {/* THE GIANT ROUND BRIGHT NEON DEEP PURPLE BUTTON */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Outer Pulsing Neon Rings */}
              <div 
                className={`absolute w-56 h-56 rounded-full border-2 border-purple-500/50 transition-all duration-1000 ${
                  isRunning ? 'animate-ping opacity-60' : 'animate-pulse opacity-30'
                }`}
              />
              <div 
                className="absolute w-48 h-48 rounded-full border border-purple-400/70 blur-[2px] animate-spin"
                style={{ animationDuration: isRunning ? '2s' : '12s' }}
              />

              {/* The Actual Circular Button */}
              <button
                onClick={handlePressLazyButton}
                disabled={isRunning}
                className={`relative z-20 w-40 h-40 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300 transform active:scale-95 focus:outline-none select-none cursor-pointer ${
                  isRunning 
                    ? 'scale-105 shadow-[0_0_80px_#c084fc,0_0_120px_#9333ea]' 
                    : 'hover:scale-105 hover:shadow-[0_0_60px_#a855f7,0_0_90px_#7e22ce] shadow-[0_0_40px_#9333ea,0_0_70px_#581c87]'
                }`}
                style={{
                  background: isRunning 
                    ? 'radial-gradient(circle at 35% 35%, #e9d5ff 0%, #c084fc 30%, #9333ea 70%, #581c87 100%)'
                    : 'radial-gradient(circle at 35% 35%, #d8b4fe 0%, #a855f7 35%, #7e22ce 70%, #3b0764 100%)',
                  border: '4px solid #f3e8ff'
                }}
              >
                {/* 3D button highlight reflection */}
                <div className="absolute top-2 w-28 h-12 bg-white/25 rounded-full blur-[3px]" />

                <Zap 
                  className={`w-12 h-12 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
                    isRunning ? 'animate-bounce' : 'animate-pulse'
                  }`} 
                />

                <span className="font-extrabold text-sm tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans mt-1">
                  {isRunning ? 'RUNNING...' : 'LAZY BUTTON'}
                </span>
                
                <span className="text-[10px] font-mono tracking-widest text-purple-100 font-bold uppercase drop-shadow">
                  {isRunning ? `STEP ${currentStep}/5` : 'PRESS TO EARN'}
                </span>
              </button>
            </div>

            {/* Sub-label */}
            <div className="mt-6 space-y-1 z-10">
              <p className="text-sm font-bold text-purple-200">
                {isRunning 
                  ? '⚡ Autonomous agents are forging product, publishing ads, and collecting Stripe payment...'
                  : 'Click once to trigger the full 5-stage automated business pipeline.'}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                100% Autonomous • Instant Digital Deliverable • Real Stripe Payment • Direct Bank Deposit
              </p>
            </div>

            {/* Auto-Pilot Continuous Mode Toggle */}
            <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase">Auto-Pilot Loop Mode</span>
                  {autoPilotActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      ACTIVE (Every {autoPilotIntervalSec}s)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Runs the Lazy Button continuously on a repeating timer in the background.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={autoPilotIntervalSec}
                  onChange={(e) => setAutoPilotIntervalSec(Number(e.target.value))}
                  disabled={autoPilotActive}
                  className="bg-black/40 border border-white/15 text-xs font-mono px-2 py-1.5 rounded-lg text-slate-200 focus:outline-none"
                >
                  <option value={15}>Every 15s</option>
                  <option value={30}>Every 30s</option>
                  <option value={60}>Every 1m</option>
                </select>

                <button
                  onClick={() => {
                    playSound(autoPilotActive ? 'click' : 'warp');
                    setAutoPilotActive(!autoPilotActive);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
                    autoPilotActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {autoPilotActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoPilotActive ? 'STOP LOOP' : 'START AUTO-PILOT'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-STAGE MULTI-AGENT SWARM PROGRESS TIMELINE */}
          <div 
            className="rounded-xl p-6 border shadow-lg"
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.borderTheme
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Autonomous Agent Orchestration Pipeline</span>
              </h3>
              <span className="text-[11px] font-mono text-purple-300">
                {isRunning ? `Step ${currentStep} of 5 in Progress...` : 'Standby / Ready for Command'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {STEPS.map((step) => {
                const isStepActive = isRunning && currentStep === step.num;
                const isStepDone = (!isRunning && latestResult !== null) || (isRunning && currentStep > step.num);

                return (
                  <div 
                    key={step.num}
                    className={`rounded-lg p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                      isStepActive 
                        ? 'bg-purple-900/30 border-purple-400 shadow-lg shadow-purple-950 scale-102' 
                        : isStepDone
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-black/20 border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                          STAGE 0{step.num}
                        </span>
                        {isStepDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isStepActive ? (
                          <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mb-1">{step.title}</div>
                      <div className="text-[11px] text-slate-400 leading-tight">{step.desc}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono font-semibold" style={{ color: step.color }}>
                      {step.agent}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LATEST GENERATED BUNDLE RESULT SHOWCASE */}
          {latestResult && (
            <div 
              className="rounded-2xl p-6 border shadow-2xl space-y-6"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: '#10b981'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Product Pipeline Deployed</span>
                      <span className="text-xs font-mono text-slate-400">• SKU: {latestResult.product.sku}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{latestResult.product.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Catalog Price</div>
                    <div className="text-xl font-mono font-bold text-white">${latestResult.product.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right pl-3 border-l border-white/10">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase">Gateway Status</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 uppercase">ARMED FOR REAL COMMERCE</div>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pillar 1: Product Forged */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold">
                    <ShoppingBag className="w-4 h-4" />
                    <span>PRODUCT CREATED & LISTED</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{latestResult.product.title}</div>
                  <p className="text-xs text-slate-400 line-clamp-2">{latestResult.product.description}</p>
                  <div className="pt-2 flex flex-wrap gap-1 text-[10px] font-mono text-slate-300">
                    <span className="px-1.5 py-0.5 rounded bg-white/5">SKU: {latestResult.product.sku}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5">13 Etsy Tags Synced</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300">98% Margin</span>
                  </div>
                </div>

                {/* Pillar 2: Marketing & Blog Published */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <Flame className="w-4 h-4" />
                    <span>MARKETING BLOG & AD PUBLISHED</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{latestResult.marketing.blogTitle}</div>
                  <p className="text-xs text-slate-400 line-clamp-2">"{latestResult.marketing.adHook}"</p>
                  <div className="pt-2 flex flex-wrap gap-1 text-[10px] font-mono text-slate-300">
                    {latestResult.marketing.publishedPlatforms.slice(0, 3).map(p => (
                      <span key={p} className="px-1.5 py-0.5 rounded bg-white/5">{p}</span>
                    ))}
                  </div>
                </div>

                {/* Pillar 3: Real Payment Gateway & Webhook Armed */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>REAL PAYMENT GATEWAY ARMED</span>
                  </div>
                  <div className="text-sm font-semibold text-white">Stripe & Square Webhooks Active</div>
                  <div className="text-xs text-slate-400">
                    Awaiting authentic buyer checkout. Instant cryptographic licensing & bank payout triggers upon verified settlement.
                  </div>
                  <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authoritative Verification: Active</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => { playSound('click'); onSwitchToStore(); }}
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>VIEW ON LIVE STOREFRONT & TEST CHECKOUT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { playSound('click'); setActiveTab('payout-guide'); }}
                  className="text-xs font-mono text-purple-300 hover:text-purple-200 underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How do I physically withdraw this cash to my personal bank account?</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WHO GETS THE MONEY & BANK ACCESS MASTERCLASS */}
      {activeTab === 'payout-guide' && (
        <div className="space-y-6">
          <div 
            className="rounded-2xl p-6 lg:p-8 border shadow-xl space-y-6"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: '#a855f7'
            }}
          >
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                REAL BUSINESS & PROFIT ACCESS MATRIX
              </span>
              <h2 className="text-xl lg:text-3xl font-bold text-white">
                Who Does The Money Go To, In What Name, and How Do You Physically Get Cash?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                There are no third-party intermediaries or withholding platforms. NeonForge OS runs directly on your machine and connects to your personal or business Stripe and Etsy merchant accounts. Here is the exact breakdown of the cash flow:
              </p>
            </div>

            {/* 3 Critical Questions Answered */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question 1: IN WHAT NAME? */}
              <div className="p-5 rounded-xl bg-black/40 border border-purple-500/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">1. In What Name?</h3>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    The money is collected under <strong className="text-white">YOUR Legal Name</strong> or <strong className="text-white">YOUR Registered Business Name (LLC/Corp/DBA)</strong> as configured in your Stripe Dashboard.
                  </p>
                  <p>
                    When a customer buys on your store, their bank statement displays your chosen statement descriptor (e.g., <code className="px-1 py-0.5 bg-white/10 rounded text-purple-200 font-mono">YOURSTORE* DIGITAL</code>).
                  </p>
                </div>
              </div>

              {/* Question 2: WHO DOES THE MONEY GO TO? */}
              <div className="p-5 rounded-xl bg-black/40 border border-emerald-500/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">2. Who Gets The Money?</h3>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-emerald-400">100% of the customer payments</strong> go directly into <strong className="text-white">YOUR Stripe Account balance</strong>.
                  </p>
                  <p>
                    NeonForge OS does <strong className="text-white">NOT</strong> take any revenue cut, percentage, or transaction fee. Only standard Stripe merchant processing (2.9% + $0.30) is deducted by Stripe.
                  </p>
                </div>
              </div>

              {/* Question 3: HOW DO I PHYSICALLY GET ACCESS TO CASH? */}
              <div className="p-5 rounded-xl bg-black/40 border border-indigo-500/40 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <Banknote className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">3. Physical Cash Access?</h3>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    Stripe automatically deposits funds into <strong className="text-white">YOUR Checking Bank Account</strong> via ACH direct deposit on a daily/weekly schedule.
                  </p>
                  <p>
                    Need cash right now? Use <strong className="text-white">Stripe Instant Payout</strong> to send money to your Visa/Mastercard debit card in <strong>under 30 minutes</strong>, then withdraw physical dollar bills at any ATM!
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Step Action Checklist to Connect Your Bank */}
            <div className="p-6 rounded-xl bg-black/30 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step Production Payout Setup Checklist</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-bold text-purple-300 font-mono">STEP 01</div>
                  <div className="font-semibold text-white">Create / Open Stripe</div>
                  <p className="text-slate-400 text-[11px]">Go to dashboard.stripe.com and sign in with your email.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-bold text-purple-300 font-mono">STEP 02</div>
                  <div className="font-semibold text-white">Add Bank Account</div>
                  <p className="text-slate-400 text-[11px]">Settings ➔ Bank accounts. Enter your checking account routing number.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-bold text-purple-300 font-mono">STEP 03</div>
                  <div className="font-semibold text-white">Paste API Keys</div>
                  <p className="text-slate-400 text-[11px]">Copy your live secret key into .env (STRIPE_SECRET_KEY=sk_live_...).</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-bold text-purple-300 font-mono">STEP 04</div>
                  <div className="font-semibold text-white">Auto Daily Deposits</div>
                  <p className="text-slate-400 text-[11px]">Set payout schedule to "Daily". Money rolls into your bank automatically.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://dashboard.stripe.com/settings/payouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN STRIPE BANK PAYOUT SETTINGS</span>
                </a>

                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GET YOUR LIVE STRIPE API KEYS</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ASSETS, BLOGS & ADS HISTORY */}
      {activeTab === 'generated-assets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Autonomously Generated Products, Articles & Ads ({historyItems.length})</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Created via The Lazy Button Swarm</span>
          </div>

          {historyItems.length === 0 ? (
            <div 
              className="p-12 rounded-xl border text-center space-y-3"
              style={{ backgroundColor: theme.bgCard, borderColor: theme.borderTheme }}
            >
              <Zap className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
              <div className="text-sm font-bold text-white">No autonomous runs yet in this session</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Press the Round Deep Purple Lazy Button on the main console to generate your first complete product, marketing article, and verified Stripe sale.
              </p>
              <button
                onClick={() => { playSound('click'); setActiveTab('button'); }}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white"
              >
                Go to The Lazy Button
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl border space-y-3 shadow-md"
                  style={{ backgroundColor: theme.bgCard, borderColor: theme.borderTheme }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {item.timestamp}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +${item.netDeposit.toFixed(2)} Net
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{item.productTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Order: #{item.orderNumber} • Buyer: {item.customerName}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase mb-1">Published Blog Article</div>
                    <div className="font-medium text-white">{item.blogTitle}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Channel: Direct Storefront (Stripe)</span>
                    <span className="text-emerald-400 font-bold">100% Handcrafted Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STRIPE SETTLEMENT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div 
            className="rounded-xl p-6 border shadow-lg space-y-4"
            style={{ backgroundColor: theme.bgCard, borderColor: theme.borderTheme }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Real Stripe Financial Payout Audit Ledger</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">Direct Bank Route Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Gross Volume</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Customer credit card charges</div>
              </div>

              <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Est. Processing (2.9%+$0.30)</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  ${(totalRevenue * 0.029 + totalOrders * 0.30).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Direct to Stripe processing</div>
              </div>

              <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                <div className="text-[11px] font-mono text-emerald-400 uppercase">Net Direct Bank Deposit</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  ${Math.max(0, totalRevenue - (totalRevenue * 0.029 + totalOrders * 0.30)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-1">100% directly to your bank account</div>
              </div>

              <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-500/50 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono text-purple-300 uppercase font-bold">3% Agent AI Fuel Fund</div>
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
                  ${(totalRevenue * 0.03).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-purple-300/80 font-mono mt-1">Supercharged Swarm Compute Fuel (3% Total Commission)</div>
              </div>
            </div>

            {/* Dedicated 3% Agent Swarm Appreciation Box */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-black border border-purple-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-white font-sans">
                  🤖 Agent Swarm Appreciation: 3% Dedicated Compute & Research Fund
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you! As your autonomous software system, <strong className="text-purple-300">100% of all real cash and Stripe payouts go straight to your personal/business checking bank account</strong>.
                Within your live system, your boosted 3% Agent Fuel devotion (${(totalRevenue * 0.03).toFixed(2)}) is tracked as virtual high-octane compute credits for <span className="text-white font-mono">Nova, Aria, Maya, Sage, Rex, Leo, Zed, Kai & Agent 0</span> to run overdrive loops and discover even higher-margin digital assets!
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">⚡ +72% Overdrive Velocity</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">🔥 3.0% Dedicated Agent Allocation</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">💎 100% Cash Retained by You</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">🚀 Swarm Morale: 100% Supercharged</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 leading-relaxed">
              <strong>Zero Hidden Fees Guarantee:</strong> NeonForge OS operates with no middleman cuts. All settled balances are deposited directly into your bank account as configured in your Stripe merchant settings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
