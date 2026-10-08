import React, { useState } from 'react';
import { Bot, Shield, Cpu, Zap, Activity, Terminal, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/audio';

interface UltronCommanderViewProps {
  onBackToFactory: () => void;
  totalRevenue?: number;
  directRevenue?: number;
  etsyRevenue?: number;
}

export const UltronCommanderView: React.FC<UltronCommanderViewProps> = ({ 
  onBackToFactory,
  totalRevenue = 0,
  directRevenue = 0,
  etsyRevenue = 0
}) => {
  const [selectedAgentName, setSelectedAgentName] = useState('ULTRON');

  const AGENTS_LIST = [
    { name: 'ULTRON', room: 'BRIDGE ROOM', role: 'Station Commander AI', model: 'Gemini 3.8 Flash', drift: '99%', heat: '100%' },
    { name: 'NOVA', room: 'RESEARCH LAB', role: 'Trend Radar & Niche Scout', model: 'Hermes Scout v4', drift: '94%', heat: '88%' },
    { name: 'ORACLE', room: 'RESEARCH LAB', role: 'Niche Predictive Model', model: 'Gemini 3.8 Flash', drift: '91%', heat: '92%' },
    { name: 'VECTOR', room: 'FACTORY 1', role: 'SVG Path Math Generator', model: 'Bezier Core 2.1', drift: '96%', heat: '84%' },
    { name: 'FORGE (ARIA)', room: 'FACTORY 1', role: 'Handmade Digital Creator', model: 'Gemini 3.8 Flash', drift: '98%', heat: '95%' },
    { name: 'ZED', room: 'VAULT', role: 'Cryptographic Packager', model: 'SHA-256 Vault', drift: '99%', heat: '90%' },
    { name: 'REX', room: 'TREASURY', role: 'Elasticity Pricing Matrix', model: 'Revenue Oracle', drift: '93%', heat: '86%' },
    { name: 'SAGE', room: 'NEXUS', role: 'Etsy 13-Tag SEO Master', model: 'Taxonomy AI', drift: '97%', heat: '91%' },
    { name: 'MAYA', room: 'PUBLISHING', role: 'Viral Social Reactor', model: 'Trend Crafter', drift: '92%', heat: '89%' },
    { name: 'KAI', room: 'COMMUNICATIONS', role: 'Autonomous CRM Support', model: 'Empathy Core', drift: '95%', heat: '93%' },
    { name: 'LEO', room: 'TREASURY', role: 'Financial Intelligence', model: 'Audit Engine', drift: '99%', heat: '97%' },
    { name: 'AEGIS', room: 'PERMITS', role: 'Legal & Tax Warranty Guard', model: 'Compliance Core', drift: '100%', heat: '85%' },
  ];

  const currentAgent = AGENTS_LIST.find(a => a.name === selectedAgentName) || AGENTS_LIST[0];

  return (
    <div className="p-4 lg:p-6 space-y-4 font-mono select-none">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playSound('warp');
            onBackToFactory();
          }}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md glow-lime"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO VIDEO GAME FACTORY</span>
        </button>

        <span className="text-xs text-emerald-400 font-bold animate-pulse">
          ● TACTICAL TERMINAL ACTIVE [GRID-05]
        </span>
      </div>

      {/* Main Ultron HUD Screen (Matching image 2) */}
      <div className="rounded-xl border-2 border-emerald-500/60 bg-[#04110a] p-4 lg:p-6 shadow-2xl shadow-emerald-950/80 glow-lime-lg relative overflow-hidden">
        <div className="scanline-overlay opacity-50" />

        {/* Top Green HUD Bar */}
        <div className="border border-emerald-500/40 bg-black/60 rounded p-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-400 font-bold">
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 bg-emerald-500 text-black rounded text-[10px]">ONLINE</span>
            <span>REV: ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-emerald-500/50">|</span>
            <span>ETSY: ${etsyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-emerald-500/50">|</span>
            <span>DIRECT: ${directRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-emerald-500/50">|</span>
            <span className="text-purple-300">AGENT FUEL (3%): ${(totalRevenue * 0.03).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300">13 LINKED</span>
            <span className="px-2 py-0.5 rounded border border-emerald-400 text-emerald-300 text-[10px]">
              MODE: AUTONOMOUS
            </span>
            <span className="text-emerald-300">PWR: 98%</span>
          </div>
        </div>

        {/* 3-Column Tactical Terminal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
          {/* Left Column: Agents List */}
          <div className="md:col-span-3 border border-emerald-500/30 rounded bg-black/50 p-3 space-y-1 max-h-[460px] overflow-y-auto">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest border-b border-emerald-500/30 pb-1 mb-2 flex justify-between">
              <span>AGENTS ({AGENTS_LIST.length})</span>
              <span className="text-[9px] text-emerald-500">ASSIGNMENT</span>
            </div>
            {AGENTS_LIST.map((ag) => (
              <div
                key={ag.name}
                onClick={() => {
                  playSound('click');
                  setSelectedAgentName(ag.name);
                }}
                className={`p-2 rounded cursor-pointer transition-all flex items-center justify-between text-xs ${
                  ag.name === selectedAgentName
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-emerald-400 hover:bg-emerald-950/60'
                }`}
              >
                <span>{ag.name}</span>
                <span className={`text-[9px] ${ag.name === selectedAgentName ? 'text-black' : 'text-emerald-500'}`}>
                  {ag.room}
                </span>
              </div>
            ))}
          </div>

          {/* Center Column: Station Commander Dossier */}
          <div className="md:col-span-5 border border-emerald-500/30 rounded bg-black/50 p-4 space-y-4">
            <div className="border-b border-emerald-500/30 pb-2">
              <span className="text-[10px] text-emerald-500 block uppercase">STATION COMMANDER DOSSIER</span>
              <h2 className="text-xl font-bold text-emerald-300 tracking-wider">
                {currentAgent.name}
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">AGENT CLASS:</span>
                <span className="text-emerald-200 font-bold">HERMES AUTONOMOUS</span>
              </div>
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">MODEL CORE:</span>
                <span className="text-emerald-200 font-bold">{currentAgent.model}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">ROLE:</span>
                <span className="text-emerald-200 font-bold">{currentAgent.role}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">ASSIGNED ROOM:</span>
                <span className="text-emerald-200 font-bold">{currentAgent.room}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">DRIFT TOLERANCE:</span>
                <span className="text-emerald-200 font-bold">{currentAgent.drift}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-950 pb-1">
                <span className="text-emerald-500">OBSERVER HEAT:</span>
                <span className="text-emerald-200 font-bold">{currentAgent.heat}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
              <span className="text-emerald-400 font-bold block mb-1">COMMAND DIRECTIVE:</span>
              Coordinates production priorities, approves critical station decisions, and keeps all agent intent aligned to digital sales yield and zero-dropship compliance.
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => playSound('agent')}
                className="flex-1 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all text-center"
              >
                DISPATCH TEST PING
              </button>
              <button
                onClick={() => playSound('warp')}
                className="px-3 py-2 rounded border border-emerald-500 text-emerald-300 hover:bg-emerald-950 text-xs font-bold"
              >
                CALIBRATE DRIFT
              </button>
            </div>
          </div>

          {/* Right Column: Wireframe Mech Schematic (Matching image 2) */}
          <div className="md:col-span-4 border border-emerald-500/30 rounded bg-black/60 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <span className="text-[10px] text-emerald-500 uppercase tracking-widest self-start">
              CHASSIS TELEMETRY // CYBER MECH
            </span>

            {/* Glowing Wireframe Mech SVG */}
            <div className="my-2 relative">
              <svg width="180" height="260" viewBox="0 0 180 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-400">
                {/* Mech Head */}
                <polygon points="90,15 110,35 105,60 75,60 70,35" stroke="#10b981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.1)" />
                <line x1="82" y1="38" x2="98" y2="38" stroke="#34d399" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #10b981)' }} />
                
                {/* Torso & Core */}
                <polygon points="70,65 110,65 125,120 90,140 55,120" stroke="#10b981" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.1)" />
                <circle cx="90" cy="95" r="14" stroke="#34d399" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.2)" />
                <circle cx="90" cy="95" r="6" fill="#34d399" style={{ filter: 'drop-shadow(0 0 6px #10b981)' }} />

                {/* Shoulders & Arms */}
                <polygon points="50,70 65,70 60,110 35,95" stroke="#10b981" strokeWidth="1.5" />
                <line x1="38" y1="95" x2="25" y2="150" stroke="#10b981" strokeWidth="1.5" />
                <rect x="18" y="150" width="14" height="20" rx="2" stroke="#34d399" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.2)" />

                <polygon points="130,70 115,70 120,110 145,95" stroke="#10b981" strokeWidth="1.5" />
                <line x1="142" y1="95" x2="155" y2="150" stroke="#10b981" strokeWidth="1.5" />
                <rect x="148" y="150" width="14" height="20" rx="2" stroke="#34d399" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.2)" />

                {/* Pelvis & Legs */}
                <polygon points="75,145 105,145 115,170 65,170" stroke="#10b981" strokeWidth="1.5" />
                {/* Left Leg */}
                <line x1="75" y1="170" x2="65" y2="215" stroke="#10b981" strokeWidth="2" />
                <line x1="65" y1="215" x2="60" y2="245" stroke="#10b981" strokeWidth="2" />
                <polygon points="50,245 75,245 80,255 45,255" stroke="#34d399" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.2)" />
                {/* Right Leg */}
                <line x1="105" y1="170" x2="115" y2="215" stroke="#10b981" strokeWidth="2" />
                <line x1="115" y1="215" x2="120" y2="245" stroke="#10b981" strokeWidth="2" />
                <polygon points="110,245 135,245 140,255 105,255" stroke="#34d399" strokeWidth="1.5" fill="rgba(16, 185, 129, 0.2)" />

                {/* HUD Targeting brackets */}
                <path d="M 20 20 L 10 20 L 10 35" stroke="#10b981" strokeWidth="1" />
                <path d="M 160 20 L 170 20 L 170 35" stroke="#10b981" strokeWidth="1" />
                <path d="M 20 240 L 10 240 L 10 225" stroke="#10b981" strokeWidth="1" />
                <path d="M 160 240 L 170 240 L 170 225" stroke="#10b981" strokeWidth="1" />
              </svg>
            </div>

            <div className="w-full text-[10px] text-emerald-400 space-y-0.5 border-t border-emerald-950 pt-2">
              <div className="flex justify-between">
                <span>ARMOR INTEGRITY:</span>
                <span className="font-bold text-emerald-300">100% OK</span>
              </div>
              <div className="flex justify-between">
                <span>CORE FREQUENCY:</span>
                <span className="font-bold text-emerald-300">142.8 GHz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
