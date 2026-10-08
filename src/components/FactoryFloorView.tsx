import React, { useState } from 'react';
import { 
  Radar, 
  Cpu, 
  PackageCheck, 
  CircleDollarSign, 
  Store, 
  Flame, 
  ShieldCheck, 
  Users, 
  LineChart, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { FactorySector, Agent } from '../types';
import { playSound } from '../utils/audio';

interface FactoryFloorViewProps {
  sectors: FactorySector[];
  agents: Agent[];
  isOverdriveActive: boolean;
  onBoostSector: (sectorId: number) => void;
  onOpenProductLab: () => void;
  onOpenStore: () => void;
  onOpenCrm: () => void;
  onOpenCompliance: () => void;
}

export const FactoryFloorView: React.FC<FactoryFloorViewProps> = ({
  sectors,
  agents,
  isOverdriveActive,
  onBoostSector,
  onOpenProductLab,
  onOpenStore,
  onOpenCrm,
  onOpenCompliance
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || null;
  const sectorAgent = selectedSector ? agents.find(a => a.id === selectedSector.agentId) : null;

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radar': return Radar;
      case 'Cpu': return Cpu;
      case 'PackageCheck': return PackageCheck;
      case 'CircleDollarSign': return CircleDollarSign;
      case 'Store': return Store;
      case 'Flame': return Flame;
      case 'ShieldCheck': return ShieldCheck;
      case 'Users': return Users;
      case 'LineChart': return LineChart;
      default: return Activity;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner: Cyber Factory Overview */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#0a0e1c] to-slate-950 p-5 glow-cyan">
        <div className="scanline-overlay" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="font-mono text-lg font-extrabold uppercase tracking-wider text-white">
                HQ CYBER FACTORY FLOOR · 9 SECTOR AUTONOMOUS MATRIX
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time procedural manufacturing pipeline for handmade digital goods. 8 autonomous AI agents coordinate discovery, algorithmic creation, automated Etsy sync, instant multi-channel checkout, and custom CRM retention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">Pipeline Velocity</div>
              <div className="text-sm font-mono font-bold text-cyan-400 flex items-center justify-end gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                {isOverdriveActive ? '4.8x HYPERFLOW' : '1.0x NOMINAL'}
              </div>
            </div>

            <button
              onClick={() => {
                playSound('agent');
                onOpenProductLab();
              }}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-black font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Forge New Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 9-Chamber Isometric Cyber Grid */}
      <div className="relative">
        {/* Visual Pipeline Conduits between grid rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {sectors.map((sector) => {
            const Icon = getSectorIcon(sector.icon);
            const isSelected = selectedSectorId === sector.id;

            // Border & Glow styling
            const glowClass = 
              sector.neonClass === 'cyan' ? 'hover:glow-cyan border-cyan-500/40' :
              sector.neonClass === 'magenta' ? 'hover:glow-magenta border-pink-500/40' :
              sector.neonClass === 'lime' ? 'hover:glow-lime border-lime-500/40' :
              sector.neonClass === 'amber' ? 'hover:glow-amber border-amber-500/40' :
              sector.neonClass === 'purple' ? 'hover:glow-purple border-purple-500/40' :
              sector.neonClass === 'blue' ? 'hover:glow-cyan border-blue-500/40' :
              sector.neonClass === 'red' ? 'hover:glow-magenta border-red-500/40' : 'hover:glow-lime border-emerald-500/40';

            const activeGlow = isSelected ? 'ring-2 ring-cyan-400 scale-[1.01] bg-[#0c1222]' : 'bg-[#090d18]';

            return (
              <div
                key={sector.id}
                onClick={() => {
                  playSound('click');
                  setSelectedSectorId(sector.id);
                }}
                className={`relative group rounded-xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden ${glowClass} ${activeGlow}`}
              >
                {/* Subtle cyber background grid & room status lights */}
                <div className="cyber-dots-bg absolute inset-0 opacity-40 pointer-events-none" />

                {/* Header: Sector Code & Live Status Badge */}
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {sector.code}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    sector.status === 'boosted' || isOverdriveActive
                      ? 'bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/50'
                      : 'bg-slate-900 text-slate-300 border border-slate-700/80'
                  }`}>
                    {isOverdriveActive ? 'OVERDRIVE' : sector.status}
                  </span>
                </div>

                {/* Center Graphic: Room Isometric Concept Art & Animated Machine */}
                <div className="relative h-24 my-2 rounded-lg bg-black/60 border border-slate-800/80 flex items-center justify-center overflow-hidden p-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                  
                  {/* Decorative circuit lines inside room */}
                  <div className="absolute inset-x-2 top-2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                  <div className="absolute inset-x-2 bottom-2 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                  <div className="flex items-center gap-3 relative z-10">
                    <div 
                      className="p-3 rounded-xl border shadow-lg transition-transform group-hover:scale-110 duration-300"
                      style={{ 
                        backgroundColor: `${sector.colorHex}15`, 
                        borderColor: `${sector.colorHex}60`,
                        boxShadow: `0 0 15px ${sector.glowColor}`
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: sector.colorHex }} />
                    </div>

                    <div className="text-left">
                      <div className="font-mono text-xs font-semibold text-slate-200">
                        {sector.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>Agent {sector.agentName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom KPI Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">{sector.kpiLabel}</span>
                    <span className="text-white font-bold">{sector.kpiValue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-[10px] block font-bold">{sector.subKpi}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Sector Inspector Drawer (When a room is clicked) */}
      {selectedSector && (
        <div className="rounded-xl border border-cyan-500/40 bg-[#090d18] p-5 shadow-2xl glow-cyan animate-in fade-in duration-200 relative">
          <button
            onClick={() => setSelectedSectorId(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm"
          >
            ✕ Close
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded">
                  {selectedSector.code}
                </span>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">
                  {selectedSector.name}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSector.shortDesc}
              </p>

              {sectorAgent && (
                <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                    Assigned Agent: <span className="text-cyan-400 font-bold">{sectorAgent.name} ({sectorAgent.role})</span>
                  </div>
                  <div className="text-slate-300">
                    Current Task: <span className="text-slate-100">{sectorAgent.currentTask}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Execution Speed: {sectorAgent.speed} · Level {sectorAgent.level} · {sectorAgent.tasksCompleted} Tasks Completed
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions for this sector */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 min-w-[200px]">
              <button
                onClick={() => {
                  playSound('warp');
                  onBoostSector(selectedSector.id);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Boost Velocity (2x)</span>
              </button>

              {selectedSector.id === 2 && (
                <button
                  onClick={onOpenProductLab}
                  className="px-4 py-2 rounded-lg bg-fuchsia-600/30 hover:bg-fuchsia-600/40 border border-fuchsia-400 text-fuchsia-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Forge Lab</span>
                </button>
              )}

              {selectedSector.id === 5 && (
                <button
                  onClick={onOpenStore}
                  className="px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 border border-blue-400 text-blue-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View Live Store & Etsy</span>
                </button>
              )}

              {selectedSector.id === 7 && (
                <button
                  onClick={onOpenCompliance}
                  className="px-4 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400 text-emerald-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Review Permits</span>
                </button>
              )}

              {selectedSector.id === 8 && (
                <button
                  onClick={onOpenCrm}
                  className="px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/40 border border-red-400 text-red-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage CRM & Kai</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Sector Telemetry Console */}
          {sectorAgent && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5">
                Active Telemetry Stream
              </div>
              <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-cyan-300/90 space-y-1 max-h-24 overflow-y-auto border border-slate-800">
                {sectorAgent.logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-slate-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
