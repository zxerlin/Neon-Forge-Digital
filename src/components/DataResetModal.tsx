import React, { useState } from 'react';
import { 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Key, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { playSound } from '../utils/audio';

interface DataResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => Promise<void> | void;
  totalRevenue: number;
  totalOrders: number;
  totalProductsCount: number;
}

export const DataResetModal: React.FC<DataResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  totalRevenue,
  totalOrders,
  totalProductsCount
}) => {
  const { theme } = useTheme();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExecuteReset = async () => {
    try {
      setIsResetting(true);
      playSound('warp');
      await onConfirmReset();
      setResetSuccess(true);
      playSound('cash');
      setTimeout(() => {
        setResetSuccess(false);
        setIsResetting(false);
        onClose();
      }, 1400);
    } catch (e) {
      console.error(e);
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg border-2 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.4)] overflow-hidden"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: '#00f0ff'
        }}
      >
        {/* Neon Blue Header Glow Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 animate-pulse"
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_20px_#00f0ff]"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)' }}
            >
              <RotateCcw className={`w-6 h-6 text-cyan-300 ${isResetting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-lg font-black tracking-wide text-white uppercase flex items-center gap-2">
                  DATA RESET
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  NON-DEMO LIVE MODE
                </span>
              </div>
              <p className="text-xs text-cyan-200/80 font-mono">
                Clean $0.00 financial baseline • Authoritative live mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isResetting}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Numbers Transition Box */}
        <div className="mb-5 rounded-xl border border-cyan-500/30 bg-black/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-slate-400">FINANCIAL METRIC</span>
            <span className="text-slate-400">ACTION</span>
          </div>

          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Profit & Gross Revenue:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 line-through">${totalRevenue.toFixed(2)}</span>
              <span className="text-cyan-400 font-bold">➔ $0.00 (Pure Live)</span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              Orders & Transactions:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 line-through">{totalOrders} orders</span>
              <span className="text-cyan-400 font-bold">➔ 0 orders</span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Catalog Products & SKUs:
            </span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {totalProductsCount} Preserved (Untouched)
            </span>
          </div>
        </div>

        {/* Non-Demo Safeguards & Guarantees */}
        <div className="space-y-2 mb-6 text-xs text-slate-300 font-sans bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-3.5">
          <div className="flex items-start gap-2 text-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Zero Demo Data:</strong> This does NOT generate mock orders or fake revenue. It creates a 100% clean live baseline.
            </span>
          </div>
          <div className="flex items-start gap-2 text-cyan-200">
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Integrations Preserved:</strong> Stripe live credentials, Square keys, Etsy OAuth tokens, and Admin passwords remain intact.
            </span>
          </div>
          <div className="flex items-start gap-2 text-cyan-200">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Real Bank Deposits:</strong> Every dollar processed after this reset will reflect authentic customer transactions.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/60 font-mono text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cancel / Keep Data
          </button>

          <button
            type="button"
            onClick={handleExecuteReset}
            disabled={isResetting || resetSuccess}
            className="flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-cyan-300 text-black transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_25px_#00f0ff,0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_#38bdf8,0_0_55px_#00f0ff]"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 50%, #0284c7 100%)'
            }}
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>
              {resetSuccess ? '✅ RESET COMPLETE!' : isResetting ? 'RESETTING...' : 'RESET DATA TO REAL $0.00'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
