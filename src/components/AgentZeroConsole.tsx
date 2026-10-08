import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Lock, 
  CreditCard, 
  ShoppingBag, 
  ArrowRight, 
  Terminal, 
  Globe, 
  Radio, 
  Cpu, 
  DollarSign, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { playSound } from '../utils/audio';
import { neonforgeApi } from '../services/neonforgeApi';
import { AgentZeroDiagnosis } from '../services/agentZeroService';
import { DigitalProduct } from '../types';

interface AgentZeroConsoleProps {
  products: DigitalProduct[];
  onOpenStorefront: () => void;
  onOpenMultiChannel: () => void;
}

export const AgentZeroConsole: React.FC<AgentZeroConsoleProps> = ({
  products,
  onOpenStorefront,
  onOpenMultiChannel
}) => {
  const { theme } = useTheme();

  const [diagnosis, setDiagnosis] = useState<AgentZeroDiagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [commissioning, setCommissioning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states for Live Keys
  const [inputPubKey, setInputPubKey] = useState('');
  const [inputSecKey, setInputSecKey] = useState('');
  const [inputWebhookSec, setInputWebhookSec] = useState('');
  const [targetUrl, setTargetUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  });
  const [grantPermission, setGrantPermission] = useState(true);
  const [commissionStatusMsg, setCommissionStatusMsg] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadDiagnosis();
  }, []);

  const loadDiagnosis = async () => {
    setLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : targetUrl;
    const res = await neonforgeApi.getAgent0Status(origin);
    setLoading(false);
    if (res?.success && res.diagnosis) {
      setDiagnosis(res.diagnosis);
      if (res.diagnosis.customerFacingUrl) {
        setTargetUrl(res.diagnosis.customerFacingUrl);
      }
    }
  };

  const handleCopyCustomerLink = () => {
    const link = diagnosis?.storefrontUrl || targetUrl;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    playSound('click');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRunCommissioning = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCommissioning(true);
    playSound('warp');
    setCommissionStatusMsg(null);

    const result = await neonforgeApi.runAgent0Commissioning({
      publishableKey: inputPubKey.trim() || undefined,
      secretKey: inputSecKey.trim() || undefined,
      webhookSecret: inputWebhookSec.trim() || undefined,
      targetPublicUrl: targetUrl.trim(),
      autoFixWebhooks: grantPermission
    });

    setCommissioning(false);

    if (result?.success) {
      if (result.diagnosis) {
        setDiagnosis(result.diagnosis);
      } else {
        await loadDiagnosis();
      }
      setCommissionStatusMsg('✅ Agent 0 procedures executed: Stripe live webhooks & end pages synced!');
      playSound('cash');
      setInputSecKey(''); // Clear raw secret key from UI memory for security
    } else {
      setCommissionStatusMsg(`❌ Commissioning note: ${result?.error || 'Unable to complete automated steps'}`);
      playSound('alert');
    }
  };

  const handleTestWebhookDelivery = async () => {
    setTestingWebhook(true);
    playSound('warp');
    setWebhookTestResult(null);
    const res = await neonforgeApi.testWebhookDelivery();
    setTestingWebhook(false);
    if (res?.success) {
      setWebhookTestResult('✅ Webhook cryptographic signature verified! /api/stripe/webhook is operational.');
      playSound('cash');
      await loadDiagnosis();
    } else {
      setWebhookTestResult(`❌ Webhook test: ${res?.message || res?.error || 'Verification failed'}`);
      playSound('alert');
    }
  };

  const isLiveReady = diagnosis?.isReadyForCash;
  const isSeen = diagnosis?.isSeenByCustomers;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Prime Header Banner: Agent 0 Identity & Command Center */}
      <div 
        className="p-5 lg:p-6 rounded-2xl border relative overflow-hidden shadow-2xl transition-all"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: isLiveReady ? '#10b981' : '#f59e0b',
          boxShadow: isLiveReady 
            ? '0 0 35px rgba(16, 185, 129, 0.25)' 
            : '0 0 35px rgba(245, 158, 11, 0.25)'
        }}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1.5 bg-amber-500/20 border border-amber-400 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                AGENT 0 · APEX GATEWAY OVERSEER
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                Level 10 Master Bot
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                isLiveReady 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-amber-950/80 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              }`}>
                {isLiveReady ? '🟢 READY TO RECEIVE CASH (100% ARMED)' : '🟡 COMMISSIONING / ACTION NEEDED'}
              </span>
            </div>

            <h2 className="text-xl lg:text-2xl font-mono font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span>Agent 0: Autonomous Webhook & Live Cash Commissioning</span>
            </h2>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Agent 0 possesses specialized authority to connect to your Stripe account, automatically register settlement webhook endpoints, capture secret verification keys, bind checkout return end pages, and audit whether real customers can see and purchase from your storefront.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadDiagnosis}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl font-mono text-xs font-bold border border-slate-700 bg-black/40 hover:bg-black/60 text-slate-300 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-Scan Diagnostics</span>
            </button>

            <button
              onClick={handleCopyCustomerLink}
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-black flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Customer Storefront Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE CUSTOMER QUESTION: "Am I Seen by Customers or Am I Incomplete?" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Answer 1: Customer Visibility */}
        <div 
          className="p-5 rounded-xl border space-y-3"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: isSeen ? '#10b981' : theme.borderTheme
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                1. Are You Seen by Customers?
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isSeen ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-amber-950 text-amber-300 border border-amber-500'
            }`}>
              {isSeen ? 'YES · PUBLICLY LIVE' : 'AWAITING SHARING'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your storefront is hosted at:
          </p>

          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs text-cyan-300">
            <span className="truncate">{diagnosis?.storefrontUrl || targetUrl}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleCopyCustomerLink}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                title="Copy Storefront URL"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={diagnosis?.storefrontUrl || targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                title="Open Storefront in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-sans">
            <p className="text-emerald-300 font-semibold">
              ✓ Worldwide Reachable: Any customer accessing this link sees your live digital goods catalog.
            </p>
            <p>
              ✓ Active Catalog: <strong>{diagnosis?.catalog.activePublished || products.length} digital products</strong> available for instant checkout.
            </p>
          </div>
        </div>

        {/* Answer 2: Cash Payment Readiness */}
        <div 
          className="p-5 rounded-xl border space-y-3"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: isLiveReady ? '#10b981' : theme.borderTheme
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                2. Are You Ready to Receive Cash?
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isLiveReady ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-amber-950 text-amber-300 border border-amber-500'
            }`}>
              {isLiveReady ? 'YES · CASH READY' : 'ACTION REQUIRED'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isLiveReady 
              ? 'Your Stripe live keys and webhooks are armed. Real customer card and Apple Pay payments will settle directly into your bank account with zero middleman custody.'
              : 'Stripe live keys or webhooks are not fully armed yet. Use Agent 0\'s 1-Click Auto-Fix below to establish the connection.'}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Charges Enabled</span>
              <span className={`font-bold ${diagnosis?.stripeAccount.chargesEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {diagnosis?.stripeAccount.chargesEnabled ? '✅ Active' : '⚠️ Pending Key'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Webhook Auto-Delivery</span>
              <span className={`font-bold ${diagnosis?.webhookEndpoint.webhookSecretArmed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {diagnosis?.webhookEndpoint.webhookSecretArmed ? '✅ Armed (whsec_)' : '⚠️ Needs Sync'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans">
            Direct Bank Settlement: 100% of customer checkout proceeds transfer straight to your linked bank account.
          </div>
        </div>
      </div>

      {/* AGENT 0: PERMISSIONED 1-CLICK STRIPE COMMISSIONING CONSOLE */}
      <div 
        className="p-5 lg:p-6 rounded-2xl border space-y-5"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderTheme
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: theme.borderTheme }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-base font-black text-white uppercase tracking-wide">
                Agent 0: One-Click Webhook & Live Gateway Setup
              </h3>
              <p className="text-xs text-slate-300">
                Grant Agent 0 permission to connect to Stripe, auto-create the live webhook endpoint, grab the signing secret, and bind end pages.
              </p>
            </div>
          </div>

          {diagnosis?.stripeAccount.mode && (
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-black/60 border border-slate-700 text-slate-300">
              Gateway Mode: <strong className="text-amber-400 uppercase">{diagnosis.stripeAccount.mode}</strong>
            </span>
          )}
        </div>

        {commissionStatusMsg && (
          <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs font-mono text-cyan-200">
            {commissionStatusMsg}
          </div>
        )}

        <form onSubmit={handleRunCommissioning} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Stripe Publishable Key (<code className="text-cyan-300">pk_live_...</code> or <code className="text-slate-400">pk_test_...</code>)
              </label>
              <input
                type="text"
                value={inputPubKey}
                onChange={(e) => setInputPubKey(e.target.value)}
                placeholder={diagnosis?.stripeAccount.publishableKeyMasked || "pk_live_51..."}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-slate-700 focus:border-amber-400 rounded-xl text-xs font-mono text-white outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Used in the browser for secure card collection.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Stripe Secret Key (<code className="text-amber-300">sk_live_...</code> or <code className="text-slate-400">sk_test_...</code>)
              </label>
              <input
                type="password"
                value={inputSecKey}
                onChange={(e) => setInputSecKey(e.target.value)}
                placeholder={diagnosis?.stripeAccount.secretKeyMasked || "sk_live_51..."}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-slate-700 focus:border-amber-400 rounded-xl text-xs font-mono text-white outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Never shared publicly. Allows Agent 0 to configure your webhooks on Stripe.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Public Storefront Destination URL
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://your-domain.com or https://ais-pre-..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs font-mono text-white outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                The public destination Stripe will send webhooks to: <code className="text-cyan-300">{targetUrl}/api/stripe/webhook</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Stripe Webhook Secret (<code className="text-slate-400">whsec_...</code> - Optional)
              </label>
              <input
                type="password"
                value={inputWebhookSec}
                onChange={(e) => setInputWebhookSec(e.target.value)}
                placeholder={diagnosis?.webhookEndpoint.secretMasked || "Leave blank for Agent 0 to auto-retrieve from Stripe"}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs font-mono text-white outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Leave blank: Agent 0 will create the webhook and grab this secret automatically!
              </span>
            </div>
          </div>

          {/* Permission Authorization Checkbox */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-start gap-3">
            <input
              type="checkbox"
              id="agent0-perm"
              checked={grantPermission}
              onChange={(e) => setGrantPermission(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <label htmlFor="agent0-perm" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
              <strong className="text-amber-300 uppercase font-mono">Grant Permission to Agent 0:</strong> I authorize Agent 0 to connect to my Stripe account via API, inspect webhook settings, auto-create the endpoint for <code className="text-cyan-300">{targetUrl}/api/stripe/webhook</code>, retrieve the signature secret, and bind all return pages so my app is ready to take cash payments immediately.
            </label>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={commissioning}
              className="px-6 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 border-amber-300 text-black shadow-[0_0_25px_#f59e0b,0_0_40px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_#fbbf24,0_0_55px_#f59e0b] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
              }}
            >
              <Zap className={`w-4 h-4 ${commissioning ? 'animate-spin' : ''}`} />
              <span>
                {commissioning ? 'AGENT 0 COMMISSIONING IN PROGRESS...' : '⚡ AGENT 0: AUTO-APPLY WEBHOOKS & COMMISSION'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 6-POINT READINESS CHECKLIST */}
      {diagnosis && (
        <div 
          className="p-5 rounded-2xl border space-y-4"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderTheme
          }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.borderTheme }}>
            <h3 className="font-mono text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Agent 0: 6-Point Live Production Verification Audit</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {diagnosis.checklist.filter(c => c.status === 'pass').length} / {diagnosis.checklist.length} Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {diagnosis.checklist.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl border bg-black/40 space-y-1.5 font-mono text-xs"
                style={{
                  borderColor: item.status === 'pass' 
                    ? 'rgba(16, 185, 129, 0.4)' 
                    : item.status === 'warning' 
                    ? 'rgba(245, 158, 11, 0.4)' 
                    : 'rgba(239, 68, 68, 0.4)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[200px]">{item.title}</span>
                  {item.status === 'pass' ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  ) : item.status === 'warning' ? (
                    <span className="text-amber-400 flex items-center gap-1 text-[11px] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> WARN
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1 text-[11px] font-bold">
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>

                {item.actionableFix && (
                  <div className="text-[10px] text-amber-300 font-mono pt-1 border-t border-slate-800">
                    Fix: {item.actionableFix}
                  </div>
                )}

                {item.id === 'chk-webhooks' && item.status !== 'pass' && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleRunCommissioning(); }}
                    disabled={commissioning}
                    className="mt-2 w-full py-2 px-3 rounded-lg font-mono text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <Zap className={`w-3.5 h-3.5 ${commissioning ? 'animate-spin' : ''}`} />
                    <span>Auto-Apply Webhooks & Commission (1-Click)</span>
                  </button>
                )}

                {item.id === 'chk-webhooks' && (item as any).stripeDashboardLink && (
                  <a
                    href={(item as any).stripeDashboardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Stripe Key Permissions ↗</span>
                  </a>
                )}

                {item.id === 'chk-webhooks' && item.status === 'pass' && (
                  <div className="pt-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleTestWebhookDelivery(); }}
                      disabled={testingWebhook}
                      className="w-full py-1.5 px-2.5 rounded-lg font-mono text-[10px] font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{testingWebhook ? 'Verifying Delivery...' : 'Test Webhook Delivery (Cryptographic Ping)'}</span>
                    </button>
                    {webhookTestResult && (
                      <div className="text-[10px] text-emerald-300 font-mono leading-tight">
                        {webhookTestResult}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENT 0 CHRONOLOGICAL LOG STREAM */}
      {diagnosis?.agent0Logs && diagnosis.agent0Logs.length > 0 && (
        <div 
          className="p-5 rounded-2xl border space-y-3"
          style={{
            backgroundColor: '#05070e',
            borderColor: theme.borderTheme
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-cyan-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              AGENT 0 AUTONOMOUS COMMISSIONING LOG STREAM
            </span>
            <span>Real-time execution log</span>
          </div>

          <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto pr-2">
            {diagnosis.agent0Logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className={`font-bold flex-shrink-0 ${
                  log.status === 'ok' ? 'text-emerald-400' : log.status === 'warn' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  [{log.step}]
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
