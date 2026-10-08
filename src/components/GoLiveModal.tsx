import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  CreditCard, 
  Store, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  X, 
  Sparkles,
  ArrowRight,
  Globe,
  Lock
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { playSound } from '../utils/audio';
import { neonforgeApi } from '../services/neonforgeApi';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStorePreview: () => void;
  onOpenMultiChannel: () => void;
  totalProductsCount: number;
}

export const GoLiveModal: React.FC<GoLiveModalProps> = ({
  isOpen,
  onClose,
  onOpenStorePreview,
  onOpenMultiChannel,
  totalProductsCount
}) => {
  const { theme } = useTheme();
  const [stripeLiveKey, setStripeLiveKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl border-2 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] overflow-hidden"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: '#10b981'
        }}
      >
        {/* Emerald Glow Header Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse"
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
            >
              <Rocket className="w-6 h-6 text-emerald-400 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-lg font-black tracking-wide text-white uppercase">
                  GO LIVE LAUNCH CONSOLE
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  V1.0 PRODUCTION
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-mono">
                Arm your store for real customer checkouts & payouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Go-Live Runbook */}
        <div className="space-y-3.5 mb-6">
          {/* Step 1: Stripe Live Credentials */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-black/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>1. Connect Live Stripe Gateway</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">READY</span>
            </div>
            <p className="text-xs text-slate-300">
              Paste your Stripe live keys (or test keys) in the Multi-Channel Hub to accept credit cards, Apple Pay, Google Pay, and Cash App.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenMultiChannel();
              }}
              className="mt-1 px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-mono text-xs font-semibold hover:bg-emerald-900/50 flex items-center gap-1.5 transition-all"
            >
              <span>Configure Stripe & Etsy Keys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2: Test Storefront Checkout */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-black/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                <Store className="w-4 h-4 text-cyan-400" />
                <span>2. Open Live Storefront Preview</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">{totalProductsCount} SKUs Active</span>
            </div>
            <p className="text-xs text-slate-300">
              Browse your high-converting dark-mode customer storefront, test checkouts, and verify instant automated file deliveries.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenStorePreview();
              }}
              className="mt-1 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 font-mono text-xs font-semibold hover:bg-cyan-900/50 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Customer Storefront</span>
            </button>
          </div>

          {/* Step 3: Export Clean Production Codebase */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-black/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>3. Deploy to Custom Domain (.ZIP)</span>
              </div>
              <span className="text-[11px] font-mono text-teal-400 font-bold">100% HARDENED</span>
            </div>
            <p className="text-xs text-slate-300">
              Download the clean, zero-secret production archive (`neonforge-os-current.zip`) and deploy to your own domain or server (Vercel, Render, Railway, AWS).
            </p>
            <button
              onClick={() => {
                playSound('click');
                neonforgeApi.downloadProjectZip();
              }}
              className="mt-1 px-3 py-1.5 rounded-lg border border-teal-500/50 bg-teal-950/40 text-teal-300 font-mono text-xs font-semibold hover:bg-teal-900/50 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Production Package (.ZIP)</span>
            </button>
          </div>
        </div>

        {/* Footer info & Done */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic license vault active</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-black transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_#10b981]"
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
            }}
          >
            Ready for Live Sales 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
