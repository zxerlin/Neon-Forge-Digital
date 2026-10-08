import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Store, 
  Cpu, 
  Radar, 
  PackageCheck, 
  CircleDollarSign, 
  ShieldCheck, 
  Users, 
  LineChart, 
  Sparkles, 
  ArrowRight, 
  Maximize2, 
  Box, 
  Compass, 
  Layers, 
  RotateCw,
  Shuffle,
  Type
} from 'lucide-react';
import { TinyRobot } from './TinyRobot';
import { playSound } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';

interface CyberFactoryGameProps {
  onOpenSector: (subsystem: 'product-lab' | 'storefront' | 'inventory' | 'marketing' | 'crm' | 'compliance' | 'whop-analysis') => void;
  onOpenCommanderTerminal: () => void;
  isOverdriveActive: boolean;
  onTriggerOverdrive: () => void;
  totalRevenue?: number;
  directRevenue?: number;
  etsyRevenue?: number;
  onOpenLazyButton?: () => void;
}

type CameraViewMode = 'iso3d' | 'tactical3d' | 'orbit3d' | 'flat2d';

export const CyberFactoryGame: React.FC<CyberFactoryGameProps> = ({
  onOpenSector,
  onOpenCommanderTerminal,
  isOverdriveActive,
  onTriggerOverdrive,
  totalRevenue = 0,
  directRevenue = 0,
  etsyRevenue = 0,
  onOpenLazyButton
}) => {
  const { 
    theme, 
    boxes, 
    remixBoxes, 
    remixSingleBox, 
    cycleDramaticFont, 
    currentDramaticFont 
  } = useTheme();

  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('iso3d');
  const [customRotX, setCustomRotX] = useState(52);
  const [customRotZ, setCustomRotZ] = useState(-28);

  const FACTORY_ROOMS = [
    {
      id: 1,
      code: 'FACTORY 01',
      name: 'TREND RADAR & LAB',
      agent: 'Nova',
      role: 'Niche Scout Bot',
      speech: 'Etsy Trend 96%!',
      tab: 'product-lab' as const,
      kpi: '3,480 Niches Scanned',
      hasCargo: false,
      hologramSymbol: 'RADAR-3D',
      height3D: 'h-40',
      elevation: 24,
      details: 'Autonomous Etsy search radar & low-competition niche miner.'
    },
    {
      id: 2,
      code: 'FACTORY 02',
      name: 'THE DIGITAL FORGE',
      agent: 'Aria',
      role: 'Handmade Creator Bot',
      speech: 'Forging Notion OS!',
      tab: 'product-lab' as const,
      kpi: '100% Original Code',
      hasCargo: true,
      hologramSymbol: 'FORGE-3D',
      height3D: 'h-40',
      elevation: 28,
      details: 'Synthesizes Notion systems, prompt books & spreadsheets. Zero dropship.'
    },
    {
      id: 3,
      code: 'FACTORY 03',
      name: 'PACKAGING & VAULT',
      agent: 'Zed',
      role: 'License Packager Bot',
      speech: 'SHA-256 Sealed!',
      tab: 'inventory' as const,
      kpi: 'SHA-256 Vault Bundles',
      hasCargo: true,
      hologramSymbol: 'VAULT-3D',
      height3D: 'h-40',
      elevation: 24,
      details: 'Mints cryptographic PDF commercial license stamps and zip archives.'
    },
    {
      id: 4,
      code: 'FACTORY 04',
      name: 'PRICING TREASURY',
      agent: 'Rex',
      role: 'Pricing Matrix Bot',
      speech: totalRevenue > 0 ? `Rev $${totalRevenue.toFixed(0)} Live!` : 'Ladders Armed!',
      tab: 'whop-analysis' as const,
      kpi: totalRevenue > 0 ? `$${totalRevenue.toFixed(2)} Settled` : 'Dynamic Ladders Armed',
      hasCargo: true,
      hologramSymbol: 'GOLD-3D',
      height3D: 'h-40',
      elevation: 26,
      details: 'Dynamic price ladder optimizer & bundle checkout upsell generator.'
    },
    {
      id: 5,
      code: 'FACTORY 05',
      name: 'ETSY & STORE NEXUS',
      agent: 'Sage',
      role: 'Multi-Channel Nexus Bot',
      speech: 'Payment Live!',
      tab: 'storefront' as const,
      kpi: '13 Etsy Tags Active',
      hasCargo: true,
      hologramSymbol: 'NEXUS-3D',
      height3D: 'h-40',
      elevation: 32,
      details: 'Instant credit card & Apple Pay checkout + 13-tag Etsy algorithmic sync.'
    },
    {
      id: 6,
      code: 'FACTORY 06',
      name: 'VIRAL REACTOR',
      agent: 'Maya',
      role: 'Social Broadcaster Bot',
      speech: 'Reddit Viral!',
      tab: 'marketing' as const,
      kpi: '48.2k Organic Reach',
      hasCargo: false,
      hologramSymbol: 'PLASMA-3D',
      height3D: 'h-40',
      elevation: 24,
      details: 'Autonomous multi-platform viral posts for Reddit, X, TikTok and Pinterest.'
    },
    {
      id: 7,
      code: 'FACTORY 07',
      name: 'PERMITS & SHIELD',
      agent: 'Aegis',
      role: 'Legal Compliance Bot',
      speech: '100% Tax OK!',
      tab: 'compliance' as const,
      kpi: 'Zero Dropship Risks',
      hasCargo: false,
      hologramSymbol: 'SHIELD-3D',
      height3D: 'h-40',
      elevation: 24,
      details: 'Etsy handmade policies, US Marketplace Facilitator tax, EU VAT MOSS.'
    },
    {
      id: 8,
      code: 'FACTORY 08',
      name: 'CYBER CRM BAY',
      agent: 'Kai',
      role: 'Support Medic Bot',
      speech: 'Help Dispatched!',
      tab: 'crm' as const,
      kpi: '3.8 Min CSAT 99%',
      hasCargo: false,
      hologramSymbol: 'MEDIC-3D',
      height3D: 'h-40',
      elevation: 24,
      details: 'Customer LTV tracking, Obsidian VIP tiers, and instant Gemini AI reply triage.'
    },
    {
      id: 9,
      code: 'FACTORY 09',
      name: 'PROFIT COMMAND',
      agent: 'Leo',
      role: 'Financial Brain Bot',
      speech: totalRevenue > 0 ? `Net Gross $${totalRevenue.toFixed(2)}!` : 'Live $0.00 Base!',
      tab: 'whop-analysis' as const,
      kpi: totalRevenue > 0 ? `$${totalRevenue.toFixed(2)} Settled` : 'Live $0.00 Baseline',
      hasCargo: true,
      hologramSymbol: 'BRAIN-3D',
      height3D: 'h-40',
      elevation: 30,
      details: 'Audits net profit margins, payout schedules, and authoritative revenue scaling.'
    }
  ];

  const handleRoomClick = (tab: 'product-lab' | 'storefront' | 'inventory' | 'marketing' | 'crm' | 'compliance' | 'whop-analysis') => {
    playSound('warp');
    onOpenSector(tab);
  };

  const setCameraAngle = (mode: CameraViewMode) => {
    playSound('click');
    setCameraMode(mode);
    if (mode === 'iso3d') {
      setCustomRotX(52);
      setCustomRotZ(-28);
    } else if (mode === 'tactical3d') {
      setCustomRotX(38);
      setCustomRotZ(-12);
    } else if (mode === 'orbit3d') {
      setCustomRotX(60);
      setCustomRotZ(-42);
    } else {
      setCustomRotX(0);
      setCustomRotZ(0);
    }
  };

  return (
    <div className="p-3 lg:p-6 space-y-4 font-mono select-none overflow-hidden">
      {/* Top 3D Camera Controls & Live Retro HUD Bar */}
      <div 
        className="rounded-xl border-2 p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs transition-colors duration-300"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.neonLime,
          boxShadow: `0 0 25px color-mix(in srgb, ${theme.neonLime} 30%, transparent)`
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded font-black text-[11px] animate-pulse border shadow-md"
            style={{
              backgroundColor: theme.neonLime,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow,
              borderColor: theme.neonLime
            }}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D CYBER FACTORY MATRIX</span>
          </div>

          <div className="flex items-center gap-2.5 font-bold flex-wrap" style={{ color: currentDramaticFont.labelColor }}>
            <span style={{ textShadow: currentDramaticFont.textShadow }}>REVENUE: ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="opacity-40">|</span>
            <span style={{ textShadow: currentDramaticFont.textShadow }}>ETSY: ${etsyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="opacity-40">|</span>
            <span className="hidden sm:inline" style={{ textShadow: currentDramaticFont.textShadow }}>DIRECT: ${directRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* 3D Camera Angles Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-black/80 border border-white/10 rounded-lg">
          <button
            onClick={() => setCameraAngle('iso3d')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              cameraMode === 'iso3d'
                ? 'shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: cameraMode === 'iso3d' ? theme.neonLime : 'transparent',
              color: cameraMode === 'iso3d' ? currentDramaticFont.badgeTextColor : undefined,
              textShadow: cameraMode === 'iso3d' ? currentDramaticFont.badgeTextShadow : undefined
            }}
            title="Isometric 3D Perspective"
          >
            <Box className="w-3 h-3" />
            <span>3D Isometric</span>
          </button>

          <button
            onClick={() => setCameraAngle('tactical3d')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              cameraMode === 'tactical3d'
                ? 'shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: cameraMode === 'tactical3d' ? theme.neonCyan : 'transparent',
              color: cameraMode === 'tactical3d' ? currentDramaticFont.badgeTextColor : undefined,
              textShadow: cameraMode === 'tactical3d' ? currentDramaticFont.badgeTextShadow : undefined
            }}
            title="Tactical Low-Angle 3D"
          >
            <Compass className="w-3 h-3" />
            <span>3D Tactical</span>
          </button>

          <button
            onClick={() => setCameraAngle('orbit3d')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              cameraMode === 'orbit3d'
                ? 'shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: cameraMode === 'orbit3d' ? theme.neonMagenta : 'transparent',
              color: cameraMode === 'orbit3d' ? currentDramaticFont.badgeTextColor : undefined,
              textShadow: cameraMode === 'orbit3d' ? currentDramaticFont.badgeTextShadow : undefined
            }}
            title="Deep Orbit 3D Angle"
          >
            <RotateCw className="w-3 h-3" />
            <span>3D Orbit</span>
          </button>

          <button
            onClick={() => setCameraAngle('flat2d')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              cameraMode === 'flat2d'
                ? 'shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: cameraMode === 'flat2d' ? theme.neonAmber : 'transparent',
              color: cameraMode === 'flat2d' ? currentDramaticFont.badgeTextColor : undefined,
              textShadow: cameraMode === 'flat2d' ? currentDramaticFont.badgeTextShadow : undefined
            }}
            title="Flat Top-Down View"
          >
            <Layers className="w-3 h-3" />
            <span>2D Grid</span>
          </button>
        </div>

        {/* Action Controls: Lazy Button, Box Remix, Dramatic Font Toggle, Commander, Overdrive */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* THE ROUND BRIGHT NEON DEEP PURPLE LAZY BUTTON */}
          <button
            onClick={() => {
              playSound('warp');
              if (onOpenLazyButton) {
                onOpenLazyButton();
              }
            }}
            className="px-3.5 py-1.5 rounded-full font-black text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_#9333ea,0_0_35px_#7e22ce] hover:shadow-[0_0_30px_#c084fc,0_0_55px_#9333ea] hover:scale-105 active:scale-95 border-2 border-purple-200 text-white"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #c084fc 0%, #9333ea 50%, #581c87 100%)'
            }}
            title="THE LAZY BUTTON: Autonomous 1-Click Multi-Agent Swarm (Scouts niche, creates asset, writes ads, lists & settles Stripe bank deposit)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-extrabold uppercase font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              🟣 THE LAZY BUTTON
            </span>
          </button>

          {/* REMIX ALL 9 BOXES & ROBOTS BUTTON */}
          <button
            onClick={() => remixBoxes()}
            className="px-3 py-1.5 rounded font-black text-xs flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 active:scale-95 border"
            style={{
              background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonMagenta})`,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow,
              borderColor: theme.neonCyan
            }}
            title="Remix all 9 factory chamber boxes, machinery, conveyor belts, and tiny robots!"
          >
            <Shuffle className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>REMIX BOXES & ROBOTS 🤖🎲</span>
          </button>

          {/* DRAMATIC FONT UNDERNEATH TOGGLE */}
          <button
            onClick={() => cycleDramaticFont()}
            className="px-2.5 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition-all border hover:bg-white/10"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.borderTheme,
              color: currentDramaticFont.labelColor,
              textShadow: currentDramaticFont.textShadow
            }}
            title={`Cycle dramatic font underneath style (Current: ${currentDramaticFont.name})`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Font: {currentDramaticFont.name.split(' ')[0]}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>

          {/* Station Commander Terminal Button */}
          <button
            onClick={() => {
              playSound('agent');
              onOpenCommanderTerminal();
            }}
            className="px-3 py-1.5 rounded border font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            style={{
              backgroundColor: theme.bgCard,
              borderColor: theme.neonLime,
              color: theme.neonLime
            }}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ULTRON COMMANDER</span>
          </button>

          {/* Hyperflow Overdrive Button */}
          <button
            onClick={() => {
              playSound('warp');
              onTriggerOverdrive();
            }}
            className={`px-3 py-1.5 rounded font-black text-xs flex items-center gap-1.5 transition-all border ${
              isOverdriveActive ? 'animate-pulse' : 'hover:scale-105'
            }`}
            style={{
              background: isOverdriveActive 
                ? theme.neonMagenta 
                : `linear-gradient(135deg, ${theme.neonLime}, ${theme.neonCyan})`,
              color: currentDramaticFont.badgeTextColor,
              textShadow: currentDramaticFont.badgeTextShadow,
              borderColor: theme.neonLime
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isOverdriveActive ? '4.8x HYPERFLOW!' : 'OVERDRIVE WAVE'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Spatial Viewport Container */}
      <div 
        className="relative rounded-2xl border-2 p-4 lg:p-8 overflow-hidden shadow-2xl perspective-container min-h-[640px] flex items-center justify-center transition-colors duration-300"
        style={{
          backgroundColor: theme.bgVoid,
          borderColor: theme.borderGlow
        }}
      >
        {/* Animated Scanline & 3D Depth Fog */}
        <div className="scanline-overlay pointer-events-none" />

        {/* 3D Depth Indicator Pill */}
        <div 
          className="absolute top-4 left-4 z-30 flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 shadow-lg border"
          style={{
            backgroundColor: `${theme.bgSurface}E6`,
            borderColor: theme.borderTheme,
            color: currentDramaticFont.labelColor,
            textShadow: currentDramaticFont.textShadow
          }}
        >
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.neonCyan }} />
          <span className="font-bold">SPATIAL 3D CAMERA ACTIVE:</span>
          <span className="font-bold text-white">{customRotX}° PITCH / {customRotZ}° YAW</span>
        </div>

        {/* Real-time Angle Adjuster Sliders (Collapsible / Compact) */}
        <div 
          className="absolute top-4 right-4 z-30 hidden sm:flex items-center gap-3 border rounded-lg px-3 py-1 text-[10px]"
          style={{
            backgroundColor: `${theme.bgSurface}E6`,
            borderColor: theme.borderTheme,
            color: currentDramaticFont.labelColor
          }}
        >
          <div className="flex items-center gap-1.5">
            <span>Tilt:</span>
            <input
              type="range"
              min="0"
              max="70"
              value={customRotX}
              onChange={(e) => {
                setCustomRotX(Number(e.target.value));
                setCameraMode('orbit3d');
              }}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span>Rotation:</span>
            <input
              type="range"
              min="-60"
              max="20"
              value={customRotZ}
              onChange={(e) => {
                setCustomRotZ(Number(e.target.value));
                setCameraMode('orbit3d');
              }}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* The 3D Master Factory World Stage */}
        <div 
          className="relative preserve-3d transition-transform duration-700 w-full max-w-5xl my-6"
          style={{
            transform: `rotateX(${customRotX}deg) rotateZ(${customRotZ}deg) rotateY(4deg)`,
          }}
        >
          {/* 3D Foundation Slab Ground Platform with Extruded Edge */}
          <div 
            className="absolute -inset-6 rounded-3xl cyber-industrial-floor border-4 shadow-3d-ground"
            style={{
              transform: 'translateZ(-15px)',
              borderColor: theme.borderGlow,
              boxShadow: `0 40px 60px rgba(0, 0, 0, 0.95), 0 0 50px ${theme.borderGlow}`
            }}
          >
            {/* 3D Slab Thickness Drop Shadow Side */}
            <div 
              className="absolute inset-x-0 -bottom-4 h-4 rounded-b-3xl border-b-2"
              style={{
                backgroundColor: `${theme.bgSurface}CC`,
                borderColor: theme.neonCyan
              }}
            />
          </div>

          {/* 3D Interconnecting Glowing Energy Beams / Pipes connecting the rooms */}
          <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none z-10 opacity-70" viewBox="0 0 1000 700">
            <line x1="160" y1="120" x2="500" y2="120" stroke={boxes[0]?.boxBorder || '#00f0ff'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #00f0ff)" />
            <line x1="500" y1="120" x2="840" y2="120" stroke={boxes[1]?.boxBorder || '#ff007f'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #ff007f)" />
            <line x1="840" y1="120" x2="840" y2="350" stroke={boxes[2]?.boxBorder || '#39ff14'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #39ff14)" />
            <line x1="840" y1="350" x2="500" y2="350" stroke={boxes[3]?.boxBorder || '#ffb700'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #ffb700)" />
            <line x1="500" y1="350" x2="160" y2="350" stroke={boxes[4]?.boxBorder || '#3b82f6'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #3b82f6)" />
            <line x1="160" y1="350" x2="160" y2="580" stroke={boxes[5]?.boxBorder || '#b026ff'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #b026ff)" />
            <line x1="160" y1="580" x2="500" y2="580" stroke={boxes[6]?.boxBorder || '#10b981'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #10b981)" />
            <line x1="500" y1="580" x2="840" y2="580" stroke={boxes[7]?.boxBorder || '#ff3344'} strokeWidth="4" className="conduit-flow" filter="drop-shadow(0 0 8px #ff3344)" />
          </svg>

          {/* 3D 9-Room Raised Factory Blocks (100% Remixed!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20 preserve-3d p-2">
            {FACTORY_ROOMS.map((room) => {
              const isHovered = hoveredRoom === room.id;
              // Remixed box theme for this specific chamber!
              const box = boxes.find(b => b.id === room.id) || boxes[room.id - 1] || boxes[0];

              return (
                <div
                  key={room.id}
                  onMouseEnter={() => {
                    setHoveredRoom(room.id);
                    playSound('click');
                  }}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => handleRoomClick(room.tab)}
                  className="chamber-3d-block rounded-2xl border-2 p-4 cursor-pointer relative group transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? box.boxBgHover : box.boxBg,
                    borderColor: isHovered ? box.boxBorderHover : box.boxBorder,
                    boxShadow: isHovered 
                      ? `0 35px 50px rgba(0, 0, 0, 0.95), ${box.boxGlow}` 
                      : `0 20px 30px rgba(0, 0, 0, 0.8), ${box.boxGlow}`,
                    transform: isHovered 
                      ? 'translateZ(45px) translateY(-10px)' 
                      : `translateZ(${room.elevation}px)`
                  }}
                >
                  {/* Extruded 3D Block Rim (physical cubic depth) */}
                  <div 
                    className="absolute inset-x-0 -bottom-3 h-3 rounded-b-2xl border-b-2 opacity-90 pointer-events-none"
                    style={{ 
                      backgroundColor: box.extrudedRimColor,
                      borderColor: box.boxBorder 
                    }} 
                  />

                  {/* Floating 3D Holographic Crest above the factory */}
                  <div 
                    className="absolute -top-4 right-4 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider bg-black/90 text-white shadow-lg float-3d-hologram pointer-events-none flex items-center gap-1"
                    style={{
                      borderColor: box.hologramColor,
                      boxShadow: `0 0 12px ${box.hologramColor}`
                    }}
                  >
                    <span style={{ color: box.hologramColor }}>✦</span>
                    <span>{room.hologramSymbol}</span>
                  </div>

                  {/* Individual Box Dice Remix Button (Hover Affordance) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remixSingleBox(room.id);
                    }}
                    className="absolute -top-3.5 left-4 z-30 p-1 rounded-full border bg-black/90 hover:scale-110 active:scale-95 transition-transform shadow-md"
                    style={{
                      borderColor: box.boxBorder,
                      color: box.boxBorder
                    }}
                    title={`Remix Box #${room.id} and ${room.agent} Robot individually 🎲`}
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>

                  {/* Room Header with Warning Chevrons & Room Number */}
                  <div className="flex items-center justify-between mb-2 layer-elevated-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase shadow-md border"
                        style={{ 
                          backgroundColor: box.badgeBg,
                          color: box.badgeText,
                          textShadow: box.badgeTextShadow,
                          borderColor: box.boxBorder
                        }}
                      >
                        {room.code}
                      </span>
                      <span 
                        className="text-xs font-extrabold text-white group-hover:scale-105 transition-all"
                        style={{ textShadow: `0 0 8px ${box.boxBorder}` }}
                      >
                        {room.name}
                      </span>
                    </div>

                    <Maximize2 
                      className="w-3.5 h-3.5 transition-colors" 
                      style={{ color: box.boxBorder }} 
                    />
                  </div>

                  {/* 3D Machine Platform Floor with Conveyor Belt & Walking Robot */}
                  <div 
                    className="relative h-32 rounded-xl border p-2.5 flex flex-col justify-between overflow-hidden shadow-inner layer-elevated-1 transition-colors duration-300"
                    style={{
                      backgroundColor: box.platformFloorBg,
                      borderColor: `${box.boxBorder}40`
                    }}
                  >
                    {/* Machine Platform Hazard Stripes */}
                    <div 
                      className="absolute top-0 inset-x-0 h-1.5 opacity-70"
                      style={{
                        background: `repeating-linear-gradient(45deg, ${box.hazardColor1}, ${box.hazardColor1} 6px, ${box.hazardColor2} 6px, ${box.hazardColor2} 12px)`
                      }}
                    />

                    {/* Animated Conveyor Belt along bottom carrying glowing goods in 3D */}
                    <div 
                      className="absolute bottom-2 inset-x-2 h-4 rounded conveyor-belt border flex items-center justify-around px-2 z-10 shadow-md"
                      style={{
                        borderColor: box.conveyorBorder,
                        background: `repeating-linear-gradient(45deg, #111827, #111827 7px, ${box.boxBorder} 7px, ${box.boxBorder} 14px)`
                      }}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-sm shadow-sm animate-pulse" 
                        style={{ backgroundColor: box.conveyorItems[0], boxShadow: `0 0 6px ${box.conveyorItems[0]}` }} 
                      />
                      <span 
                        className="w-2.5 h-2.5 rounded-sm shadow-sm animate-pulse" 
                        style={{ backgroundColor: box.conveyorItems[1], boxShadow: `0 0 6px ${box.conveyorItems[1]}` }} 
                      />
                      <span 
                        className="w-2.5 h-2.5 rounded-sm shadow-sm animate-pulse" 
                        style={{ backgroundColor: box.conveyorItems[2], boxShadow: `0 0 6px ${box.conveyorItems[2]}` }} 
                      />
                    </div>

                    {/* Room Machine Centerpiece + Tiny 3D Robot Avatar */}
                    <div className="flex items-center justify-between relative z-20 pt-1">
                      {/* The Machine Graphic */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-12 h-12 rounded-xl border-2 flex items-center justify-center shadow-lg relative overflow-hidden"
                          style={{
                            backgroundColor: box.machineBg,
                            borderColor: box.machineBorder,
                            boxShadow: box.machineGlow
                          }}
                        >
                          {room.id === 1 && (
                            <Radar className="w-7 h-7 radar-sweep" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 2 && (
                            <div className="flex flex-col items-center">
                              <Flame className="w-6 h-6 animate-bounce" style={{ color: box.machineIconColor }} />
                              <span className="text-[7px] font-black" style={{ color: box.robot.eye }}>FORGE</span>
                            </div>
                          )}
                          {room.id === 3 && (
                            <PackageCheck className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 4 && (
                            <CircleDollarSign className="w-7 h-7 animate-bounce" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 5 && (
                            <Store className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 6 && (
                            <Flame className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 7 && (
                            <ShieldCheck className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 8 && (
                            <Users className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                          {room.id === 9 && (
                            <LineChart className="w-7 h-7 animate-pulse" style={{ color: box.machineIconColor }} />
                          )}
                        </div>

                        {/* Text underneath the machine */}
                        <div className="text-left font-mono">
                          <div 
                            className="text-[9px] uppercase font-bold tracking-wider"
                            style={{ 
                              color: box.fontUnderneath.labelColor,
                              letterSpacing: box.fontUnderneath.letterSpacing
                            }}
                          >
                            3D CHASSIS
                          </div>
                          <div 
                            className="text-xs font-black"
                            style={{ 
                              color: box.fontUnderneath.valueColor,
                              textShadow: box.fontUnderneath.textShadow
                            }}
                          >
                            {room.role}
                          </div>
                        </div>
                      </div>

                      {/* Tiny Robot Avatar with 3D Float in space */}
                      <div className="relative pr-2 robot-3d-float">
                        <TinyRobot
                          name={room.agent}
                          role={room.role}
                          customPalette={box.robot}
                          speechText={room.speech}
                          hasCargo={room.hasCargo}
                          cargoColor={box.robot.cargo}
                          isPatrolling={true}
                        />
                      </div>
                    </div>

                    {/* Machine Status Lights & Underneath Text */}
                    <div 
                      className="flex items-center gap-1.5 text-[9px] font-bold z-20 mb-3"
                      style={{
                        color: box.fontUnderneath.statusColor,
                        textShadow: box.fontUnderneath.statusTextShadow
                      }}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full animate-ping" 
                        style={{ backgroundColor: box.fontUnderneath.statusColor }} 
                      />
                      <span>3D MATRIX ACTIVE (100% HEALTH)</span>
                    </div>
                  </div>

                  {/* Bottom Click-To-Open Bar with Dramatic Underneath Typography */}
                  <div 
                    className="mt-2.5 pt-2 border-t flex items-center justify-between text-xs layer-elevated-1 font-mono"
                    style={{ borderColor: `${box.boxBorder}40` }}
                  >
                    <div>
                      <span 
                        className="text-[10px] block uppercase font-mono tracking-wider font-bold"
                        style={{ 
                          color: box.fontUnderneath.labelColor,
                          letterSpacing: box.fontUnderneath.letterSpacing
                        }}
                      >
                        Real-time Yield
                      </span>
                      <span 
                        className="font-black text-sm"
                        style={{ 
                          color: box.fontUnderneath.valueColor,
                          textShadow: box.fontUnderneath.textShadow
                        }}
                      >
                        {room.kpi}
                      </span>
                    </div>

                    <span 
                      className="text-[11px] font-black group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5"
                      style={{ 
                        color: box.robot.eye,
                        textShadow: `0 0 10px ${box.robot.glow}`
                      }}
                    >
                      <span>STEP INSIDE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
