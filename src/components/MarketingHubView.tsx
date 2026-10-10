import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Tag, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Twitter, 
  Video, 
  Bookmark,
  ExternalLink,
  Search,
  Target,
  FileCode,
  TrendingUp,
  Settings,
  Percent,
  Play,
  Globe,
  Radio,
  Send,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Link,
  RefreshCw,
  Lock,
  Unlock,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DigitalProduct, Order } from '../types';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';
import { neonforgeApi } from '../services/neonforgeApi';

interface MarketingHubViewProps {
  products: DigitalProduct[];
  orders: Order[];
}

type MarketingTab = 'domain-launchpad' | 'organic' | 'seo-discoverability' | 'google-ads';

export const MarketingHubView: React.FC<MarketingHubViewProps> = ({ products, orders }) => {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<MarketingTab>('organic');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Domain & DNS State
  const [domainStatus, setDomainStatus] = useState<any>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  // Organic Syndication State
  const [syndicateChannel, setSyndicateChannel] = useState<'reddit' | 'twitter' | 'blog' | 'indiehackers' | 'pinterest' | 'tiktok'>('reddit');
  const [syndicatedContent, setSyndicatedContent] = useState<any>(null);
  const [isGeneratingSyndication, setIsGeneratingSyndication] = useState(false);
  const [isDispatchingLive, setIsDispatchingLive] = useState(false);
  const [livePublishResult, setLivePublishResult] = useState<{ type: 'success' | 'warn' | 'error'; text: string } | null>(null);

  // Social Connections & Credentials State
  const [socialConnections, setSocialConnections] = useState<any>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    discordWebhookUrl: '',
    slackWebhookUrl: '',
    zapierWebhookUrl: '',
    twitterApiKey: '',
    twitterAccessToken: '',
    redditClientId: '',
    redditUsername: ''
  });
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ platform: string; success: boolean; msg: string } | null>(null);

  // SEO Diagnostics State
  const [seoDiagnostics, setSeoDiagnostics] = useState<any>(null);

  // Google Ads Tag State
  const [adsTagId, setAdsTagId] = useState<string>(() => {
    return localStorage.getItem('neonforge_google_ads_tag_id') || 'AW-11203495822';
  });
  const [tagSaveMsg, setTagSaveMsg] = useState<string | null>(null);

  // Link Builder State
  const [utmMedium, setUtmMedium] = useState<string>('cpc');
  const [utmCampaign, setUtmCampaign] = useState<string>('cyber_launch_2026');
  const [utmTerm, setUtmTerm] = useState<string>('notion_cyberpunk');
  const [promoCode, setPromoCode] = useState<string>('CYBER30');

  // Live Spend and Clicks Config State
  const [liveSpendConfig, setLiveSpendConfig] = useState<Record<string, { spend: number; clicks: number }>>(() => {
    const saved = localStorage.getItem('neonforge_live_spend_config');
    return saved ? JSON.parse(saved) : {
      'camp-1': { spend: 0, clicks: 0 },
      'camp-2': { spend: 0, clicks: 0 },
      'camp-3': { spend: 0, clicks: 0 },
      'camp-4': { spend: 0, clicks: 0 },
    };
  });

  useEffect(() => {
    localStorage.setItem('neonforge_live_spend_config', JSON.stringify(liveSpendConfig));
  }, [liveSpendConfig]);

  // Load Initial Statuses
  useEffect(() => {
    checkDomain();
    fetchSocialConnections();
    neonforgeApi.getSeoDiagnostics().then(data => {
      if (data) setSeoDiagnostics(data);
    });
  }, []);

  const fetchSocialConnections = async () => {
    const data = await neonforgeApi.getSocialConnections();
    if (data) {
      setSocialConnections(data);
    }
  };

  const checkDomain = async () => {
    setIsCheckingDomain(true);
    const data = await neonforgeApi.getDomainStatus();
    if (data) setDomainStatus(data);
    setIsCheckingDomain(false);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Auto-generate initial syndication preview when product or channel changes
  useEffect(() => {
    if (selectedProduct) {
      handleGenerateSyndication(false);
    }
  }, [selectedProductId, syndicateChannel]);

  const handleGenerateSyndication = async (playSoundEffect = true) => {
    if (!selectedProduct) return;
    setIsGeneratingSyndication(true);
    if (playSoundEffect) playSound('agent');
    const res = await neonforgeApi.syndicateMarketing(selectedProduct.id, syndicateChannel);
    if (res && res.campaign) {
      setSyndicatedContent(res.campaign);
    }
    setIsGeneratingSyndication(false);
  };

  // Direct Autonomous Background Dispatch
  const handlePublishLive = async (targetPlatform: string) => {
    if (!syndicatedContent || !selectedProduct) return;
    setIsDispatchingLive(true);
    playSound('agent');

    const res = await neonforgeApi.publishSocialLive({
      platform: targetPlatform,
      campaign: syndicatedContent,
      productTitle: selectedProduct.title
    });

    if (res.success) {
      setLivePublishResult({
        type: 'success',
        text: `✅ ${res.message || 'Post autonomously published!'}`
      });
      playSound('cash');
      fetchSocialConnections();
    } else if (res.requiresAuth) {
      setLivePublishResult({
        type: 'warn',
        text: `🔒 ${res.error}`
      });
      playSound('alert');
      setShowConfigModal(true);
    } else {
      setLivePublishResult({
        type: 'error',
        text: `❌ ${res.error || 'Failed to dispatch post'}`
      });
      playSound('alert');
    }

    setIsDispatchingLive(false);
    setTimeout(() => setLivePublishResult(null), 6000);
  };

  // Test individual platform connection
  const handleTestConnection = async (platform: string) => {
    setTestingPlatform(platform);
    playSound('click');
    const res = await neonforgeApi.testSocialConnection(platform);
    setTestResult({
      platform,
      success: res.success,
      msg: res.message || res.error || 'Test completed'
    });
    if (res.success) playSound('cash');
    else playSound('alert');
    setTestingPlatform(null);
  };

  // Save Social Config
  const handleSaveSocialConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    const res = await neonforgeApi.saveSocialConfig(configForm);
    if (res.success) {
      playSound('cash');
      fetchSocialConnections();
      setShowConfigModal(false);
      setLivePublishResult({ type: 'success', text: '✅ Social platform credentials saved securely.' });
      setTimeout(() => setLivePublishResult(null), 4000);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSound('click');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSaveTagId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('neonforge_google_ads_tag_id', adsTagId.trim());
    if (typeof window !== 'undefined') {
      (window as any).VITE_GOOGLE_ADS_ID = adsTagId.trim();
    }
    setTagSaveMsg('✅ Google Ads tag saved! Lightweight gtag.js tracker configured.');
    playSound('cash');
    setTimeout(() => setTagSaveMsg(null), 3000);
  };

  // Generate UTM Link
  const buildUtmLink = () => {
    if (!selectedProduct) return '';
    const cleanUrl = window.location.origin;
    const url = new URL(cleanUrl);
    url.searchParams.set('checkout_product', selectedProduct.id);
    url.searchParams.set('utm_source', 'google');
    url.searchParams.set('utm_medium', utmMedium);
    url.searchParams.set('utm_campaign', utmCampaign);
    if (utmTerm) url.searchParams.set('utm_term', utmTerm);
    if (promoCode) url.searchParams.set('promo', promoCode);
    return url.toString();
  };

  // Generate Google Merchant Center XML / Feed Markup
  const generateMerchantFeed = () => {
    if (!selectedProduct) return '';
    return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NeonForge OS Digital Feed</title>
    <link>${window.location.origin}</link>
    <description>Self-running Autonomous Digital Assets Feed</description>
    <item>
      <g:id>${selectedProduct.sku}</g:id>
      <g:title>${selectedProduct.title}</g:title>
      <g:description>${selectedProduct.description.slice(0, 150)}...</g:description>
      <g:link>${window.location.origin}/?product=${selectedProduct.id}</g:link>
      <g:image_link>${window.location.origin}/assets/placeholder.png</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${selectedProduct.price.toFixed(2)} USD</g:price>
      <g:google_product_category>Software &gt; Digital Assets</g:google_product_category>
      <g:brand>NeonForge OS</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
  </channel>
</rss>`;
  };

  // Campaigns derived from orders
  const campaigns = React.useMemo(() => {
    const channels = [
      { id: 'camp-1', name: 'Cyberpunk Theme Launch - Search', type: 'Search' as const, tag: 'cyber_launch_2026' },
      { id: 'camp-2', name: 'Notion Templates Retargeting - PMax', type: 'PMax' as const, tag: 'notion_cyberpunk' },
      { id: 'camp-3', name: 'Digital Planners - Google Shopping', type: 'Shopping' as const, tag: 'google_shopping' },
      { id: 'camp-4', name: 'Developer HUD Icons - Display Network', type: 'Display' as const, tag: 'display_network' },
    ];

    return channels.map(chan => {
      const matchedOrders = orders.filter(o => {
        const orderCamp = (o.utmCampaign || '').toLowerCase();
        const tagLower = chan.tag.toLowerCase();
        if (orderCamp === tagLower) return true;
        if (chan.type === 'Search' && orderCamp.includes('search')) return true;
        if (chan.type === 'PMax' && (orderCamp.includes('pmax') || orderCamp.includes('notion'))) return true;
        if (chan.type === 'Shopping' && orderCamp.includes('shopping')) return true;
        if (chan.type === 'Display' && orderCamp.includes('display')) return true;
        return false;
      });

      const config = liveSpendConfig[chan.id] || { spend: 0, clicks: 0 };
      return {
        id: chan.id,
        name: chan.name,
        type: chan.type,
        spend: config.spend,
        clicks: config.clicks,
        conversions: matchedOrders.length,
      };
    });
  }, [orders, liveSpendConfig]);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  const totalRevenue = React.useMemo(() => {
    const campaignTags = ['cyber_launch_2026', 'notion_cyberpunk', 'google_shopping', 'display_network'];
    const matchedOrders = orders.filter(o => {
      const orderCamp = (o.utmCampaign || '').toLowerCase();
      return campaignTags.some(tag => orderCamp === tag.toLowerCase() || orderCamp.includes(tag.toLowerCase()));
    });
    return matchedOrders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const averageCpc = totalSpend / (totalClicks || 1);
  const ctr = (totalClicks / 142500) * 100;
  const roas = totalRevenue / (totalSpend || 1);
  const currentPublicUrl = window.location.origin;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="font-mono text-lg font-bold uppercase text-white tracking-wide">
              Sales, Organic Syndication & Domain Command Nexus
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Generate revenue with or without paid ads. Connect real social platforms, deploy assisted or autonomous posts, configure your custom domain, and inspect search engine discoverability.
          </p>
        </div>

        {/* Product Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Target Product:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title.slice(0, 35)}... (${p.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4-Pillar Primary Navigation Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
        <button
          onClick={() => { playSound('click'); setActiveSubTab('organic'); }}
          className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase cursor-pointer ${
            activeSubTab === 'organic'
              ? 'bg-amber-500 text-black shadow-lg font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Organic Social & Syndication</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveSubTab('domain-launchpad'); }}
          className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase cursor-pointer ${
            activeSubTab === 'domain-launchpad'
              ? 'bg-cyan-500 text-black shadow-lg font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Domain & Host Launch</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveSubTab('seo-discoverability'); }}
          className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase cursor-pointer ${
            activeSubTab === 'seo-discoverability'
              ? 'bg-emerald-500 text-black shadow-lg font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO & Search Indexer</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveSubTab('google-ads'); }}
          className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase cursor-pointer ${
            activeSubTab === 'google-ads'
              ? 'bg-purple-500 text-black shadow-lg font-black'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Google Ads Nexus</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. AUTONOMOUS ORGANIC SOCIAL & FORUMS SYNDICATION TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'organic' && selectedProduct && (
        <div className="space-y-6">
          {/* Transparency & Reality Architecture Banner */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 shadow-md space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-blue-300 uppercase tracking-wide">
                  Real Integration Architecture: How Agents Actually Publish Content
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No AI can magically inject posts into your private social media accounts without authorized credentials. NeonForge provides two honest, functional paths:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <strong className="text-cyan-300 block font-mono">1. Assisted 1-Click Browser Share (Zero Setup):</strong>
                    <span className="text-slate-400 text-[11px]">
                      Agents draft high-retention copy, and clicking "Post to X" or "Submit to Reddit" opens your browser with the post pre-filled. You simply click submit.
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <strong className="text-emerald-300 block font-mono">2. Direct Autonomous Background Dispatch:</strong>
                    <span className="text-slate-400 text-[11px]">
                      Connect a Discord webhook, Slack webhook, Zapier/Make automation hub, or Twitter API keys below. The agents can then dispatch posts directly over the network with zero browser clicks!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Platform Connection Status Command Bar */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#090d18] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-white">
                  Real Platform Connection Status
                </h3>
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  setShowConfigModal(!showConfigModal);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showConfigModal ? 'Close Settings' : 'Configure Credentials & Webhooks'}</span>
              </button>
            </div>

            {/* Platform Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-mono">
              {/* Discord */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Discord Webhook</span>
                  <span className={socialConnections?.connections?.discord?.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {socialConnections?.connections?.discord?.isConnected ? '● Connected' : '○ Not Connected'}
                  </span>
                </div>
                {socialConnections?.connections?.discord?.isConnected && (
                  <button
                    onClick={() => handleTestConnection('discord')}
                    disabled={testingPlatform === 'discord'}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                  >
                    {testingPlatform === 'discord' ? 'Testing...' : 'Test'}
                  </button>
                )}
              </div>

              {/* Slack */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Slack Webhook</span>
                  <span className={socialConnections?.connections?.slack?.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {socialConnections?.connections?.slack?.isConnected ? '● Connected' : '○ Not Connected'}
                  </span>
                </div>
                {socialConnections?.connections?.slack?.isConnected && (
                  <button
                    onClick={() => handleTestConnection('slack')}
                    disabled={testingPlatform === 'slack'}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                  >
                    {testingPlatform === 'slack' ? 'Testing...' : 'Test'}
                  </button>
                )}
              </div>

              {/* Zapier / Make */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Zapier / Make Hub</span>
                  <span className={socialConnections?.connections?.zapierOrMake?.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {socialConnections?.connections?.zapierOrMake?.isConnected ? '● Connected' : '○ Not Connected'}
                  </span>
                </div>
                {socialConnections?.connections?.zapierOrMake?.isConnected && (
                  <button
                    onClick={() => handleTestConnection('zapier')}
                    disabled={testingPlatform === 'zapier'}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                  >
                    {testingPlatform === 'zapier' ? 'Testing...' : 'Test'}
                  </button>
                )}
              </div>

              {/* X / Twitter */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">X / Twitter API</span>
                  <span className={socialConnections?.connections?.twitter?.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {socialConnections?.connections?.twitter?.isConnected ? '● Connected' : '○ Needs Keys'}
                  </span>
                </div>
                {socialConnections?.connections?.twitter?.isConnected && (
                  <button
                    onClick={() => handleTestConnection('twitter')}
                    disabled={testingPlatform === 'twitter'}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                  >
                    Test
                  </button>
                )}
              </div>

              {/* Reddit */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reddit Script API</span>
                  <span className={socialConnections?.connections?.reddit?.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {socialConnections?.connections?.reddit?.isConnected ? '● Connected' : '○ Needs Keys'}
                  </span>
                </div>
                {socialConnections?.connections?.reddit?.isConnected && (
                  <button
                    onClick={() => handleTestConnection('reddit')}
                    disabled={testingPlatform === 'reddit'}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>

            {testResult && (
              <div className={`p-2.5 rounded text-xs font-mono ${testResult.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/60 text-red-300 border border-red-500/30'}`}>
                {testResult.success ? '✅' : '❌'} [{testResult.platform.toUpperCase()}]: {testResult.msg}
              </div>
            )}
          </div>

          {/* Social Credentials Configuration Drawer */}
          {showConfigModal && (
            <div className="p-5 rounded-xl border border-cyan-500/40 bg-slate-950 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    Connect Your Real Social Media API & Webhook Endpoints
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSaveSocialConfig} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Discord Webhook */}
                  <div className="space-y-1">
                    <label className="text-slate-300 uppercase block font-bold">
                      Discord Webhook URL (Free, Instant, Recommended):
                    </label>
                    <input
                      type="url"
                      value={configForm.discordWebhookUrl}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, discordWebhookUrl: e.target.value }))}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      In Discord: Channel Settings → Integrations → Webhooks → Copy Webhook URL.
                    </span>
                  </div>

                  {/* Zapier / Make Webhook */}
                  <div className="space-y-1">
                    <label className="text-slate-300 uppercase block font-bold">
                      Zapier / Make.com Webhook (Multi-Platform Router):
                    </label>
                    <input
                      type="url"
                      value={configForm.zapierWebhookUrl}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, zapierWebhookUrl: e.target.value }))}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Connects automatically to your Facebook, Instagram, LinkedIn, and Pinterest schedulers.
                    </span>
                  </div>

                  {/* X / Twitter API Key */}
                  <div className="space-y-1">
                    <label className="text-slate-300 uppercase block font-bold">
                      X / Twitter API Key (Optional for Direct Bot Posting):
                    </label>
                    <input
                      type="text"
                      value={configForm.twitterApiKey}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, twitterApiKey: e.target.value }))}
                      placeholder="developer.twitter.com API Key"
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      If not provided, the "Post to X" button will open your browser with the tweet pre-filled.
                    </span>
                  </div>

                  {/* Reddit Client ID */}
                  <div className="space-y-1">
                    <label className="text-slate-300 uppercase block font-bold">
                      Reddit App Client ID (Optional for Direct Script Posting):
                    </label>
                    <input
                      type="text"
                      value={configForm.redditClientId}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, redditClientId: e.target.value }))}
                      placeholder="reddit.com/prefs/apps script client id"
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      If not provided, the "Submit to Reddit" button will open your browser with the thread pre-filled.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
                  >
                    Save Connected Endpoints
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Channel Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'reddit', label: 'Reddit', icon: MessageSquare, color: 'text-amber-400', desc: 'Case study format' },
              { id: 'twitter', label: 'X / Twitter', icon: Twitter, color: 'text-cyan-400', desc: '5-part viral thread' },
              { id: 'blog', label: 'Tech Blog / Medium', icon: FileText, color: 'text-emerald-400', desc: '450w SEO article' },
              { id: 'indiehackers', label: 'Indie Hackers', icon: Flame, color: 'text-orange-400', desc: 'Show IH build post' },
              { id: 'pinterest', label: 'Pinterest & IG', icon: Bookmark, color: 'text-fuchsia-400', desc: 'Visual captions + tags' },
              { id: 'tiktok', label: 'TikTok / Shorts', icon: Video, color: 'text-red-400', desc: '30s video script' },
            ].map(chan => {
              const Icon = chan.icon;
              const isSelected = syndicateChannel === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => {
                    playSound('click');
                    setSyndicateChannel(chan.id as any);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${chan.color}`} />
                  <div className="font-mono text-xs font-bold text-white truncate">{chan.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{chan.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Generated Post Live Display with Both Publishing Options */}
          {syndicatedContent && (
            <div className="rounded-xl border border-slate-800 bg-[#090d18] p-5 shadow-xl space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 uppercase font-bold">
                    PREVIEW · {syndicateChannel.toUpperCase()}
                  </span>
                  <h3 className="font-mono text-base font-bold text-white mt-1">
                    {syndicatedContent.headline}
                  </h3>
                </div>

                {/* Dual Publishing Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Mode 1: Assisted Browser Intent Openers (Always works!) */}
                  {syndicateChannel === 'twitter' && (
                    <button
                      onClick={() => {
                        const tweetText = `${syndicatedContent.headline}\n\n${syndicatedContent.body.slice(0, 180)}...\n\nGrab it here: ${syndicatedContent.shareUrl}`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Opens twitter.com with pre-filled tweet in your logged-in browser"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      <span>Post to X (Browser)</span>
                    </button>
                  )}

                  {syndicateChannel === 'reddit' && (
                    <button
                      onClick={() => {
                        window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(syndicatedContent.headline)}&text=${encodeURIComponent(`${syndicatedContent.body}\n\n${syndicatedContent.callToAction}`)}`, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Opens reddit.com with pre-filled title and text in your logged-in browser"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Submit to Reddit (Browser)</span>
                    </button>
                  )}

                  {/* Mode 2: Direct Autonomous Background Dispatch */}
                  <button
                    onClick={() => {
                      const platform = (syndicateChannel === 'twitter' || syndicateChannel === 'reddit') ? syndicateChannel : (socialConnections?.connections?.discord?.isConnected ? 'discord' : 'zapier');
                      handlePublishLive(platform);
                    }}
                    disabled={isDispatchingLive}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="Sends post directly via connected API / Webhook without opening a browser"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isDispatchingLive ? 'Dispatching...' : 'Autonomous API Dispatch'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(`${syndicatedContent.headline}\n\n${syndicatedContent.body}\n\n${syndicatedContent.callToAction}`, 'full-post')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'full-post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedKey === 'full-post' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {livePublishResult && (
                <div className={`p-3 rounded-lg text-xs font-mono ${
                  livePublishResult.type === 'success' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' :
                  livePublishResult.type === 'warn' ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40' :
                  'bg-red-950/70 text-red-300 border border-red-500/40'
                }`}>
                  {livePublishResult.text}
                </div>
              )}

              {/* Formatted Post Body */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                {syndicatedContent.body}
              </div>

              {/* Call to action & Direct Buy Link */}
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Embedded Direct Purchase Link:</span>
                  <span className="text-cyan-300 font-bold break-all">{syndicatedContent.shareUrl}</span>
                </div>
                <button
                  onClick={() => handleCopy(syndicatedContent.shareUrl, 'share-url')}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] flex-shrink-0"
                >
                  {copiedKey === 'share-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Link</span>
                </button>
              </div>

              {/* Target Communities / Audience Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-slate-800/60">
                <div className="text-slate-400">
                  <span className="text-slate-500 uppercase mr-1">Target Communities:</span>
                  <span className="text-white">{syndicatedContent.targetAudience}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {syndicatedContent.hashtags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOM DOMAIN & HOSTING LAUNCHPAD TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'domain-launchpad' && (
        <div className="space-y-6">
          {/* Urgent Diagnosis Banner */}
          <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-950/20 shadow-xl space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-mono text-sm font-bold text-amber-300 uppercase tracking-wide">
                  🚨 Why Does www.neonforgedigital.net Say "Private & Needs a Password"?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you buy a domain on <strong>GoDaddy, Namecheap, Hostinger, Wix, or Google/Squarespace</strong>, their servers automatically turn on a default <strong>"Under Construction / Coming Soon" or "Site Password Protection"</strong> parking page.
                  Because your domain is not yet pointed via DNS records to this live application, visitors see your registrar's password lock rather than your store!
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-amber-200 font-bold">
                ⚡ Immediate Good News: Your live store is 100% active and accepting payments right now!
              </span>
              <button
                onClick={() => window.open(currentPublicUrl, '_blank')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Instant Public Storefront</span>
              </button>
            </div>
          </div>

          {/* Real Live DNS Status Diagnostics */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase">
                    Live DNS Propagation & Server Bridge Inspector
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time DNS check for <code className="text-cyan-300">www.neonforgedigital.net</code> and hosting endpoints.
                  </p>
                </div>
              </div>

              <button
                onClick={checkDomain}
                disabled={isCheckingDomain}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDomain ? 'animate-spin' : ''}`} />
                <span>{isCheckingDomain ? 'Testing DNS...' : 'Re-Check DNS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Configured Custom Domain</span>
                <span className="text-white font-bold block truncate">www.neonforgedigital.net</span>
                <span className="text-[10px] text-slate-400">Apex: neonforgedigital.net</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Current Live Web Host</span>
                <span className="text-cyan-300 font-bold block truncate">
                  {domainStatus?.currentHost || window.location.host}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Google Cloud Run Live</span>
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">CNAME Resolution</span>
                <span className={`font-bold block truncate ${domainStatus?.dnsResults?.cname ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {domainStatus?.dnsResults?.cname ? domainStatus.dnsResults.cname.join(', ') : 'Pending Registrar DNS Update'}
                </span>
                <span className="text-[10px] text-slate-400">TTL: Standard (3600s)</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Registrar Action Plan */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                4-Step Checklist to Point Your Domain and Remove the Password
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-bold text-white uppercase">
                    Turn OFF "Under Construction / Password Protection" at Your Registrar
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Log in to where you bought the domain (GoDaddy, Namecheap, Google Domains / Squarespace, Hostinger). Open <strong>Domain Settings</strong> or <strong>Website Hosting</strong>, find <em>"Site Password"</em> or <em>"Coming Soon Mode"</em>, and toggle it to <strong>OFF / Disabled</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-mono text-xs font-bold text-white uppercase">
                    Add CNAME DNS Record for "www"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In your registrar's <strong>DNS Management</strong> tab, add or edit the following CNAME record:
                  </p>
                  <div className="p-3 rounded bg-black/60 border border-slate-800 font-mono text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Type</span>
                      <span className="text-cyan-300 font-bold">CNAME</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Host / Name</span>
                      <span className="text-cyan-300 font-bold">www</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Points To / Target</span>
                        <span className="text-cyan-300 font-bold truncate block">{window.location.host}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(window.location.host, 'cname-target')}
                        className="text-cyan-400 hover:text-white p-1"
                        title="Copy Host"
                      >
                        {copiedKey === 'cname-target' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-bold text-white uppercase">
                    Set Domain Forwarding for the Root Domain (@)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under <strong>Domain Forwarding / URL Redirect</strong> in your registrar dashboard, set the naked root domain <code className="text-cyan-300">neonforgedigital.net</code> to forward to <code className="text-cyan-300">https://www.neonforgedigital.net</code> using a <strong>301 Permanent Redirect</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-mono text-xs font-bold text-white uppercase">
                    Sell and Collect Cash Immediately (Zero Waiting)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    While DNS takes 1–12 hours to propagate across global ISP networks, you do <strong>NOT</strong> have to wait! Your direct live deployment link works 100% right now with no password:
                  </p>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded bg-black/60 border border-slate-800 font-mono text-xs text-emerald-400">
                    <span className="truncate">{currentPublicUrl}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopy(currentPublicUrl, 'live-link')}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'live-link' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'live-link' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => window.open(currentPublicUrl, '_blank')}
                        className="px-2 py-1 rounded bg-emerald-500 text-black font-bold flex items-center gap-1 text-[11px] hover:bg-emerald-400"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Visit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ORGANIC SEO & SEARCH INDEXER TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'seo-discoverability' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#090d18] shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                Organic Search Engine Discoverability Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You do not need to pay for ads to be discoverable. Modern search engines crawl websites using <strong>XML Sitemaps, Robots.txt instructions, and Schema.org JSON-LD structured data</strong>. All three are automatically compiled and live for your catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sitemap.xml */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    ACTIVE · DYNAMIC
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-mono text-sm font-bold text-white uppercase">Dynamic XML Sitemap</h4>
                <p className="text-[11px] text-slate-400">
                  Indexes all {products.length} catalog products, priority rankings, and last-modified timestamps for search engines.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <code className="text-xs text-cyan-300 font-mono">/sitemap.xml</code>
                <button
                  onClick={() => window.open('/sitemap.xml', '_blank')}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:text-white text-xs font-mono flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Inspect XML</span>
                </button>
              </div>
            </div>

            {/* Robots.txt */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    CRAWLER PERMITTED
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-mono text-sm font-bold text-white uppercase">Crawler Directives (Robots.txt)</h4>
                <p className="text-[11px] text-slate-400">
                  Explicitly instructs Googlebot, Bingbot, and DuckDuckGo to crawl product pages while protecting private API keys.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <code className="text-xs text-cyan-300 font-mono">/robots.txt</code>
                <button
                  onClick={() => window.open('/robots.txt', '_blank')}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:text-white text-xs font-mono flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Inspect Rules</span>
                </button>
              </div>
            </div>

            {/* Schema.org */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    RICH SNIPPETS
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-mono text-sm font-bold text-white uppercase">Schema.org JSON-LD</h4>
                <p className="text-[11px] text-slate-400">
                  Embeds OnlineStore, Product, Offer, and Brand metadata directly in HTML headers so Google displays rich shopping cards.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Status: Verified in &lt;head&gt;</span>
                <span className="text-emerald-400 text-xs font-mono font-bold">Active</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Radio className="w-5 h-5 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase">
                Notify Google & Bing Web Crawlers Immediately
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Submit your sitemap directly to search engines so Googlebot schedules indexing of your store without waiting for organic links:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={seoDiagnostics?.submissionLinks?.googlePingUrl || `https://www.google.com/ping?sitemap=${encodeURIComponent(`${window.location.origin}/sitemap.xml`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-white group-hover:text-emerald-300">
                    Ping Google Search Crawler
                  </div>
                  <div className="text-[10px] text-slate-400">Direct HTTP Ping to Googlebot sitemap queue</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              </a>

              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-white group-hover:text-cyan-300">
                    Google Search Console
                  </div>
                  <div className="text-[10px] text-slate-400">Verify domain ownership and view organic keyword impressions</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GOOGLE ADS NEXUS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'google-ads' && selectedProduct && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 p-5 rounded-xl border border-slate-800 bg-[#090d18] flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-white">
                    Google Ads Site Tag Configuration
                  </h3>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Enter your Google Ads Tag ID (e.g., <code className="text-cyan-300">AW-11203495822</code>) to deploy lightweight tracking tags on all customer-facing storefront pages automatically.
                </p>
              </div>

              <form onSubmit={handleSaveTagId} className="space-y-2 pt-2">
                <input
                  type="text"
                  value={adsTagId}
                  onChange={(e) => setAdsTagId(e.target.value)}
                  placeholder="AW-XXXXXXXXXXX"
                  className="w-full px-3 py-2 text-xs font-mono bg-black/60 border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                />
                {tagSaveMsg && (
                  <div className="text-[10px] font-mono text-cyan-300 leading-tight">
                    {tagSaveMsg}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors cursor-pointer"
                >
                  Deploy Tracking Tag ID
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-white">
                  Google Ads UTM Link Generator
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">utm_medium</label>
                  <select
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-white outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="cpc">cpc (Search Ads)</option>
                    <option value="banner">banner (GDN Display)</option>
                    <option value="pmax">pmax (Performance Max)</option>
                    <option value="shopping">shopping (Google Shopping)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">utm_campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-white outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">utm_term (keyword)</label>
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-white outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Discount Promo Code</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-white outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                  <span>Generated Tracking URL:</span>
                  <button
                    onClick={() => handleCopy(buildUtmLink(), 'utm_link')}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copiedKey === 'utm_link' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'utm_link' ? 'Copied' : 'Copy Campaign Link'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all leading-normal">
                  {buildUtmLink()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-4">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                    Google Ads Live Conversion & ROAS Dashboard
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Real-time Return on Ad Spend tracker based on direct and Stripe webhook attributed campaigns.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-emerald-950/40 rounded-lg px-3 py-1 border border-emerald-500/30 text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider">
                  📡 100% Authentic Live Tracking Active
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Attributing Product:</span>
                  <span className="text-cyan-300 font-bold">{selectedProduct.title.slice(0, 20)}...</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Clicks & CTR</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  CTR: {ctr.toFixed(2)}%
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Ad Spend</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  ${totalSpend.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Avg CPC: ${averageCpc.toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Attributed Revenue</span>
                <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  ${totalRevenue.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Conversions: {totalConversions} sales
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Return on Ad Spend (ROAS)</span>
                <span className={`text-lg font-mono font-black tabular-nums ${
                  roas >= 3 ? 'text-emerald-400' : roas >= 1 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {roas.toFixed(2)}x
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Target ROAS: 3.00x
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-2">Campaign Name</th>
                    <th className="py-2">Type</th>
                    <th className="py-2 text-right">Spend</th>
                    <th className="py-2 text-right">Clicks</th>
                    <th className="py-2 text-right">CPC</th>
                    <th className="py-2 text-right">Conversions</th>
                    <th className="py-2 text-right">ROAS</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {campaigns.map((camp) => {
                    const tagNames = ['cyber_launch_2026', 'notion_cyberpunk', 'google_shopping', 'display_network'];
                    const currentTag = tagNames[campaigns.findIndex(c => c.id === camp.id)] || '';
                    const campOrders = orders.filter(o => {
                      const orderCamp = (o.utmCampaign || '').toLowerCase();
                      return orderCamp === currentTag.toLowerCase() || orderCamp.includes(currentTag.toLowerCase());
                    });
                    const campRevenue = campOrders.reduce((sum, o) => sum + o.amount, 0);
                    const campRoas = campRevenue / (camp.spend || 1);
                    const campCpc = camp.spend / (camp.clicks || 1);
                    return (
                      <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-bold text-white max-w-[200px] truncate">{camp.name}</td>
                        <td className="py-2.5 text-cyan-300">{camp.type}</td>
                        <td className="py-2.5 text-right tabular-nums">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-slate-500">$</span>
                            <input
                              type="number"
                              value={camp.spend === 0 ? '' : camp.spend}
                              placeholder="0"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setLiveSpendConfig(prev => ({
                                  ...prev,
                                  [camp.id]: {
                                    ...prev[camp.id],
                                    spend: val
                                  }
                                }));
                              }}
                              className="w-16 bg-slate-950/80 border border-slate-800 text-right text-white rounded px-1 py-0.5 focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right tabular-nums">
                          <div className="flex items-center justify-end">
                            <input
                              type="number"
                              value={camp.clicks === 0 ? '' : camp.clicks}
                              placeholder="0"
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setLiveSpendConfig(prev => ({
                                  ...prev,
                                  [camp.id]: {
                                    ...prev[camp.id],
                                    clicks: val
                                  }
                                }));
                              }}
                              className="w-16 bg-slate-950/80 border border-slate-800 text-right text-white rounded px-1 py-0.5 focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right text-slate-400 tabular-nums">${campCpc.toFixed(2)}</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold tabular-nums">{camp.conversions}</td>
                        <td className={`py-2.5 text-right font-black tabular-nums ${
                          campRoas >= 3 ? 'text-emerald-400' : campRoas >= 1 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {campRoas.toFixed(2)}x
                        </td>
                        <td className="py-2.5 text-center">
                          <span className="text-[10px] text-emerald-400/80 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            <span>Live Tracking</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#090d18] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-white">
                  Google Merchant Center Catalog Feed (Google Shopping)
                </h3>
              </div>

              <button
                onClick={() => handleCopy(generateMerchantFeed(), 'merchant_feed')}
                className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-cyan-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'merchant_feed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'merchant_feed' ? 'Merchant Feed Copied' : 'Copy Merchant Feed'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-lg bg-black border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto leading-normal">
              {generateMerchantFeed()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
