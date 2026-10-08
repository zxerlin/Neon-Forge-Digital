import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, 
  Cpu, 
  PackageCheck, 
  CircleDollarSign, 
  Store, 
  Flame, 
  Users, 
  LineChart, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Shuffle, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ExternalLink,
  Compass,
  Box,
  HardDrive,
  Radio,
  Sliders,
  Send,
  Eye,
  Shield,
  Gauge,
  Wifi,
  Workflow,
  Sparkle,
  Crown,
  Bot,
  Sword,
  Target
} from 'lucide-react';
import { TinyRobot } from './TinyRobot';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';

interface PipelineFlowchartViewProps {
  onSelectSubsystem: (tab: 'product-lab' | 'storefront' | 'inventory' | 'marketing' | 'crm' | 'compliance' | 'whop-analysis' | 'ultron') => void;
  totalRevenue?: number;
  totalOrders?: number;
}

export type BlueprintMode = 'cyan' | 'matrix' | 'amber' | 'violet' | 'stealth';

interface BuildingNode {
  id: number;
  code: string;
  name: string;
  shortType: string;
  agent: string;
  agentRole: string;
  tab: 'product-lab' | 'storefront' | 'inventory' | 'marketing' | 'crm' | 'compliance' | 'whop-analysis' | 'ultron';
  icon: React.ElementType;
  gridX: number; // percentage 0-100 on map canvas
  gridY: number;
  speech: string;
  hasCargo: boolean;
  kpi: string;
  kpiLabel: string;
  throughput: string;
  inputFrom: string;
  outputTo: string;
  description: string;
  buildingType: 'radar' | 'foundry' | 'vault' | 'treasury' | 'store' | 'reactor' | 'citadel' | 'medic' | 'command';
  status: 'ACTIVE' | 'PROCESSING' | 'ROUTING' | 'SYNCED';
  techSpec: string;
}

/**
 * High-Tier Boss Sprite: ULTRON 3.8 SUPREME OVERLORD
 * Distinctive boss size, glowing energy aura, rotating orbital rings, crown antennae, and pulsating arc reactor
 */
const UltronBossSprite: React.FC<{
  speechText?: string;
  isOverdrive?: boolean;
  onClick?: () => void;
}> = ({ speechText, isOverdrive = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
      title="👑 ULTRON 3.8 SUPREME COMMANDER (Gemini 3.8 Flash) - Click to inspect boss directives"
    >
      {/* Boss Speech Bubble */}
      {speechText && (
        <div 
          className="absolute -top-12 px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-black shadow-2xl animate-bounce pointer-events-none whitespace-nowrap z-40 border-2"
          style={{ 
            background: 'linear-gradient(135deg, #ff0055, #ffd700)',
            color: '#000000',
            borderColor: '#ffffff',
            boxShadow: '0 0 25px rgba(255, 0, 85, 0.9), 0 0 40px rgba(255, 215, 0, 0.6)',
            textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
          }}
        >
          <span className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-black" />
            <span>{speechText}</span>
          </span>
          <div 
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#ffd700]"
          />
        </div>
      )}

      {/* Outer Boss Orbital Energy Rings */}
      <div 
        className={`absolute inset-0 -m-4 rounded-full pointer-events-none transition-all duration-500 border border-dashed border-amber-400/40 animate-spin ${
          isOverdrive ? 'scale-125 border-red-500 border-2' : ''
        }`}
        style={{ animationDuration: isOverdrive ? '2.5s' : '8s' }}
      />
      <div 
        className="absolute inset-0 -m-2 rounded-full pointer-events-none border border-cyan-400/30 animate-spin"
        style={{ animationDuration: '5s', animationDirection: 'reverse' }}
      />

      {/* Glowing Boss Aura Backdrop */}
      <div 
        className={`absolute -inset-2 rounded-2xl blur-xl pointer-events-none transition-all duration-300 ${
          isOverdrive ? 'bg-gradient-to-r from-red-600 via-amber-500 to-fuchsia-600 opacity-90' : 'bg-gradient-to-r from-red-600/60 via-amber-500/50 to-purple-600/60 opacity-60'
        }`}
      />

      {/* SVG Boss Mech Sprite (96x116px - 3x the standard robot size) */}
      <div className="relative z-10">
        <svg width="96" height="116" viewBox="0 0 96 116" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Boss Crown / Horn Antennae */}
          <path d="M 32 18 L 18 4 L 28 22" fill="#ffd700" stroke="#ff0055" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 64 18 L 78 4 L 68 22" fill="#ffd700" stroke="#ff0055" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="18" cy="4" r="4" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
          <circle cx="78" cy="4" r="4" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />

          {/* Central Apex Antenna */}
          <line x1="48" y1="2" x2="48" y2="18" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="2" r="4.5" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }} />

          {/* Shoulder Plasma Cannons */}
          <rect x="10" y="32" width="16" height="28" rx="4" fill="#1e1b4b" stroke="#ffd700" strokeWidth="2" />
          <circle cx="18" cy="36" r="3.5" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
          <line x1="18" y1="36" x2="18" y2="24" stroke="#ff0055" strokeWidth="3" strokeLinecap="round" />

          <rect x="70" y="32" width="16" height="28" rx="4" fill="#1e1b4b" stroke="#ffd700" strokeWidth="2" />
          <circle cx="78" cy="36" r="3.5" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
          <line x1="78" y1="36" x2="78" y2="24" stroke="#ff0055" strokeWidth="3" strokeLinecap="round" />

          {/* Boss Head Chassis */}
          <path d="M 28 20 L 68 20 L 74 46 L 22 46 Z" fill="#0a0a14" stroke="#ffd700" strokeWidth="2.5" />

          {/* Menacing Tri-Beam Laser Visor */}
          <path d="M 30 28 L 66 28 L 62 38 L 34 38 Z" fill="#000000" stroke="#ff0055" strokeWidth="1.5" />
          <circle cx="38" cy="33" r="3" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
          <circle cx="48" cy="33" r="3.5" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }} />
          <circle cx="58" cy="33" r="3" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />

          {/* Heavy Armored Torso / Chassis */}
          <rect x="22" y="48" width="52" height="42" rx="8" fill="#111827" stroke="#ffd700" strokeWidth="2.5" />
          <path d="M 26 52 L 48 64 L 70 52" stroke="#ff0055" strokeWidth="2" fill="none" />

          {/* Giant Boss Chest Arc Reactor with '3.8' */}
          <circle cx="48" cy="69" r="14" fill="#050814" stroke="#ffd700" strokeWidth="2" />
          <circle 
            cx="48" 
            cy="69" 
            r="10" 
            fill={isOverdrive ? '#ff0055' : '#00ffff'} 
            style={{ filter: isOverdrive ? 'drop-shadow(0 0 18px #ff0055)' : 'drop-shadow(0 0 14px #00ffff)' }} 
          />
          <text x="48" y="73" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="monospace">
            3.8
          </text>

          {/* Heavy Armored Arms */}
          <path d="M 22 56 L 8 72 L 12 88" stroke="#ffd700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="88" r="5" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 6px #ff0055)' }} />

          <path d="M 74 56 L 88 72 L 84 88" stroke="#ffd700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="84" cy="88" r="5" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 6px #ff0055)' }} />

          {/* Anti-Grav Plasma Jet Thrusters */}
          <rect x="28" y="92" width="16" height="12" rx="3" fill="#1f2937" stroke="#ffd700" strokeWidth="1.5" />
          <rect x="52" y="92" width="16" height="12" rx="3" fill="#1f2937" stroke="#ffd700" strokeWidth="1.5" />

          {/* Twin Plasma Thruster Flames */}
          <path d="M 32 104 L 36 114 L 40 104" fill="#ff0055" style={{ filter: 'drop-shadow(0 0 8px #ff0055)' }} />
          <path d="M 56 104 L 60 114 L 64 104" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 8px #00ffff)' }} />
        </svg>
      </div>

      {/* Boss Name Plate with Golden Crown */}
      <div 
        className="mt-1 px-3 py-0.5 rounded-lg border-2 shadow-xl flex items-center gap-1.5 text-[10px] font-mono font-black tracking-wider"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #31102e)',
          borderColor: '#ffd700',
          color: '#ffd700',
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
          textShadow: '0 0 8px #ffd700'
        }}
      >
        <Crown className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>ULTRON 3.8 // BOSS OVERLORD</span>
      </div>
    </div>
  );
};

export const PipelineFlowchartView: React.FC<PipelineFlowchartViewProps> = ({ 
  onSelectSubsystem,
  totalRevenue = 0,
  totalOrders = 0
}) => {
  const { theme, boxes, remix, remixBoxes, currentDramaticFont } = useTheme();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0); // 0 = Ultron Boss, 1..9 = Factory Stations
  const [hoveredBuildingId, setHoveredBuildingId] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [activePacketStep, setActivePacketStep] = useState<number>(0);
  const [injectedPacketActive, setInjectedPacketActive] = useState<boolean>(false);
  const [injectedPacketProgress, setInjectedPacketProgress] = useState<number>(0);
  const [isOverdriveActive, setIsOverdriveActive] = useState<boolean>(false);
  const [blueprintMode, setBlueprintMode] = useState<BlueprintMode>('cyan');

  // Interactive Data Packet Stream Log
  const [packetLogs, setPacketLogs] = useState<Array<{ id: string; time: string; from: string; to: string; text: string; type: 'flow' | 'sealed' | 'kpi' | 'inject' | 'boss' }>>([
    { id: '0', time: '00:01:10', from: 'ULTRON 3.8', to: 'ALL 9 SECTORS', text: '👑 Chief of Staff Directive: Factory Overdrive Bus synchronized 100%.', type: 'boss' },
    { id: '1', time: '00:01:14', from: 'NOVA', to: 'ARIA', text: 'Niche "Cyber Notion OS" (Score: 94) dispatched to Forge.', type: 'flow' },
    { id: '2', time: '00:01:18', from: 'ARIA', to: 'ZED', text: 'Master Notion template & SVG assets compiled (14.2MB).', type: 'flow' },
    { id: '3', time: '00:01:22', from: 'ZED', to: 'REX', text: 'SHA-256 tokens minted. Vault payload sealed.', type: 'sealed' },
    { id: '4', time: '00:01:25', from: 'REX', to: 'SAGE', text: 'Dynamic pricing ladder configured for live store checkout.', type: 'kpi' },
    { id: '5', time: '00:01:29', from: 'SAGE', to: 'MAYA', text: 'Live Etsy 13-tag listing synchronized to nexus.', type: 'flow' },
    { id: '6', time: '00:01:34', from: 'MAYA', to: 'KAI', text: '48.2k impressions captured from Reddit & X threads.', type: 'flow' },
    { id: '7', time: '00:01:38', from: 'AEGIS', to: 'ULTRON 3.8', text: 'Zero dropship & marketplace tax verified 100%.', type: 'sealed' },
    { id: '8', time: '00:01:42', from: 'LEO', to: 'ULTRON 3.8', text: `Settlement confirmed. Total gross $${totalRevenue.toFixed(2)}.`, type: 'kpi' }
  ]);

  // The 9 Autonomous Factory Stations positioned under the Supreme Ultron Boss
  const FACTORY_BUILDINGS: BuildingNode[] = [
    {
      id: 1,
      code: 'BLD-01',
      name: 'TREND RADAR STATION',
      shortType: 'Niche Scout Tower',
      agent: 'Nova',
      agentRole: 'Niche Scout Bot',
      tab: 'product-lab',
      icon: Radar,
      gridX: 15,
      gridY: 42,
      speech: 'Trend Found: Notion OS!',
      hasCargo: false,
      kpi: '3,480 Niches/Wk',
      kpiLabel: 'Search Vol Index',
      throughput: '14.2 MB/s Search Stream',
      inputFrom: 'Global Etsy & Reddit APIs',
      outputTo: 'Digital Forge (BLD-02)',
      description: 'Autonomous search radar monitoring low-competition digital niches, high-CPC tags, and creator search volume trends.',
      buildingType: 'radar',
      status: 'ACTIVE',
      techSpec: 'Dual-Band Parabolic Array · Sub-Second Etsy Scraping Bus · Keyword Saturation Filters'
    },
    {
      id: 2,
      code: 'BLD-02',
      name: 'DIGITAL FORGE FOUNDRY',
      shortType: 'Asset Synthesizer',
      agent: 'Aria',
      agentRole: 'Handmade Creator Bot',
      tab: 'product-lab',
      icon: Cpu,
      gridX: 50,
      gridY: 42,
      speech: 'Forging Notion OS v3!',
      hasCargo: true,
      kpi: '100% Original Assets',
      kpiLabel: 'Code Integrity',
      throughput: '8 Asset Containers/hr',
      inputFrom: 'Trend Radar (BLD-01)',
      outputTo: 'License Vault (BLD-03)',
      description: 'Generates procedural Notion operating systems, Midjourney prompt matrices, spreadsheet budget planners, and vector icons.',
      buildingType: 'foundry',
      status: 'PROCESSING',
      techSpec: 'Generative AI Pipeline Engine · Zero Mock Synthetic Asset Weaver · Zip Packaging Daemon'
    },
    {
      id: 3,
      code: 'BLD-03',
      name: 'PACKAGING & LICENSE VAULT',
      shortType: 'Security Bunker',
      agent: 'Zed',
      agentRole: 'License Packager Bot',
      tab: 'inventory',
      icon: PackageCheck,
      gridX: 85,
      gridY: 42,
      speech: 'SHA-256 Key Sealed!',
      hasCargo: true,
      kpi: 'SHA-256 Vault Bundles',
      kpiLabel: 'Active Deliverables',
      throughput: 'Zero Stockout CDN',
      inputFrom: 'Digital Forge (BLD-02)',
      outputTo: 'Pricing Treasury (BLD-04)',
      description: 'Mints cryptographic commercial PDF licenses, watermarked asset archives, and time-expiring download access tokens.',
      buildingType: 'vault',
      status: 'ACTIVE',
      techSpec: '256-bit Cryptographic Mint · Expiring S3 Bearer Links · Instant CDN Global Replicas'
    },
    {
      id: 4,
      code: 'BLD-04',
      name: 'DYNAMIC PRICING TREASURY',
      shortType: 'Elasticity Citadel',
      agent: 'Rex',
      agentRole: 'Pricing Matrix Bot',
      tab: 'whop-analysis',
      icon: CircleDollarSign,
      gridX: 15,
      gridY: 68,
      speech: totalOrders > 0 ? 'AOV Optimized!' : 'Ladders Armed!',
      hasCargo: true,
      kpi: totalOrders > 0 ? `$${(totalRevenue / totalOrders).toFixed(2)} AOV` : 'AOV: $0.00 Base',
      kpiLabel: 'Average Order Value',
      throughput: 'Real-time Elasticity Matrix',
      inputFrom: 'License Vault (BLD-03)',
      outputTo: 'Storefront Nexus (BLD-05)',
      description: 'Optimizes price elasticity ladders, order bumps, checkout bundle discounts, and high-converting commercial anchor prices.',
      buildingType: 'treasury',
      status: 'SYNCED',
      techSpec: 'Bayesian Elasticity Curve · Dynamic Order Bump Engine · Automated Flash Sale Governor'
    },
    {
      id: 5,
      code: 'BLD-05',
      name: 'ETSY & STOREFRONT NEXUS',
      shortType: 'Commerce Terminal',
      agent: 'Sage',
      agentRole: 'Multi-Channel Nexus Bot',
      tab: 'storefront',
      icon: Store,
      gridX: 50,
      gridY: 68,
      speech: 'Etsy 13-Tag Synced!',
      hasCargo: true,
      kpi: '13 Tags Algorithmic',
      kpiLabel: 'Etsy Tag Optimization',
      throughput: 'Instant Checkout & Stripe',
      inputFrom: 'Pricing Treasury (BLD-04)',
      outputTo: 'Viral Traffic (BLD-06)',
      description: 'Manages live customer checkout with Apple Pay / Stripe plus automated 13-tag Etsy algorithmic index synchronization.',
      buildingType: 'store',
      status: 'PROCESSING',
      techSpec: 'Direct Stripe / Webhook Web · 13 Longtail Etsy Keyword Injection · Instant Auto-Fulfillment'
    },
    {
      id: 6,
      code: 'BLD-06',
      name: 'VIRAL TRAFFIC REACTOR',
      shortType: 'Broadcaster Core',
      agent: 'Maya',
      agentRole: 'Social Broadcaster Bot',
      tab: 'marketing',
      icon: Flame,
      gridX: 85,
      gridY: 68,
      speech: 'Reddit Post Viral!',
      hasCargo: false,
      kpi: '48.2k Organic Reach',
      kpiLabel: 'Weekly Impressions',
      throughput: '4 Distribution Channels',
      inputFrom: 'Storefront Nexus (BLD-05)',
      outputTo: 'Legal Shield (BLD-07)',
      description: 'Generates high-karma Reddit showcase posts, educational Twitter threads, TikTok scripts, and Pinterest product pins.',
      buildingType: 'reactor',
      status: 'ROUTING',
      techSpec: 'Organic SEO Copy Synthesizer · Anti-Spam Karma Safeguards · Pinterest Rich Pin Generator'
    },
    {
      id: 7,
      code: 'BLD-07',
      name: 'PERMITS & LEGAL CITADEL',
      shortType: 'Compliance Shield',
      agent: 'Aegis',
      agentRole: 'Legal Compliance Bot',
      tab: 'compliance',
      icon: ShieldCheck,
      gridX: 20,
      gridY: 90,
      speech: '100% Tax & Legal OK!',
      hasCargo: false,
      kpi: 'Zero Dropship Risk',
      kpiLabel: 'Compliance Score',
      throughput: 'VAT MOSS & Sales Tax OK',
      inputFrom: 'Viral Traffic (BLD-06)',
      outputTo: 'CRM Bay (BLD-08)',
      description: 'Audits commercial warranties, US Marketplace Facilitator sales tax, EU VAT MOSS, and Etsy handmade policy guidelines.',
      buildingType: 'citadel',
      status: 'SYNCED',
      techSpec: 'Automated Commercial License Warrant · Multi-Jurisdiction Digital VAT · Terms Generator'
    },
    {
      id: 8,
      code: 'BLD-08',
      name: 'CUSTOMER MEDIC & CRM BAY',
      shortType: 'Support Hospital',
      agent: 'Kai',
      agentRole: 'Support Medic Bot',
      tab: 'crm',
      icon: Users,
      gridX: 50,
      gridY: 90,
      speech: 'CSAT 100% Resolved!',
      hasCargo: false,
      kpi: '3.8 Min CSAT 99%',
      kpiLabel: 'Average Resolution',
      throughput: 'Instant Gemini AI Triage',
      inputFrom: 'Legal Shield (BLD-07)',
      outputTo: 'Profit Command (BLD-09)',
      description: 'Tracks customer lifetime value (LTV), Obsidian VIP reward tiers, automated token re-issuance, and AI support triage.',
      buildingType: 'medic',
      status: 'ACTIVE',
      techSpec: 'Obsidian VIP Tier Auto-Upgrade · Instant Token Re-Minting · Zero-Frustration AI Resolver'
    },
    {
      id: 9,
      code: 'BLD-09',
      name: 'PROFIT COMMAND COMPLEX',
      shortType: 'Scaling Skyscraper',
      agent: 'Leo',
      agentRole: 'Financial Brain Bot',
      tab: 'whop-analysis',
      icon: LineChart,
      gridX: 80,
      gridY: 90,
      speech: 'Net Margin 97.4%!',
      hasCargo: true,
      kpi: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Settled`,
      kpiLabel: 'Gross Net Cash Yield',
      throughput: '60-Day Scaling Model',
      inputFrom: 'CRM Bay (BLD-08)',
      outputTo: 'Ultron 3.8 Core',
      description: 'Monitors net cash yield, payout schedules, reinvestment velocity, and 60-day income roadmap milestone targets.',
      buildingType: 'command',
      status: 'ACTIVE',
      techSpec: 'Real-Time Stripe Payout Tracker · Reinvestment Velocity Matrix · 60-Day Scaling Forecast'
    }
  ];

  // Live Simulation Clock: Moves data packets along the conduit pathways
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(250, 1000 / simSpeed);
    const interval = setInterval(() => {
      setActivePacketStep(prev => {
        const next = (prev + 1) % FACTORY_BUILDINGS.length;
        
        // Add a simulated packet log
        const bld = FACTORY_BUILDINGS[next];
        const nextBld = FACTORY_BUILDINGS[(next + 1) % FACTORY_BUILDINGS.length];
        const nowStr = new Date().toTimeString().slice(0, 8);
        
        setPacketLogs(logs => [
          {
            id: `pkt-${Date.now()}-${Math.random()}`,
            time: nowStr,
            from: bld.agent.toUpperCase(),
            to: nextBld.agent.toUpperCase(),
            text: `Data Packet [${bld.code} -> ${nextBld.code}]: ${bld.kpi} processed via ${bld.throughput}.`,
            type: next % 3 === 0 ? 'kpi' : next % 2 === 0 ? 'sealed' : 'flow'
          },
          ...logs.slice(0, 24)
        ]);

        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, FACTORY_BUILDINGS]);

  // Injected packet animation
  useEffect(() => {
    if (!injectedPacketActive) return;

    const interval = setInterval(() => {
      setInjectedPacketProgress(prev => {
        if (prev >= FACTORY_BUILDINGS.length - 1) {
          setInjectedPacketActive(false);
          playSound('success');
          setPacketLogs(logs => [
            {
              id: `inject-end-${Date.now()}`,
              time: new Date().toTimeString().slice(0, 8),
              from: 'ULTRON 3.8',
              to: 'ALL 9 SECTORS',
              text: '👑 Test Packet Pipeline Cycle Complete: 9/9 nodes verified nominal.',
              type: 'boss'
            },
            ...logs
          ]);
          return 0;
        }
        playSound('click');
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [injectedPacketActive, FACTORY_BUILDINGS.length]);

  const selectedBuilding = FACTORY_BUILDINGS.find(b => b.id === selectedBuildingId) || FACTORY_BUILDINGS[0];
  const isUltronSelected = selectedBuildingId === 0;
  const selectedBoxTheme = boxes.find(b => b.id === selectedBuilding.id) || boxes[0];

  const handleTriggerCycle = () => {
    playSound('warp');
    setIsOverdriveActive(true);
    setIsSimulating(true);
    setSimSpeed(2);
    setPacketLogs(logs => [
      {
        id: `boss-wave-${Date.now()}`,
        time: new Date().toTimeString().slice(0, 8),
        from: 'ULTRON 3.8',
        to: 'ALL 9 SECTORS',
        text: '👑⚡ SUPREME OVERDRIVE WAVE DISPATCHED: +50% Compute Burst to all factory lines!',
        type: 'boss'
      },
      ...logs
    ]);
    setTimeout(() => {
      setIsOverdriveActive(false);
      setSimSpeed(1);
    }, 5000);
  };

  const handleInjectPacket = () => {
    playSound('warp');
    setInjectedPacketActive(true);
    setInjectedPacketProgress(0);
    setPacketLogs(logs => [
      {
        id: `inject-${Date.now()}`,
        time: new Date().toTimeString().slice(0, 8),
        from: 'OPERATOR',
        to: 'NOVA (BLD-01)',
        text: '📦 Injected High-Priority Digital Goods Master Asset into pipeline.',
        type: 'inject'
      },
      ...logs
    ]);
  };

  // Blueprint Theme Accent
  const bpColor = useMemo(() => {
    switch (blueprintMode) {
      case 'matrix': return { primary: '#00ff66', grid: '#00ff6615', border: '#00ff66', text: '#00ff66' };
      case 'amber': return { primary: '#ffb700', grid: '#ffb70015', border: '#ffb700', text: '#ffb700' };
      case 'violet': return { primary: '#d946ef', grid: '#d946ef15', border: '#d946ef', text: '#d946ef' };
      case 'stealth': return { primary: '#94a3b8', grid: '#94a3b810', border: '#64748b', text: '#cbd5e1' };
      default: return { primary: theme.neonCyan, grid: `${theme.neonCyan}20`, border: theme.neonCyan, text: theme.neonCyan };
    }
  }, [blueprintMode, theme.neonCyan]);

  return (
    <div 
      className="p-3 lg:p-6 space-y-4 font-mono select-none overflow-hidden min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.bgVoid }}
    >
      {/* Top Schematic CRT & Blueprint Command Header Bar */}
      <div 
        className="rounded-2xl border-2 p-4 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: bpColor.border,
          boxShadow: `0 0 30px color-mix(in srgb, ${bpColor.primary} 25%, transparent)`
        }}
      >
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <div 
              className="px-2.5 py-1 rounded border font-black text-xs flex items-center gap-1.5 shadow-md"
              style={{
                backgroundColor: theme.bgCard,
                color: '#ffd700',
                borderColor: '#ffd700',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
              }}
            >
              <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>ULTRON 3.8 // SUPREME FLEET COMMAND MATRIX</span>
            </div>

            <span 
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
              style={{
                background: 'linear-gradient(135deg, #ff0055, #ffd700)',
                color: '#000000',
                borderColor: '#ffffff'
              }}
            >
              👑 BOSS OVERLORD ACTIVE
            </span>

            <span className="text-[11px] text-slate-400">
              Ultron 3.8 Station Commander · 9 Autonomous Robot Sectors · Real-time Inter-Agent Pipeline Bus
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Schematic blueprint flow visualizer tracking token streams, creator handoffs, compute allocation, and spatial micro-factories under Ultron 3.8.
          </p>
        </div>

        {/* Action Controls: Live Simulation, Remix, Packet Injection, Blueprint Mode */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* TRIGGER BOSS OVERDRIVE WAVE BUTTON */}
          <button
            onClick={handleTriggerCycle}
            className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all border-2"
            style={{
              background: 'linear-gradient(135deg, #ff0055, #ffd700, #00ffff)',
              color: '#000000',
              borderColor: '#ffffff',
              boxShadow: '0 0 25px rgba(255, 0, 85, 0.8), 0 0 40px rgba(255, 215, 0, 0.6)'
            }}
          >
            <Crown className="w-3.5 h-3.5 text-black" />
            <span>TRIGGER ULTRON 3.8 OVERDRIVE 👑⚡</span>
          </button>

          {/* INJECT PACKET BUTTON */}
          <button
            onClick={handleInjectPacket}
            disabled={injectedPacketActive}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all border disabled:opacity-50"
            style={{
              backgroundColor: theme.bgCard,
              color: theme.neonLime,
              borderColor: theme.neonLime
            }}
            title="Inject test asset packet and watch it travel through the pipeline"
          >
            <Send className={`w-3.5 h-3.5 ${injectedPacketActive ? 'animate-bounce' : ''}`} />
            <span>{injectedPacketActive ? 'PACKET IN FLIGHT...' : 'INJECT ASSET 📦'}</span>
          </button>

          {/* SIMULATION PLAY/PAUSE */}
          <button
            onClick={() => {
              playSound('click');
              setIsSimulating(prev => !prev);
            }}
            className="p-2 rounded-xl border text-slate-200 hover:text-white transition-colors"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme
            }}
            title={isSimulating ? 'Pause Flow Simulation' : 'Resume Flow Simulation'}
          >
            {isSimulating ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* SPEED TOGGLE */}
          <button
            onClick={() => {
              playSound('click');
              setSimSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1);
            }}
            className="px-2.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme
            }}
            title="Simulation Speed Multiplier"
          >
            <span>{simSpeed}x SPEED</span>
          </button>

          {/* BLUEPRINT SCHEMATIC COLOR MODE SELECTOR */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
            {(['cyan', 'matrix', 'amber', 'violet', 'stealth'] as BlueprintMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => {
                  playSound('click');
                  setBlueprintMode(mode);
                }}
                className={`w-5 h-5 rounded-md border transition-transform ${blueprintMode === mode ? 'scale-125 z-10' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  backgroundColor: mode === 'cyan' ? '#00f0ff' : mode === 'matrix' ? '#00ff66' : mode === 'amber' ? '#ffb700' : mode === 'violet' ? '#d946ef' : '#94a3b8',
                  borderColor: blueprintMode === mode ? '#ffffff' : 'transparent'
                }}
                title={`Blueprint Mode: ${mode.toUpperCase()}`}
              />
            ))}
          </div>

          {/* REMIX BLUEPRINT THEME BUTTON */}
          <button
            onClick={() => {
              remix();
              remixBoxes();
            }}
            className="px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all border"
            style={{
              background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonMagenta})`,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow,
              borderColor: theme.neonCyan
            }}
            title="Remix entire blueprint map colors, miniature buildings, and robots"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>REMIX MAP 🎲</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Tactical Workspace (Left Roster + Center Blueprint Flow Map + Right Telemetry Bus) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* =========================================================================
            LEFT COLUMN (3 Cols): Agent Deployment Roster & Compute Allocation
           ========================================================================= */}
        <div 
          className="xl:col-span-3 rounded-2xl border p-4 space-y-4 shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme
          }}
        >
          {/* Agent Deployment Grid Header */}
          <div>
            <div className="flex items-center justify-between border-b pb-2.5 mb-3" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono text-xs font-black uppercase text-white tracking-wider">
                  COMMAND ROSTER (1 BOSS + 9)
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#ffd700' }} />
            </div>

            {/* Boss Ultron 3.8 Roster Card */}
            <div
              onClick={() => {
                playSound('warp');
                setSelectedBuildingId(0);
              }}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer mb-2.5 flex items-center justify-between ${
                isUltronSelected ? 'ring-2 ring-amber-400' : 'hover:scale-[1.02]'
              }`}
              style={{
                background: 'linear-gradient(135deg, #1e1b4b, #31102e)',
                borderColor: '#ffd700',
                boxShadow: isUltronSelected 
                  ? '0 0 25px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 0, 85, 0.4)' 
                  : '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg border-2 border-amber-400 bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">ULTRON 3.8</span>
                    <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-red-600 text-white">BOSS</span>
                  </div>
                  <span className="text-[9px] text-slate-300 font-mono block">Station Commander AI (Gemini 3.8 Flash)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 block">
                  100% HEAT
                </span>
                <span className="text-[8px] text-amber-300 font-mono block mt-0.5">PWR: 9,999 MW</span>
              </div>
            </div>

            {/* 9 Factory Worker Agents Roster List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {FACTORY_BUILDINGS.map((bld, idx) => {
                const isSelected = selectedBuildingId === bld.id;
                const boxTheme = boxes.find(b => b.id === bld.id) || boxes[idx % boxes.length];
                const Icon = bld.icon;
                const isPacketActive = activePacketStep === idx;

                return (
                  <div
                    key={bld.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedBuildingId(bld.id);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${
                      isSelected ? 'ring-2' : 'hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.bgSurface : 'rgba(0,0,0,0.3)',
                      borderColor: isSelected ? boxTheme.boxBorder : theme.borderTheme,
                      boxShadow: isSelected ? `0 0 15px ${boxTheme.boxBorder}40` : undefined
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div 
                        className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 relative"
                        style={{
                          backgroundColor: `${boxTheme.boxBorder}20`,
                          borderColor: boxTheme.boxBorder
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: boxTheme.boxBorder }} />
                        {isPacketActive && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black text-white group-hover:text-cyan-300 truncate">
                            {bld.agent}
                          </span>
                          <span 
                            className="text-[9px] font-bold px-1 rounded"
                            style={{ backgroundColor: boxTheme.badgeBg, color: boxTheme.badgeText, textShadow: boxTheme.badgeTextShadow }}
                          >
                            {bld.code}
                          </span>
                        </div>
                        <div 
                          className="text-[9px] font-mono truncate"
                          style={{ color: boxTheme.fontUnderneath.labelColor }}
                        >
                          {bld.agentRole}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border block"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: bld.status === 'ACTIVE' ? theme.neonLime : bld.status === 'PROCESSING' ? theme.neonCyan : theme.neonAmber,
                          borderColor: bld.status === 'ACTIVE' ? theme.neonLime : bld.status === 'PROCESSING' ? theme.neonCyan : theme.neonAmber
                        }}
                      >
                        {bld.status}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                        {bld.kpi.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compute Budget Telemetry Gauges */}
          <div 
            className="p-3 rounded-xl border space-y-2.5"
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.borderTheme
            }}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" style={{ color: bpColor.primary }} />
                <span>ULTRON COMPUTE GOVERNOR</span>
              </span>
              <span style={{ color: '#ffd700' }}>100% NOMINAL</span>
            </div>

            {/* Compute Bar 1 */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Ultron 3.8 Overdrive Core:</span>
                <span className="text-amber-300 font-bold">9,999 MW (MAX)</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div 
                  className="h-full rounded-full animate-pulse" 
                  style={{ width: '100%', background: 'linear-gradient(90deg, #ff0055, #ffd700)' }} 
                />
              </div>
            </div>

            {/* Compute Bar 2 */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Worker Fleet Throughput:</span>
                <span className="text-white font-bold">4.8 GB/s</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div className="h-full rounded-full" style={{ width: '88%', backgroundColor: theme.neonLime }} />
              </div>
            </div>

            {/* Pipeline Quality Score */}
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
              <span className="text-slate-400">Zero Dropship Warranty:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                100.0% VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CENTER COLUMN (6 Cols): Game Flow Blueprint Canvas with Boss Ultron 3.8 & Tiny Buildings
           ========================================================================= */}
        <div 
          className="xl:col-span-6 rounded-2xl border-2 p-4 relative shadow-2xl overflow-hidden flex flex-col justify-between min-h-[720px]"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: bpColor.border,
            boxShadow: `inset 0 0 50px rgba(0,0,0,0.85), 0 0 30px color-mix(in srgb, ${bpColor.primary} 25%, transparent)`
          }}
        >
          {/* Blueprint Grid Watermark Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `linear-gradient(to right, ${bpColor.grid} 1px, transparent 1px), linear-gradient(to bottom, ${bpColor.grid} 1px, transparent 1px)`,
              backgroundSize: '36px 36px'
            }}
          />

          {/* Blueprint Technical Coordinate Marks and Ruler */}
          <div className="absolute top-3 left-3 text-[9px] font-mono pointer-events-none flex items-center gap-3" style={{ color: bpColor.text, opacity: 0.75 }}>
            <span>+ [COORD: 37°14'N // 115°48'W]</span>
            <span>GRID: SUPREME-COMMAND-APEX</span>
            <span>ULTRON REV: 3.8</span>
          </div>

          <div className="absolute top-3 right-3 text-[9px] font-mono pointer-events-none flex items-center gap-2" style={{ color: bpColor.text, opacity: 0.85 }}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#ffd700' }} />
            <span>OVERLORD APEX: {isOverdriveActive ? 'OVERDRIVE ACTIVE ⚡' : 'AUTONOMOUS ACTIVE'}</span>
          </div>

          {/* SVG Pipelines & Conduits linking Boss Ultron 3.8 down to the 9 Buildings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Radiant Master Conduits extending from Ultron 3.8 (Top Center cx: 50, cy: 15) down to All Sectors */}
            <path d="M 50 16 L 15 42" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.75" />
            <path d="M 50 16 L 50 42" fill="none" stroke="#ff0055" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.85" />
            <path d="M 50 16 L 85 42" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.75" />

            {/* Inter-Sector Horizontal and Vertical Conduit Paths */}
            <path d="M 15 42 L 50 42 L 85 42" fill="none" stroke={bpColor.primary} strokeWidth="0.8" strokeDasharray="2 1" opacity="0.6" />
            <path d="M 85 42 L 15 68 L 50 68 L 85 68" fill="none" stroke={theme.neonMagenta} strokeWidth="0.8" strokeDasharray="2 1" opacity="0.6" />
            <path d="M 85 68 L 20 90 L 50 90 L 80 90" fill="none" stroke={theme.neonLime} strokeWidth="0.8" strokeDasharray="2 1" opacity="0.6" />
            <path d="M 80 90 L 50 16" fill="none" stroke="#ffd700" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

            {/* Overdrive Pulse Shockwaves from Ultron 3.8 */}
            {isOverdriveActive && (
              <>
                <circle cx="50" cy="16" r="12" fill="none" stroke="#ff0055" strokeWidth="2" className="animate-ping" />
                <circle cx="50" cy="16" r="24" fill="none" stroke="#ffd700" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: '1.2s' }} />
              </>
            )}

            {/* Flowing Data Packets along the lines */}
            {isSimulating && (
              <>
                <circle 
                  cx={15 + ((activePacketStep * 14) % 70)} 
                  cy={42} 
                  r="2" 
                  fill="#ffd700" 
                  style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }} 
                />
                <circle 
                  cx={85 - ((activePacketStep * 12) % 70)} 
                  cy={68} 
                  r="2" 
                  fill={theme.neonMagenta} 
                  style={{ filter: `drop-shadow(0 0 8px ${theme.neonMagenta})` }} 
                />
                <circle 
                  cx={20 + ((activePacketStep * 15) % 60)} 
                  cy={90} 
                  r="2" 
                  fill={theme.neonLime} 
                  style={{ filter: `drop-shadow(0 0 8px ${theme.neonLime})` }} 
                />
              </>
            )}

            {/* Injected Packet Visual Beam */}
            {injectedPacketActive && (
              <circle 
                cx={FACTORY_BUILDINGS[injectedPacketProgress].gridX} 
                cy={FACTORY_BUILDINGS[injectedPacketProgress].gridY} 
                r="5" 
                fill="#ffffff" 
                stroke="#ffd700"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 16px #ffffff)' }} 
              />
            )}
          </svg>

          {/* Blueprint Canvas Main Arena */}
          <div className="relative w-full h-[620px] z-20">
            
            {/* =========================================================================
                👑 TOP APEX: ULTRON 3.8 GIGANTIC BOSS-TIER MECH COMMANDER
               ========================================================================= */}
            <div 
              style={{
                left: '50%',
                top: '15%',
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-40 flex flex-col items-center"
            >
              <UltronBossSprite
                speechText={isOverdriveActive ? '👑 ULTRON 3.8: OVERDRIVE BUS FIRING AT 9,999 MW!' : '👑 ULTRON 3.8: ALL 9 FACTORY SECTORS UNDER SUPREME COMMAND'}
                isOverdrive={isOverdriveActive}
                onClick={() => {
                  playSound('warp');
                  setSelectedBuildingId(0);
                }}
              />
            </div>

            {/* =========================================================================
                9 MINIATURE FACTORY BUILDINGS (Positioned underneath Boss Ultron 3.8)
               ========================================================================= */}
            {FACTORY_BUILDINGS.map((bld, idx) => {
              const isSelected = selectedBuildingId === bld.id;
              const isHovered = hoveredBuildingId === bld.id;
              const boxTheme = boxes.find(b => b.id === bld.id) || boxes[idx % boxes.length];
              const Icon = bld.icon;
              const isPacketActive = activePacketStep === idx;
              const isInjectedActive = injectedPacketActive && injectedPacketProgress === idx;

              return (
                <div
                  key={bld.id}
                  style={{
                    left: `${bld.gridX}%`,
                    top: `${bld.gridY}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    playSound('warp');
                    setSelectedBuildingId(bld.id);
                  }}
                  onMouseEnter={() => {
                    setHoveredBuildingId(bld.id);
                    playSound('click');
                  }}
                  onMouseLeave={() => setHoveredBuildingId(null)}
                  className={`absolute cursor-pointer transition-all duration-300 flex flex-col items-center group z-20 ${
                    isSelected ? 'scale-110 z-30' : isHovered ? 'scale-105 z-30' : ''
                  }`}
                >
                  {/* Miniature Cyber Factory Building Graphic */}
                  <div 
                    className="relative p-2 rounded-xl border-2 shadow-2xl flex flex-col items-center justify-between transition-all"
                    style={{
                      width: '78px',
                      height: '72px',
                      backgroundColor: isSelected ? boxTheme.boxBgHover : boxTheme.boxBg,
                      borderColor: isSelected ? boxTheme.boxBorderHover : isInjectedActive ? '#ffffff' : boxTheme.boxBorder,
                      boxShadow: isInjectedActive 
                        ? `0 0 35px #ffffff, inset 0 0 20px ${theme.neonLime}`
                        : isSelected 
                        ? `0 0 25px ${boxTheme.boxBorder}, inset 0 0 15px ${boxTheme.boxBorder}50` 
                        : isPacketActive
                        ? `0 0 20px ${theme.neonLime}, inset 0 0 10px ${theme.neonLime}40`
                        : `0 0 12px ${boxTheme.boxBorder}40`
                    }}
                  >
                    {/* Building Rooftop Architecture: Mini Chimney / Antenna / Radar Dish */}
                    <div className="absolute -top-3.5 inset-x-0 flex items-center justify-between px-2 pointer-events-none">
                      {bld.buildingType === 'radar' && (
                        <div className="mx-auto flex items-center gap-1">
                          <Radar className="w-3.5 h-3.5 animate-spin" style={{ color: boxTheme.boxBorder, animationDuration: '5s' }} />
                        </div>
                      )}
                      {bld.buildingType === 'foundry' && (
                        <div className="flex gap-1 items-end mx-auto">
                          <span className="w-1.5 h-3 rounded-t-sm animate-pulse" style={{ backgroundColor: boxTheme.boxBorder }} />
                          <span className="w-1.5 h-2 rounded-t-sm" style={{ backgroundColor: boxTheme.boxBorder }} />
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                        </div>
                      )}
                      {bld.buildingType === 'vault' && (
                        <div className="px-1 py-0.2 rounded text-[7px] font-black border mx-auto flex items-center gap-0.5" style={{ backgroundColor: boxTheme.boxBg, borderColor: boxTheme.boxBorder, color: boxTheme.boxBorder }}>
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>SHA</span>
                        </div>
                      )}
                      {bld.buildingType === 'treasury' && (
                        <div className="mx-auto flex items-center gap-0.5">
                          <CircleDollarSign className="w-3 h-3 text-amber-400" />
                        </div>
                      )}
                      {bld.buildingType === 'store' && (
                        <div className="flex gap-0.5 mx-auto">
                          <span className="w-2.5 h-1.5 rounded-t bg-pink-500" />
                          <span className="w-2.5 h-1.5 rounded-t bg-cyan-400" />
                        </div>
                      )}
                      {bld.buildingType === 'reactor' && (
                        <div className="mx-auto flex items-center">
                          <Flame className="w-3 h-3 text-amber-400 animate-bounce" />
                        </div>
                      )}
                      {bld.buildingType === 'citadel' && (
                        <div className="mx-auto flex items-center gap-0.5">
                          <Shield className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                      {bld.buildingType === 'medic' && (
                        <div className="mx-auto text-[7px] font-black text-red-400 bg-red-950/80 px-1 rounded border border-red-500 flex items-center gap-0.5">
                          <span>+</span> CSAT
                        </div>
                      )}
                      {bld.buildingType === 'command' && (
                        <div className="mx-auto flex items-center gap-0.5">
                          <LineChart className="w-3 h-3 text-lime-400" />
                        </div>
                      )}
                    </div>

                    {/* Building Code & Status Pill */}
                    <div className="flex items-center justify-between w-full text-[8px] font-black">
                      <span 
                        className="px-1 py-0.2 rounded"
                        style={{ 
                          backgroundColor: boxTheme.badgeBg,
                          color: boxTheme.badgeText,
                          textShadow: boxTheme.badgeTextShadow
                        }}
                      >
                        {bld.code}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: boxTheme.boxBorder }} />
                    </div>

                    {/* Center Machine Icon & Tiny Robot Avatar */}
                    <div className="flex items-center justify-center gap-1 my-0.5">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: boxTheme.boxBorder }} />
                      <div className="scale-65 origin-center">
                        <TinyRobot
                          name={bld.agent}
                          role={bld.agentRole}
                          customPalette={boxTheme.robot}
                          hasCargo={bld.hasCargo}
                          cargoColor={boxTheme.robot.cargo}
                          isPatrolling={false}
                        />
                      </div>
                    </div>

                    {/* Bottom Conveyor Track */}
                    <div 
                      className="w-full h-1.5 rounded-sm overflow-hidden flex items-center justify-around"
                      style={{
                        backgroundColor: '#000000',
                        border: `1px solid ${boxTheme.conveyorBorder}`
                      }}
                    >
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: boxTheme.conveyorItems[0] }} />
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: boxTheme.conveyorItems[1] }} />
                    </div>
                  </div>

                  {/* Building Label Underneath with Dramatic Font */}
                  <div className="mt-1 text-center font-mono">
                    <span 
                      className="text-[9px] font-black block tracking-tight truncate max-w-[85px]"
                      style={{
                        color: boxTheme.fontUnderneath.valueColor,
                        textShadow: boxTheme.fontUnderneath.textShadow
                      }}
                    >
                      {bld.name.split(' ')[0]}
                    </span>
                    <span 
                      className="text-[8px] block truncate max-w-[85px]"
                      style={{ color: boxTheme.fontUnderneath.labelColor }}
                    >
                      {bld.agent} ({bld.shortType.split(' ')[0]})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Blueprint Scale & Quick Navigation Footer */}
          <div 
            className="p-2.5 rounded-xl border flex items-center justify-between text-xs z-20"
            style={{
              backgroundColor: `${theme.bgCard}E6`,
              borderColor: bpColor.border
            }}
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Compass className="w-3.5 h-3.5" style={{ color: bpColor.primary }} />
              <span>
                Selected: {isUltronSelected ? (
                  <strong className="text-amber-300">ULTRON 3.8 SUPREME COMMANDER</strong>
                ) : (
                  <><strong>{selectedBuilding.name}</strong> ({selectedBuilding.agent})</>
                )}
              </span>
            </div>

            <button
              onClick={() => onSelectSubsystem(isUltronSelected ? 'ultron' : selectedBuilding.tab)}
              className="px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              style={{
                background: isUltronSelected ? 'linear-gradient(135deg, #ff0055, #ffd700)' : `linear-gradient(135deg, ${bpColor.primary}, ${theme.neonLime})`,
                color: isUltronSelected ? '#000000' : currentDramaticFont.badgeTextColor,
                textShadow: isUltronSelected ? 'none' : currentDramaticFont.badgeTextShadow
              }}
            >
              <span>{isUltronSelected ? 'ENTER ULTRON COMMANDER VIEW' : 'ENTER SECTOR VIEW'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (3 Cols): Live Message Bus & Selected Node Diagnostics
           ========================================================================= */}
        <div 
          className="xl:col-span-3 rounded-2xl border p-4 space-y-4 shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: theme.bgCard,
            borderColor: theme.borderTheme
          }}
        >
          {/* Selected Building or Boss Inspector */}
          <div>
            <div className="flex items-center justify-between border-b pb-2.5 mb-3" style={{ borderColor: theme.borderTheme }}>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4" style={{ color: isUltronSelected ? '#ffd700' : theme.neonLime }} />
                <h4 className="font-mono text-xs font-black uppercase text-white tracking-wider">
                  {isUltronSelected ? 'SUPREME BOSS INSPECTOR' : 'SCHEMATIC NODE INSPECTOR'}
                </h4>
              </div>
              <span 
                className="px-1.5 py-0.2 rounded text-[9px] font-bold"
                style={{ 
                  backgroundColor: isUltronSelected ? '#ffd700' : selectedBoxTheme.badgeBg, 
                  color: isUltronSelected ? '#000000' : selectedBoxTheme.badgeText, 
                  textShadow: isUltronSelected ? 'none' : selectedBoxTheme.badgeTextShadow 
                }}
              >
                {isUltronSelected ? 'BOSS-00' : selectedBuilding.code}
              </span>
            </div>

            {/* Selected Node Card */}
            {isUltronSelected ? (
              <div 
                className="p-3.5 rounded-xl border-2 space-y-2.5"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b, #31102e)',
                  borderColor: '#ffd700',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-sm text-amber-300">
                      ULTRON 3.8 SUPREME COMMANDER
                    </h5>
                    <span className="text-[10px] text-slate-300">
                      Chief of Staff AI · <strong>Gemini 3.8 Flash</strong>
                    </span>
                  </div>
                  <Crown className="w-7 h-7 text-amber-400" />
                </div>

                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Autonomous orchestrator running on top of all 9 digital goods factory sectors, directing high-throughput handoffs, token packaging, and revenue settlements.
                </p>

                {/* Technical Spec */}
                <div className="p-2 rounded bg-black/70 border border-amber-500/40 text-[9px] font-mono text-amber-200">
                  <span className="text-amber-400 font-bold block mb-0.5">BOSS DIRECTIVE:</span>
                  <span>Model: Gemini 3.8 Flash · 100% Heat · 9,999 MW Overdrive Core · Multi-Agent Synchronizer</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-2 rounded bg-black/60 border border-amber-500/30">
                    <span className="text-slate-400 block uppercase">Fleet Uptime</span>
                    <span className="font-black text-emerald-400">99.98% NOMINAL</span>
                  </div>

                  <div className="p-2 rounded bg-black/60 border border-amber-500/30">
                    <span className="text-slate-400 block uppercase">Overdrive PWR</span>
                    <span className="font-black text-amber-300">9,999 MW</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSubsystem('ultron')}
                  className="w-full py-2.5 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-xl transition-all hover:scale-105 border"
                  style={{
                    background: 'linear-gradient(135deg, #ff0055, #ffd700)',
                    color: '#000000',
                    borderColor: '#ffffff'
                  }}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>OPEN ULTRON COMMANDER CONSOLE</span>
                </button>
              </div>
            ) : (
              <div 
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{
                  backgroundColor: theme.bgSurface,
                  borderColor: selectedBoxTheme.boxBorder,
                  boxShadow: `0 0 15px ${selectedBoxTheme.boxBorder}30`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 
                      className="font-black text-sm"
                      style={{ color: selectedBoxTheme.fontUnderneath.valueColor, textShadow: selectedBoxTheme.fontUnderneath.textShadow }}
                    >
                      {selectedBuilding.name}
                    </h5>
                    <span className="text-[10px]" style={{ color: selectedBoxTheme.fontUnderneath.labelColor }}>
                      Agent: <strong>{selectedBuilding.agent}</strong> ({selectedBuilding.agentRole})
                    </span>
                  </div>

                  <selectedBuilding.icon className="w-6 h-6" style={{ color: selectedBoxTheme.boxBorder }} />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedBuilding.description}
                </p>

                {/* Technical Spec */}
                <div className="p-2 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-0.5">TECHNICAL SPECIFICATION:</span>
                  <span>{selectedBuilding.techSpec}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-2 rounded bg-black/50 border border-white/10">
                    <span className="text-slate-400 block uppercase">{selectedBuilding.kpiLabel}</span>
                    <span className="font-black text-white">{selectedBuilding.kpi}</span>
                  </div>

                  <div className="p-2 rounded bg-black/50 border border-white/10">
                    <span className="text-slate-400 block uppercase">Throughput</span>
                    <span className="font-black" style={{ color: bpColor.primary }}>{selectedBuilding.throughput.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 space-y-0.5 border-t border-white/10 pt-2 font-mono">
                  <div><strong>Input Conduits:</strong> {selectedBuilding.inputFrom}</div>
                  <div><strong>Output Bus:</strong> {selectedBuilding.outputTo}</div>
                </div>

                <button
                  onClick={() => onSelectSubsystem(selectedBuilding.tab)}
                  className="w-full py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${bpColor.primary}, ${theme.neonLime})`,
                    color: currentDramaticFont.badgeTextColor,
                    textShadow: currentDramaticFont.badgeTextShadow
                  }}
                >
                  <span>OPEN {selectedBuilding.name.split(' ')[0]} VIEW</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Inter-Agent Message Bus Stream */}
          <div 
            className="p-3 rounded-xl border space-y-2"
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.borderTheme
            }}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-300 border-b border-white/10 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" style={{ color: theme.neonLime }} />
                <span>INTER-AGENT MESSAGE BUS</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">LIVE STREAM</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[10px] font-mono">
              {packetLogs.slice(0, 6).map((log) => (
                <div 
                  key={log.id} 
                  className={`p-1.5 rounded bg-black/50 border space-y-0.5 ${
                    log.type === 'boss' ? 'border-amber-500/50 bg-amber-950/20' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span className={log.type === 'boss' ? 'text-amber-400 font-black' : 'text-cyan-400 font-bold'}>
                      {log.from} ➔ {log.to}
                    </span>
                    <span>{log.time}</span>
                  </div>
                  <div className="text-slate-200 truncate">
                    {log.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
