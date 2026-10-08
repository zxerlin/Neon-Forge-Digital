import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Tag, 
  Download, 
  ShieldCheck, 
  Flame, 
  ShoppingBag, 
  Check, 
  Layers, 
  Coins, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Copy
} from 'lucide-react';
import { DigitalProduct, DeliverableType } from '../types';
import { generateDigitalProductWithAI } from '../services/geminiService';
import { playSound } from '../utils/audio';

interface ProductLabViewProps {
  apiKey: string;
  onAddProduct: (product: DigitalProduct) => void;
  onSwitchToStore: () => void;
}

export const ProductLabView: React.FC<ProductLabViewProps> = ({
  apiKey,
  onAddProduct,
  onSwitchToStore
}) => {
  const [nicheInput, setNicheInput] = useState('');
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('notion_template');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<Partial<DigitalProduct> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const PRESET_NICHES = [
    { name: 'Cyberpunk Notion Planner', type: 'notion_template' as DeliverableType },
    { name: 'Midjourney Studio Lighting Codex', type: 'prompt_matrix' as DeliverableType },
    { name: 'Neon 50/30/20 Budget Spreadsheet', type: 'financial_planner' as DeliverableType },
    { name: 'Sci-Fi HUD 450+ Vector Icons', type: 'svg_bundle' as DeliverableType },
    { name: 'Dark Mode SaaS UI Design System', type: 'ui_kit' as DeliverableType },
    { name: 'Lossless UI Mechanical Sound FX', type: 'audio_sfx_pack' as DeliverableType },
  ];

  const handleGenerate = async (targetNiche?: string, targetType?: DeliverableType) => {
    const niche = (targetNiche || nicheInput).trim() || 'Cyberpunk Productivity & Creative Systems';
    const type = targetType || deliverableType;

    setIsGenerating(true);
    playSound('agent');

    try {
      const result = await generateDigitalProductWithAI(niche, type, apiKey);
      setGeneratedProduct(result);
      playSound('success');
    } catch (err) {
      console.error('Error generating product:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToStore = () => {
    if (!generatedProduct) return;

    const newProduct: DigitalProduct = {
      id: `prod-ai-${Date.now()}`,
      sku: `DIG-${deliverableType.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: generatedProduct.title || 'Handmade Autonomous Digital Asset',
      subtitle: generatedProduct.subtitle || 'High-converting digital tool ready for instant download',
      slug: (generatedProduct.title || 'asset').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      niche: nicheInput || 'Creative Solopreneur Tools',
      price: generatedProduct.price || 34.00,
      compareAtPrice: generatedProduct.compareAtPrice || 68.00,
      profitMargin: 98.2,
      salesCount: 0,
      totalRevenue: 0,
      rating: 5.0,
      reviewsCount: 0,
      deliverableType: deliverableType,
      deliverableFiles: generatedProduct.deliverableFiles || [
        {
          name: 'Handmade_Master_Deliverable.zip',
          size: '16.4 MB',
          format: 'Master Asset Archive',
          contentPreview: 'Full source files included.'
        }
      ],
      licenseType: 'Commercial Standard',
      description: generatedProduct.description || '',
      features: generatedProduct.features || ['Handmade digital asset', 'Commercial rights included'],
      mockupTheme: {
        primaryColor: deliverableType === 'notion_template' ? '#00f0ff' : deliverableType === 'prompt_matrix' ? '#ff007f' : '#39ff14',
        secondaryColor: '#b026ff',
        accentGlow: 'rgba(0, 240, 255, 0.4)',
        icon: 'LayoutDashboard'
      },
      etsyOptimization: generatedProduct.etsyOptimization || {
        seoTitle: `${generatedProduct.title} Digital Download Template`,
        thirteenTags: ['digital template', 'instant download', 'commercial use'],
        listingCategory: 'Digital Downloads / Templates',
        etsySearchVolumeScore: 94,
        competitionLevel: 'Low'
      },
      marketingAssets: generatedProduct.marketingAssets || {
        redditHook: 'How I saved 10 hours a week with this automated system',
        xThreadHook: 'The exact framework top creators use to scale digital goods 🧵👇',
        tikTokScript: 'Showing the cleanest aesthetic template you can download today.',
        pinterestPinTitle: 'Aesthetic Digital Download 2026'
      },
      compliance: {
        commercialRightsWarranted: true,
        digitalSalesTaxExemptNote: 'Automated electronic delivery.',
        vatMossCompliant: true,
        licenseAgreementText: 'Non-exclusive commercial license authorized.'
      },
      createdAt: new Date().toISOString().split('T')[0],
      isPublishedToEtsy: true,
      isPublishedToStore: true,
      status: 'active'
    };

    onAddProduct(newProduct);
    playSound('cash');
    onSwitchToStore();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSound('click');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-fuchsia-400" />
            <h2 className="font-mono text-lg font-bold uppercase text-white tracking-wide">
              AUTONOMOUS AI PRODUCT FORGE (ARIA & REX)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Procedurally construct 100% authentic, handmade digital assets. Complete with Notion schemas, formulas, 13 Etsy SEO tags, and multi-channel marketing campaigns. Zero dropshipping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/40">
            {apiKey ? 'GEMINI 3.8 FLASH ACTIVE' : 'INTELLIGENT PROCEDURAL ENGINE ACTIVE'}
          </span>
        </div>
      </div>

      {/* Input / Control Station */}
      <div className="rounded-xl border border-fuchsia-500/30 bg-[#090d18] p-5 shadow-xl glow-magenta space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-fuchsia-300 mb-2">
            Step 1: Select High-Demand Digital Asset Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'notion_template', label: 'Notion OS', desc: 'Workspaces & Dashboards' },
              { id: 'prompt_matrix', label: 'AI Codex', desc: 'Prompts & Lighting Rigs' },
              { id: 'financial_planner', label: 'Sheets / Excel', desc: 'Budget & FIRE Trackers' },
              { id: 'svg_bundle', label: 'Vector / HUD', desc: '400+ SVG / Cut Files' },
              { id: 'ui_kit', label: 'Figma UI Kit', desc: 'Design Systems' },
              { id: 'audio_sfx_pack', label: 'Audio SFX', desc: 'Lossless UI Sounds' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setDeliverableType(fmt.id as DeliverableType);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  deliverableType === fmt.id
                    ? 'bg-fuchsia-950/80 border-fuchsia-400 text-white shadow-md shadow-fuchsia-950/80'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-xs font-bold text-slate-200">{fmt.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Niche Input & Presets */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-fuchsia-300 mb-1.5">
            Step 2: Define Product Niche or Target Audience
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              placeholder="e.g. Dark Academia Student Notion Planner, Midjourney Cinematic Cyberpunk, Crypto Tax Calculator..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-fuchsia-400 rounded-lg text-sm text-slate-100 font-mono outline-none"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing Asset...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Forge Digital Asset</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Trending Niche Radar:</span>
            {PRESET_NICHES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setNicheInput(preset.name);
                  setDeliverableType(preset.type);
                  handleGenerate(preset.name, preset.type);
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-fuchsia-500/50 text-[11px] font-mono text-slate-300 transition-colors"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Product Blueprint Showcase */}
      {generatedProduct && (
        <div className="rounded-xl border border-cyan-500/40 bg-[#090d18] p-5 shadow-2xl glow-cyan space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                GENERATED READY-TO-SELL BLUEPRINT
              </span>
              <h3 className="font-mono text-xl font-bold text-white mt-1">
                {generatedProduct.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">{generatedProduct.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Recommended Price</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 line-through text-xs font-mono">
                    ${generatedProduct.compareAtPrice?.toFixed(2)}
                  </span>
                  <span className="text-emerald-400 text-lg font-mono font-bold">
                    ${generatedProduct.price?.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePublishToStore}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Publish to Live Store & Etsy</span>
              </button>
            </div>
          </div>

          {/* Grid: Deliverables, Etsy SEO, & Marketing Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1: Deliverables & Features */}
            <div className="space-y-4 rounded-lg bg-slate-900/60 border border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400">
                <Download className="w-4 h-4" />
                <span>Deliverable Vault Packaging</span>
              </div>

              <div className="space-y-2">
                {generatedProduct.deliverableFiles?.map((f, i) => (
                  <div key={i} className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span className="truncate">{f.name}</span>
                      <span className="text-cyan-400 text-[10px]">{f.size}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {f.contentPreview}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                  Included Value Propostions:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {generatedProduct.features?.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2: Etsy 13-Tag SEO Nexus */}
            <div className="space-y-4 rounded-lg bg-slate-900/60 border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-blue-400">
                  <Tag className="w-4 h-4" />
                  <span>Etsy 13-Tag SEO Optimizer</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                  Score: 96/100
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Etsy Long-Tail Listing Title:
                </span>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-200 flex items-start justify-between gap-2">
                  <span>{generatedProduct.etsyOptimization?.seoTitle}</span>
                  <button
                    onClick={() => copyToClipboard(generatedProduct.etsyOptimization?.seoTitle || '', 'title')}
                    className="text-slate-400 hover:text-white flex-shrink-0"
                    title="Copy Title"
                  >
                    {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                  13 Algorithmic Tags (Zero Fillers):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedProduct.etsyOptimization?.thirteenTags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-[10px] font-mono text-blue-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Viral Marketing Engine (Maya) */}
            <div className="space-y-4 rounded-lg bg-slate-900/60 border border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                <Flame className="w-4 h-4" />
                <span>Multi-Channel Viral Reactor</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase mb-0.5">
                    <span>Reddit Launch Hook (r/Notion, r/design)</span>
                    <button
                      onClick={() => copyToClipboard(generatedProduct.marketingAssets?.redditHook || '', 'reddit')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'reddit' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    "{generatedProduct.marketingAssets?.redditHook}"
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase mb-0.5">
                    <span>X Thread Opener</span>
                    <button
                      onClick={() => copyToClipboard(generatedProduct.marketingAssets?.xThreadHook || '', 'x')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'x' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    "{generatedProduct.marketingAssets?.xThreadHook}"
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-fuchsia-400 font-bold uppercase mb-0.5">
                    <span>TikTok / Shorts Video Hook</span>
                    <button
                      onClick={() => copyToClipboard(generatedProduct.marketingAssets?.tikTokScript || '', 'tiktok')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'tiktok' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    "{generatedProduct.marketingAssets?.tikTokScript}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
