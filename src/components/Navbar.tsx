import React, { useState } from 'react';
import { 
  Zap, 
  Volume2, 
  VolumeX, 
  DollarSign, 
  ShoppingBag, 
  Cpu, 
  Key, 
  Sparkles, 
  ExternalLink, 
  Flame, 
  Activity,
  Shuffle,
  Palette,
  Contrast,
  Download,
  RotateCcw,
  Rocket,
  ShieldCheck
} from 'lucide-react';
import { playSound, isSoundEnabled, toggleSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';
import { ThemeMatrixModal } from './ThemeMatrixModal';
import { DataResetModal } from './DataResetModal';
import { GoLiveModal } from './GoLiveModal';
import { neonforgeApi } from '../services/neonforgeApi';

interface NavbarProps {
  totalRevenue: number;
  totalOrders: number;
  activeAgentsCount: number;
  totalProductsCount: number;
  isOverdriveActive: boolean;
  onTriggerOverdrive: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onOpenStorePreview: () => void;
  onResetLiveMode?: () => void;
  onOpenLazyButton?: () => void;
  onOpenMultiChannel?: () => void;
  onOpenAgent0?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalRevenue,
  totalOrders,
  activeAgentsCount,
  totalProductsCount,
  isOverdriveActive,
  onTriggerOverdrive,
  apiKey,
  onSaveApiKey,
  onOpenStorePreview,
  onResetLiveMode,
  onOpenLazyButton,
  onOpenMultiChannel,
  onOpenAgent0
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const { theme, remix, currentDramaticFont, toggleHighContrast, isHighContrast } = useTheme();

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playSound('click');
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setShowKeyModal(false);
    playSound('success');
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 h-16 border-b backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-all"
        style={{
          backgroundColor: `${theme.bgSurface}E6`,
          borderColor: theme.borderTheme
        }}
      >
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            className="relative flex items-center justify-center w-10 h-10 rounded-lg border shadow-lg overflow-hidden flex-shrink-0"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.neonCyan,
              boxShadow: `0 0 15px color-mix(in srgb, ${theme.neonCyan} 40%, transparent)`
            }}
          >
            <img 
              src="/assets/neon_forge_logo.jpg" 
              alt="Neon Forge Digital" 
              className="w-full h-full object-cover object-center absolute inset-0 z-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Zap className="w-5 h-5 animate-pulse relative z-0 opacity-80" style={{ color: theme.neonCyan }} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-10">
              <span 
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: theme.neonCyan }}
              />
              <span 
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: theme.neonCyan }}
              />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-base font-bold tracking-wider uppercase bg-clip-text text-transparent font-mono"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${theme.neonCyan}, ${theme.neonMagenta}, ${theme.neonAmber})`
                }}
              >
                NeonForge Digital
              </span>
              <span 
                className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded border font-bold"
                style={{
                  backgroundColor: theme.bgCard,
                  color: theme.neonCyan,
                  borderColor: theme.neonCyan
                }}
              >
                neonforgedigital.net
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Digital Goods Factory & Sovereign Storefront Matrix
            </p>
          </div>
        </div>

        {/* Center: Live KPI Ticker */}
        <div 
          className="hidden md:flex items-center gap-6 rounded-lg px-4 py-1.5 shadow-inner border"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Revenue</span>
            <span className="font-mono text-sm font-bold text-emerald-400 flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 -mr-0.5" />
              {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Orders</span>
            <span className="font-mono text-sm font-bold flex items-center gap-1" style={{ color: theme.neonCyan }}>
              <ShoppingBag className="w-3.5 h-3.5" style={{ color: theme.neonCyan }} />
              {totalOrders}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">SKUs</span>
            <span className="font-mono text-sm font-bold" style={{ color: theme.neonAmber }}>
              {totalProductsCount} Live
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Agents</span>
            <span className="font-mono text-sm font-bold flex items-center gap-1" style={{ color: theme.neonMagenta }}>
              <Cpu className="w-3.5 h-3.5" style={{ color: theme.neonMagenta }} />
              {activeAgentsCount}/8 Active
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* THE GLOWING EMERALD GO LIVE BUTTON */}
          <button
            onClick={() => {
              playSound('warp');
              setShowGoLiveModal(true);
            }}
            className="relative group px-3.5 py-1.5 rounded-full font-mono text-xs font-black flex items-center gap-1.5 transition-all duration-300 transform hover:scale-108 active:scale-95 shadow-[0_0_20px_#10b981,0_0_35px_#059669] hover:shadow-[0_0_30px_#34d399,0_0_50px_#10b981] border-2 border-emerald-300 text-black flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
            }}
            title="GO LIVE: Open the Live Production Launch Console (Stripe Live Keys, Etsy Connection, Custom Domain Export, and Storefront)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute -top-1 -right-1" />
            <Rocket className="w-3.5 h-3.5 text-black group-hover:rotate-45 transition-transform duration-300" />
            <span className="tracking-wider uppercase font-sans font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              🟢 GO LIVE
            </span>
          </button>

          {/* AGENT 0: AUTONOMOUS CASH GATEWAY & WEBHOOK OVERSEER */}
          {onOpenAgent0 && (
            <button
              onClick={() => {
                playSound('warp');
                onOpenAgent0();
              }}
              className="relative group px-3.5 py-1.5 rounded-full font-mono text-xs font-black flex items-center gap-1.5 transition-all duration-300 transform hover:scale-108 active:scale-95 shadow-[0_0_20px_#f59e0b,0_0_35px_#d97706] hover:shadow-[0_0_30px_#fbbf24,0_0_50px_#f59e0b] border-2 border-amber-300 text-black flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
              }}
              title="AGENT 0: Cash Payment Gateway Overseer (Auto-applies Stripe webhooks, verifies pk_live/sk_live keys, audits end pages, and checks customer visibility)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-100 animate-ping absolute -top-1 -right-1" />
              <ShieldCheck className="w-3.5 h-3.5 text-black group-hover:scale-110 transition-transform duration-300" />
              <span className="tracking-wider uppercase font-sans font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                👑 AGENT 0 (CASH GATE)
              </span>
            </button>
          )}

          {/* NEON BLUE DATA RESET BUTTON (NON-DEMO LIVE BASELINE) */}
          <button
            onClick={() => {
              playSound('click');
              setShowResetModal(true);
            }}
            className="relative group px-3.5 py-1.5 rounded-full font-mono text-xs font-black flex items-center gap-1.5 transition-all duration-300 transform hover:scale-108 active:scale-95 shadow-[0_0_20px_#00f0ff,0_0_35px_#0284c7] hover:shadow-[0_0_30px_#38bdf8,0_0_55px_#00f0ff] border-2 border-cyan-300 text-black flex-shrink-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #00f0ff 60%, #0284c7 100%)'
            }}
            title="NEON BLUE DATA RESET: Resets all profit numbers and order counters to $0.00 Live Baseline without demo/mock data injection. Preserves all catalog products and integrations."
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -top-1 -right-1" />
            <RotateCcw className="w-3.5 h-3.5 text-black group-hover:rotate-180 transition-transform duration-500" />
            <span className="tracking-wider uppercase font-sans font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              ⚡ RESET DATA ($0)
            </span>
          </button>

          {/* THE ROUND BRIGHT NEON DEEP PURPLE LAZY BUTTON */}
          <button
            onClick={() => {
              playSound('warp');
              if (onOpenLazyButton) onOpenLazyButton();
            }}
            className="relative group px-3.5 py-1.5 rounded-full font-mono text-xs font-extrabold flex items-center gap-2 transition-all duration-300 transform hover:scale-108 active:scale-95 shadow-[0_0_20px_#9333ea,0_0_35px_#7e22ce] hover:shadow-[0_0_30px_#c084fc,0_0_50px_#9333ea] border-2 border-purple-300 text-white"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #c084fc 0%, #9333ea 50%, #581c87 100%)'
            }}
            title="THE LAZY BUTTON: 1-Click Autonomous Multi-Agent Swarm (Scouts niches, synthesizes products, drafts marketing, and arms real payment gateway)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-200 animate-ping absolute -top-1 -right-1" />
            <Sparkles className="w-4 h-4 text-purple-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="tracking-wider uppercase font-sans font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              🟣 LAZY BUTTON
            </span>
          </button>

          {/* Global Theme Toggle: Switch between 'Neon' and 'High-Contrast Technical' monochrome */}
          <button
            onClick={() => toggleHighContrast()}
            className="relative px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md flex-shrink-0 border"
            style={{
              backgroundColor: isHighContrast ? '#ffffff' : theme.bgCard,
              color: isHighContrast ? '#000000' : theme.neonCyan,
              borderColor: isHighContrast ? '#ffffff' : theme.neonCyan,
              boxShadow: isHighContrast 
                ? '0 0 15px rgba(255, 255, 255, 0.4)' 
                : `0 0 15px color-mix(in srgb, ${theme.neonCyan} 30%, transparent)`
            }}
            title={isHighContrast ? "Accessibility: Switch to Neon Cyberpunk Theme" : "Accessibility: Switch to High-Contrast Technical Monochrome Theme for intense monitoring"}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isHighContrast ? 'TECH MONO' : 'NEON'}
            </span>
          </button>

          {/* Color Matrix Remix Toggle (Global) */}
          <button
            onClick={() => remix()}
            className="relative px-3 py-1.5 rounded-lg font-mono text-xs font-black flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})`,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow
            }}
            title="Remix all colors including deep void background, boxes, and robots (100,000+ combinations)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REMIX</span>
            <span>🎲</span>
          </button>

          {/* Color Studio Palette Picker */}
          <button
            onClick={() => {
              playSound('click');
              setShowThemeModal(true);
            }}
            className="p-2 rounded-lg border text-slate-300 hover:text-white transition-colors"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme
            }}
            title="Color Studio & Presets"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Overdrive Pulse Button */}
          <button
            onClick={() => {
              playSound('warp');
              onTriggerOverdrive();
            }}
            disabled={isOverdriveActive}
            className={`relative group px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all duration-300 border ${
              isOverdriveActive
                ? 'animate-pulse'
                : 'shadow-lg hover:scale-105'
            }`}
            style={{
              backgroundColor: isOverdriveActive ? `color-mix(in srgb, ${theme.neonMagenta} 30%, transparent)` : theme.bgCard,
              borderColor: theme.neonMagenta,
              color: isOverdriveActive ? '#ffffff' : theme.neonMagenta
            }}
          >
            <Flame className={`w-3.5 h-3.5 ${isOverdriveActive ? 'animate-bounce' : ''}`} style={{ color: theme.neonMagenta }} />
            <span className="tracking-wide hidden md:inline">
              {isOverdriveActive ? 'RUNNING OVERDRIVE...' : 'RUN ALL AGENTS'}
            </span>
          </button>

          {/* Customer Store Preview & Lock Matrix */}
          <button
            onClick={() => {
              playSound('click');
              onOpenStorePreview();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors flex items-center gap-1.5 shadow-md"
            style={{
              backgroundColor: '#090d18',
              borderColor: '#ef4444',
              color: '#f87171'
            }}
            title="Lock Matrix & Switch to Customer Storefront (Requires Admin Password to re-enter)"
          >
            <span>🔒 LOCK MATRIX</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onOpenStorePreview();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme,
              color: theme.neonCyan
            }}
            title="Open Live Customer Storefront & Checkout Preview"
          >
            <ShoppingBag className="w-3.5 h-3.5" style={{ color: theme.neonCyan }} />
            <span className="hidden lg:inline">Store Preview</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </button>

          {/* Download Complete Project ZIP */}
          <button
            onClick={() => {
              playSound('click');
              neonforgeApi.downloadProjectZip();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-[0.98]"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderColor: '#10b981',
              color: '#34d399'
            }}
            title="Download complete NeonForge OS codebase (.ZIP) including full Express server, React client, tests, and database"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export OS (.ZIP)</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme,
              color: soundOn ? theme.neonCyan : '#64748b'
            }}
            title={soundOn ? 'Mute Cyber Audio FX' : 'Enable Cyber Audio FX'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Gemini API Key Config */}
          <button
            onClick={() => {
              playSound('click');
              setShowKeyModal(true);
            }}
            className="p-2 rounded-lg border transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: apiKey ? '#10b981' : theme.borderTheme,
              color: apiKey ? '#34d399' : '#cbd5e1'
            }}
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4" />
            {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md border rounded-xl p-6 shadow-2xl"
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.neonCyan,
              boxShadow: `0 0 25px color-mix(in srgb, ${theme.neonCyan} 35%, transparent)`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: theme.neonCyan }} />
                <h3 className="font-mono text-base font-bold text-white tracking-wide">
                  Gemini AI Key Configuration
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              NeonForge OS automatically operates with rich procedural intelligence. You can also connect your own Google Gemini API key to run direct generative AI inference for digital goods, Etsy SEO tags, and customer support.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.neonCyan }}>
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-slate-700 focus:border-cyan-400 rounded-lg text-sm text-slate-100 font-mono outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Free keys at aistudio.google.com</span>
                {apiKey && (
                  <span className="text-emerald-400 font-mono">Key is currently active</span>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-black shadow-md transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})`
                  }}
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Matrix Modal */}
      <ThemeMatrixModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      {/* Non-Demo Data Reset Modal */}
      <DataResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmReset={async () => {
          if (onResetLiveMode) {
            await onResetLiveMode();
          }
        }}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalProductsCount={totalProductsCount}
      />

      {/* Production Go-Live Modal */}
      <GoLiveModal
        isOpen={showGoLiveModal}
        onClose={() => setShowGoLiveModal(false)}
        onOpenStorePreview={onOpenStorePreview}
        onOpenMultiChannel={onOpenMultiChannel || onOpenStorePreview}
        totalProductsCount={totalProductsCount}
      />
    </>
  );
};
