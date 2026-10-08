import React, { useState } from 'react';
import { playSound } from '../utils/audio';

export interface TinyRobotPalette {
  main: string;
  dark: string;
  eye: string;
  glow: string;
  reactor?: string;
  antenna?: string;
  cargo?: string;
  bubbleBg?: string;
  bubbleText?: string;
  bubbleTextShadow?: string;
}

export interface TinyRobotProps {
  name: string;
  role: string;
  color?: 'cyan' | 'magenta' | 'lime' | 'amber' | 'purple' | 'blue' | 'red' | 'emerald';
  customPalette?: TinyRobotPalette;
  speechText?: string;
  hasCargo?: boolean;
  cargoColor?: string;
  isPatrolling?: boolean;
  onClick?: () => void;
}

export const TinyRobot: React.FC<TinyRobotProps> = ({
  name,
  role,
  color = 'cyan',
  customPalette,
  speechText,
  hasCargo = false,
  cargoColor = '#00f0ff',
  isPatrolling = true,
  onClick
}) => {
  const [bubbleVisible, setBubbleVisible] = useState(true);

  const defaultPalettes: Record<string, TinyRobotPalette> = {
    cyan: { main: '#00f0ff', dark: '#083344', eye: '#38bdf8', glow: 'rgba(0, 240, 255, 0.8)', bubbleBg: '#00f0ff', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#00f0ff', antenna: '#00f0ff', cargo: '#38bdf8' },
    magenta: { main: '#ff007f', dark: '#4a0429', eye: '#f43f5e', glow: 'rgba(255, 0, 127, 0.8)', bubbleBg: '#ff007f', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#ff007f', antenna: '#ff007f', cargo: '#f43f5e' },
    lime: { main: '#39ff14', dark: '#143805', eye: '#4ade80', glow: 'rgba(57, 255, 20, 0.8)', bubbleBg: '#39ff14', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#39ff14', antenna: '#39ff14', cargo: '#4ade80' },
    amber: { main: '#ffb700', dark: '#451a03', eye: '#fbbf24', glow: 'rgba(255, 183, 0, 0.8)', bubbleBg: '#ffb700', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#ffb700', antenna: '#ffb700', cargo: '#fbbf24' },
    purple: { main: '#b026ff', dark: '#2e1065', eye: '#c084fc', glow: 'rgba(176, 38, 255, 0.8)', bubbleBg: '#b026ff', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#b026ff', antenna: '#b026ff', cargo: '#c084fc' },
    blue: { main: '#3b82f6', dark: '#172554', eye: '#60a5fa', glow: 'rgba(59, 130, 246, 0.8)', bubbleBg: '#3b82f6', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#3b82f6', antenna: '#3b82f6', cargo: '#60a5fa' },
    red: { main: '#ff3344', dark: '#450a0a', eye: '#f87171', glow: 'rgba(255, 51, 68, 0.8)', bubbleBg: '#ff3344', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#ff3344', antenna: '#ff3344', cargo: '#f87171' },
    emerald: { main: '#10b981', dark: '#064e3b', eye: '#34d399', glow: 'rgba(16, 185, 129, 0.8)', bubbleBg: '#10b981', bubbleText: '#040711', bubbleTextShadow: '0 0 6px rgba(255, 255, 255, 0.8)', reactor: '#10b981', antenna: '#10b981', cargo: '#34d399' }
  };

  const pal = customPalette || defaultPalettes[color] || defaultPalettes.cyan;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('agent');
    setBubbleVisible(prev => !prev);
    if (onClick) onClick();
  };

  const bubbleBackground = pal.bubbleBg || pal.main;
  const bubbleTextColor = pal.bubbleText || '#ffffff';
  const bubbleShadow = pal.bubbleTextShadow || 'none';
  const activeCargoColor = cargoColor || pal.cargo || pal.main;

  return (
    <div 
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center cursor-pointer group select-none ${isPatrolling ? 'robot-patrol' : ''}`}
      title={`${name} (${role}) - Click to inspect agent`}
    >
      {/* Robot Speech Bubble */}
      {speechText && bubbleVisible && (
        <div 
          className="absolute -top-7 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black shadow-lg animate-bounce pointer-events-none whitespace-nowrap z-30 transition-all border border-white/20"
          style={{ 
            backgroundColor: bubbleBackground, 
            color: bubbleTextColor,
            textShadow: bubbleShadow,
            boxShadow: `0 0 12px ${pal.glow}` 
          }}
        >
          {speechText}
          <div 
            className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px]"
            style={{ borderTopColor: bubbleBackground }}
          />
        </div>
      )}

      {/* Tiny 2D Robot Sprite SVG */}
      <div className="relative robot-walk">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <line x1="17" y1="2" x2="17" y2="7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="2" r="2.5" fill={pal.antenna || pal.main} style={{ filter: `drop-shadow(0 0 5px ${pal.glow})` }} />

          {/* Robot Head */}
          <rect x="7" y="7" width="20" height="13" rx="4" fill="#0b1120" stroke={pal.main} strokeWidth="1.5" />
          
          {/* Glowing Visor / Eyes */}
          <rect x="10" y="11" width="14" height="5" rx="2" fill="#020617" />
          <circle cx="13" cy="13.5" r="1.5" fill={pal.eye} style={{ filter: `drop-shadow(0 0 4px ${pal.eye})` }} />
          <circle cx="21" cy="13.5" r="1.5" fill={pal.eye} style={{ filter: `drop-shadow(0 0 4px ${pal.eye})` }} />

          {/* Robot Neck */}
          <rect x="14" y="20" width="6" height="2" fill="#475569" />

          {/* Robot Torso / Chassis */}
          <rect x="6" y="22" width="22" height="13" rx="3" fill="#151e2e" stroke={pal.main} strokeWidth="1" />
          
          {/* Chest Reactor Light */}
          <circle cx="17" cy="28.5" r="3.5" fill={pal.dark} stroke={pal.main} strokeWidth="1" />
          <circle cx="17" cy="28.5" r="1.8" fill={pal.reactor || pal.main} style={{ filter: `drop-shadow(0 0 6px ${pal.reactor || pal.glow})` }} />

          {/* Blinking Mini LEDs */}
          <circle cx="10" cy="26" r="1" fill="#22c55e" />
          <circle cx="24" cy="26" r="1" fill="#eab308" />

          {/* Tiny Left Arm */}
          <path d="M 6 24 L 2 28 L 3 32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

          {/* Tiny Right Arm (or holding cargo) */}
          {hasCargo ? (
            <>
              <path d="M 28 24 L 32 28" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              {/* Glowing Cargo Crate / Disc */}
              <rect x="22" y="26" width="9" height="7" rx="1.5" fill="#020617" stroke={activeCargoColor} strokeWidth="1" style={{ filter: `drop-shadow(0 0 6px ${activeCargoColor})` }} />
              <line x1="24" y1="29.5" x2="29" y2="29.5" stroke={activeCargoColor} strokeWidth="1" />
            </>
          ) : (
            <path d="M 28 24 L 32 28 L 31 32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Treads / Boots */}
          <rect x="8" y="35" width="7" height="5" rx="1.5" fill="#0f172a" stroke={pal.main} strokeWidth="1" />
          <rect x="19" y="35" width="7" height="5" rx="1.5" fill="#0f172a" stroke={pal.main} strokeWidth="1" />
          <line x1="9" y1="38" x2="14" y2="38" stroke="#64748b" strokeWidth="1" />
          <line x1="20" y1="38" x2="25" y2="38" stroke="#64748b" strokeWidth="1" />
        </svg>
      </div>

      {/* Name Tag */}
      <span 
        className="mt-0.5 text-[9px] font-mono font-bold tracking-tight px-1.5 py-0.2 rounded border shadow-sm transition-colors"
        style={{
          backgroundColor: '#05070e',
          color: pal.eye || pal.main,
          borderColor: `${pal.main}60`
        }}
      >
        {name}
      </span>
    </div>
  );
};
