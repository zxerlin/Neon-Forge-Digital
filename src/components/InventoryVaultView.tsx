import React, { useState } from 'react';
import { 
  Package, 
  Key, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  FileCode, 
  HardDrive, 
  Layers, 
  Sparkles,
  ExternalLink,
  Shuffle,
  Palette,
  BarChart3
} from 'lucide-react';
import { DigitalProduct, Order } from '../types';
import { playSound } from '../utils/audio';
import { RevenueHeatmap } from './RevenueHeatmap';
import { ThemeMatrixModal } from './ThemeMatrixModal';
import { useTheme } from '../hooks/useTheme';
import { neonforgeApi } from '../services/neonforgeApi';

interface InventoryVaultViewProps {
  products: DigitalProduct[];
  orders: Order[];
  onResetLiveMode?: () => void;
}

export const InventoryVaultView: React.FC<InventoryVaultViewProps> = ({
  products,
  orders,
  onResetLiveMode
}) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const { theme, remix, currentDramaticFont } = useTheme();

  const copyToken = (tok: string) => {
    navigator.clipboard.writeText(tok);
    setCopiedToken(tok);
    playSound('click');
    setTimeout(() => setCopiedToken(null), 1500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5"
        style={{ borderColor: theme.borderTheme }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5" style={{ color: theme.neonLime }} />
            <h2 className="font-mono text-lg font-bold uppercase text-white tracking-wide">
              AUTOMATED DIGITAL INVENTORY & TOKEN VAULT
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Zero-stockout digital inventory manager. Tracks asset deliverable payloads, cryptographic SHA-256 license keys, rate-limited download tokens, and serverless CDN distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Palette Remix Button */}
          <button
            onClick={() => remix()}
            className="px-3.5 py-1.5 rounded-lg font-mono text-xs font-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonMagenta})`,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow
            }}
            title="Remix all color schemes including the dark background (100,000+ combinations)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>REMIX MATRIX 🎲</span>
          </button>

          {/* Export Project ZIP Button */}
          <button
            onClick={() => {
              playSound('click');
              neonforgeApi.downloadProjectZip();
            }}
            className="px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 border transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderColor: '#10b981',
              color: '#34d399'
            }}
            title="Download complete NeonForge OS application archive (.ZIP) with Express backend, Vite React frontend, and tests"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT PROJECT (.ZIP)</span>
          </button>

          {/* Palette Studio */}
          <button
            onClick={() => {
              playSound('click');
              setShowThemeModal(true);
            }}
            className="p-1.5 rounded-lg border text-slate-300 hover:text-white transition-colors"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme
            }}
            title="Open Palette Studio"
          >
            <Palette className="w-4 h-4" />
          </button>

          <span 
            className="text-xs font-mono px-3 py-1.5 rounded border"
            style={{
              backgroundColor: theme.bgCard,
              color: theme.neonLime,
              borderColor: theme.neonLime
            }}
          >
            Vault: 100% Operational
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme,
            boxShadow: `0 0 15px color-mix(in srgb, ${theme.neonLime} 25%, transparent)`
          }}
        >
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Digital SKUs</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{products.length} Items</div>
          <span className="text-[11px] font-mono" style={{ color: theme.neonLime }}>Instant Delivery Enabled</span>
        </div>

        <div 
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme,
            boxShadow: `0 0 15px color-mix(in srgb, ${theme.neonCyan} 25%, transparent)`
          }}
        >
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Deliveries Sealed</span>
          <div className="text-2xl font-mono font-bold mt-1" style={{ color: theme.neonCyan }}>
            {orders.length} Bundles
          </div>
          <span className="text-[11px] text-slate-300 font-mono">0 Failed Downloads</span>
        </div>

        <div 
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme,
            boxShadow: `0 0 15px color-mix(in srgb, ${theme.neonMagenta} 25%, transparent)`
          }}
        >
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Storage Payload</span>
          <div className="text-2xl font-mono font-bold mt-1" style={{ color: theme.neonMagenta }}>
            112.4 MB
          </div>
          <span className="text-[11px] text-slate-300 font-mono">Global Edge CDN Cached</span>
        </div>

        <div 
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme,
            boxShadow: `0 0 15px color-mix(in srgb, ${theme.neonAmber} 25%, transparent)`
          }}
        >
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Active License Keys</span>
          <div className="text-2xl font-mono font-bold mt-1" style={{ color: theme.neonAmber }}>
            {orders.length} Keys
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">100% Non-Revoked</span>
        </div>
      </div>

      {/* D3-BASED REVENUE HEATMAP: Peak Sales Hours & 30-Day Product Performance */}
      <RevenueHeatmap
        products={products}
        orders={orders}
        onOpenThemeModal={() => setShowThemeModal(true)}
        onResetLiveMode={onResetLiveMode}
      />

      {/* Active Inventory SKUs Table */}
      <div 
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderTheme
        }}
      >
        <div 
          className="p-3 border-b text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderTheme,
            color: theme.neonCyan
          }}
        >
          <span>Digital Master Asset Catalog</span>
          <span className="text-slate-400 font-normal">Automated Quota & File Verifier</span>
        </div>

        <div className="divide-y" style={{ borderColor: theme.borderTheme }}>
          {products.map((p, i) => (
            <div 
              key={`${p.id}-${i}`} 
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: theme.neonCyan }}>{p.sku}</span>
                  <span className="text-white font-mono text-sm font-bold">{p.title}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Deliverable: {p.deliverableType.replace('_', ' ')} · Price: ${p.price.toFixed(2)} · Sales: {p.salesCount} units
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {p.deliverableFiles.map((f, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded border text-[10px] font-mono text-slate-300"
                      style={{
                        backgroundColor: theme.bgSurface,
                        borderColor: theme.borderTheme
                      }}
                    >
                      {f.name} ({f.size})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">Fulfillment Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Always In Stock
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">License Model</span>
                  <span style={{ color: theme.neonCyan }}>{p.licenseType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cryptographic Licenses & Download Tokens Issued */}
      <div 
        className="rounded-xl border p-4 space-y-3"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderTheme
        }}
      >
        <div className="text-xs font-mono font-bold uppercase text-slate-300">
          Recent Cryptographic License Keys & Tokens Issued
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b text-[10px] uppercase text-slate-400" style={{ borderColor: theme.borderTheme }}>
                <th className="pb-2">Order #</th>
                <th className="pb-2">Buyer</th>
                <th className="pb-2">License Key</th>
                <th className="pb-2">Download Token</th>
                <th className="pb-2">Downloads</th>
                <th className="pb-2">Issued At</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-300" style={{ borderColor: theme.borderTheme }}>
              {orders.slice(0, 5).map((ord, i) => (
                <tr key={`${ord.id}-${i}`} className="hover:bg-white/5">
                  <td className="py-2.5 font-bold" style={{ color: theme.neonCyan }}>{ord.orderNumber}</td>
                  <td className="py-2.5">{ord.customerName}</td>
                  <td className="py-2.5 font-bold select-all" style={{ color: theme.neonAmber }}>{ord.licenseKey}</td>
                  <td className="py-2.5">
                    <button
                      onClick={() => copyToken(ord.downloadToken)}
                      className="text-slate-400 hover:text-white underline"
                    >
                      {copiedToken === ord.downloadToken ? 'Copied!' : ord.downloadToken.slice(0, 14) + '...'}
                    </button>
                  </td>
                  <td className="py-2.5 text-emerald-400">{ord.downloadCount} / {ord.maxDownloads}</td>
                  <td className="py-2.5 text-slate-400">{ord.timestamp}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => {
                        playSound('click');
                        neonforgeApi.downloadOrderPackage(ord.orderNumber, ord.downloadToken);
                      }}
                      className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                      title="Download authentic generated .ZIP package from the server engine"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>.ZIP</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Theme Matrix Remix Modal */}
      <ThemeMatrixModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </div>
  );
};

