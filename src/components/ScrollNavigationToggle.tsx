import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Layers,
  Sparkles
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface ScrollNavigationToggleProps {
  currentTab: NavTab | 'storefront';
  onSelectTab?: (tab: NavTab) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  isAdminView: boolean;
}

export const ScrollNavigationToggle: React.FC<ScrollNavigationToggleProps> = ({
  currentTab,
  onSelectTab,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  isAdminView
}) => {
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const scrollByAmount = (amount: number) => {
    window.scrollBy({ top: amount, behavior: 'smooth' });
  };

  return (
    <aside 
      aria-label="Navigation and Scroll Controls"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.25)] text-slate-200 transition-all text-xs font-mono select-none"
    >
      {/* Scroll Progress Indicator Bar */}
      <div 
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-t-2xl transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* History Back & Forward (ADMIN WORKSPACE ONLY - Strictly hidden in customer view) */}
      {isAdminView && (
        <>
          <button
            onClick={onBack}
            disabled={!canGoBack}
            title="Go to prior screen/tab (Back)"
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              canGoBack 
                ? 'bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 text-cyan-300 cursor-pointer border border-slate-800 shadow-sm' 
                : 'bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onForward}
            disabled={!canGoForward}
            title="Go to next screen/tab (Forward)"
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              canGoForward 
                ? 'bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 text-cyan-300 cursor-pointer border border-slate-800 shadow-sm' 
                : 'bg-slate-900/40 text-slate-600 cursor-not-allowed border border-slate-900'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />
        </>
      )}

      {/* Scroll Up */}
      <button
        onClick={() => scrollByAmount(-350)}
        title="Scroll page up"
        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 border border-slate-800 transition-all cursor-pointer"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Scroll Down */}
      <button
        onClick={() => scrollByAmount(350)}
        title="Scroll page down"
        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 border border-slate-800 transition-all cursor-pointer"
      >
        <ArrowDown className="w-4 h-4" />
      </button>

      <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        title="Scroll to top of page"
        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer font-bold flex items-center gap-1"
      >
        <span>TOP</span>
      </button>

      {/* Scroll to Bottom */}
      <button
        onClick={scrollToBottom}
        title="Scroll to bottom of page"
        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer font-bold flex items-center gap-1"
      >
        <span>BOT</span>
      </button>

      {isAdminView && onSelectTab && (
        <>
          <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />
          <div className="relative">
            <button
              onClick={() => setShowHistoryMenu(!showHistoryMenu)}
              title="Quick jump to factory tabs"
              className="p-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-semibold uppercase">{currentTab}</span>
            </button>

            {showHistoryMenu && (
              <div className="absolute bottom-12 right-0 w-52 py-2 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Quick Page Switcher
                </div>
                <div className="max-h-60 overflow-y-auto flex flex-col p-1">
                  {[
                    { id: 'factory', label: '1. Cyber Factory Game' },
                    { id: 'flowchart', label: '2. Pipeline Flowchart' },
                    { id: 'ultron', label: '3. Ultron Commander' },
                    { id: 'multichannel', label: '3.5. Stripe & Etsy v3' },
                    { id: 'product-lab', label: '4. Product Lab' },
                    { id: 'storefront', label: '5. Live Storefront' },
                    { id: 'inventory', label: '6. Inventory & Vault' },
                    { id: 'marketing', label: '7. Marketing Hub' },
                    { id: 'crm', label: '8. CRM & Support' },
                    { id: 'compliance', label: '9. Permits & Legal' },
                    { id: 'whop-analysis', label: '10. Whop Teardown' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onSelectTab(tab.id as NavTab);
                        setShowHistoryMenu(false);
                      }}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                        currentTab === tab.id 
                          ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' 
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {currentTab === tab.id && <Sparkles className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};
