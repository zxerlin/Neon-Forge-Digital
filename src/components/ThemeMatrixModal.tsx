import React, { useState } from 'react';
import { 
  Palette, 
  Shuffle, 
  Sparkles, 
  Check, 
  X, 
  Sliders, 
  Layers, 
  RefreshCw,
  Sun,
  Flame,
  Info,
  Bot,
  Type
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { ThemePalette, PRESET_THEMES, DRAMATIC_FONT_STYLES, setActiveTheme } from '../utils/themeManager';
import { playSound } from '../utils/audio';

interface ThemeMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeMatrixModal: React.FC<ThemeMatrixModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme, 
    boxes,
    remix, 
    remixBoxes,
    cycleDramaticFont,
    currentDramaticFont,
    dramaticFontStyles,
    selectPreset, 
    presets, 
    justRemixed 
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'remix' | 'presets' | 'boxes' | 'custom'>('remix');

  // Custom tuner state
  const [customBgHue, setCustomBgHue] = useState(215);
  const [customBgDarkness, setCustomBgDarkness] = useState(3.5);
  const [customAccentHue, setCustomAccentHue] = useState(185);

  if (!isOpen) return null;

  const handleApplyCustomTuner = () => {
    playSound('agent');
    const bgVoid = `hsl(${customBgHue}, 45%, ${customBgDarkness}%)`;
    const bgSurface = `hsl(${customBgHue}, 45%, ${(customBgDarkness + 1.8).toFixed(1)}%)`;
    const bgCard = `hsl(${customBgHue}, 45%, ${(customBgDarkness + 3.8).toFixed(1)}%)`;
    const bgElevated = `hsl(${customBgHue}, 45%, ${(customBgDarkness + 6.2).toFixed(1)}%)`;
    const borderTheme = `hsla(${customBgHue}, 35%, ${(customBgDarkness + 15).toFixed(1)}%, 0.45)`;

    const h1 = customAccentHue;
    const h2 = (h1 + 120) % 360;
    const h3 = (h1 + 240) % 360;
    const h4 = (h1 + 60) % 360;
    const h5 = (h1 + 180) % 360;
    const h6 = (h1 + 300) % 360;
    const h7 = (h1 + 45) % 360;

    const customTheme: ThemePalette = {
      id: `custom-tuner-${Date.now()}`,
      name: `Custom Tuner Matrix (${customBgHue}° / ${customAccentHue}°)`,
      code: `TUNE-${customBgHue}`,
      comboNumber: Math.floor(10000 + Math.random() * 900000),
      bgVoid,
      bgSurface,
      bgCard,
      bgElevated,
      borderTheme,
      borderGlow: `hsla(${h1}, 100%, 50%, 0.45)`,
      neonCyan: `hsl(${h1}, 100%, 50%)`,
      neonMagenta: `hsl(${h2}, 98%, 52%)`,
      neonLime: `hsl(${h3}, 95%, 50%)`,
      neonAmber: `hsl(${h4}, 100%, 50%)`,
      neonPurple: `hsl(${h5}, 95%, 55%)`,
      neonBlue: `hsl(${h6}, 95%, 55%)`,
      neonRed: `hsl(${h7}, 100%, 54%)`,
      heatmapScale: [bgCard, `hsl(${h1}, 80%, 25%)`, `hsl(${h1}, 100%, 45%)`, `hsl(${h2}, 100%, 60%)`, '#ffffff'],
      isRemixed: true
    };

    setActiveTheme(customTheme);
    remixBoxes();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.neonCyan
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: theme.borderTheme }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.neonCyan,
                boxShadow: `0 0 15px ${theme.borderGlow}`
              }}
            >
              <Palette className="w-5 h-5 animate-pulse" style={{ color: theme.neonCyan }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-mono font-bold uppercase text-white tracking-wide">
                  Color Matrix Remix Engine
                </h3>
                <span 
                  className="px-2 py-0.5 text-[10px] font-mono rounded font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.bgCard,
                    color: theme.neonCyan,
                    borderColor: theme.neonCyan
                  }}
                >
                  100,000+ Combinations
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Remix everything: the void black canvas, 9 factory boxes, tiny robots, machinery, D3 heatmaps, and dramatic underneath typography.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Scheme Banner */}
        <div 
          className="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ 
            backgroundColor: theme.bgVoid,
            borderColor: theme.borderTheme 
          }}
        >
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>Active Palette:</span>
              <span className="font-bold text-white font-mono">{theme.name}</span>
              <span 
                className="px-1.5 py-0.2 rounded text-[10px] font-mono"
                style={{ backgroundColor: theme.bgCard, color: theme.neonLime }}
              >
                Combo #{theme.comboNumber.toLocaleString()}
              </span>
              <span 
                className="px-1.5 py-0.2 rounded text-[10px] font-mono border"
                style={{ 
                  color: currentDramaticFont.labelColor,
                  borderColor: currentDramaticFont.labelColor,
                  textShadow: currentDramaticFont.textShadow
                }}
              >
                Font: {currentDramaticFont.name}
              </span>
            </div>

            {/* Swatches Row */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 mr-1">Tones:</span>
              <span 
                className="w-5 h-5 rounded border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.bgVoid }} 
                title={`Void Background: ${theme.bgVoid}`}
              />
              <span 
                className="w-5 h-5 rounded border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.bgCard }} 
                title={`Card Surface: ${theme.bgCard}`}
              />
              <div className="h-4 w-px bg-white/20 mx-1" />
              <span 
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.neonCyan }} 
                title={`Primary Neon: ${theme.neonCyan}`}
              />
              <span 
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.neonMagenta }} 
                title={`Secondary Neon: ${theme.neonMagenta}`}
              />
              <span 
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.neonLime }} 
                title={`Tertiary Neon: ${theme.neonLime}`}
              />
              <span 
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.neonAmber }} 
                title={`Amber Accent: ${theme.neonAmber}`}
              />
              <span 
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: theme.neonPurple }} 
                title={`Purple Accent: ${theme.neonPurple}`}
              />
            </div>
          </div>

          {/* Quick Shuffle Buttons in Banner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => remix()}
              className="px-4 py-2 rounded-xl font-mono text-xs font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonMagenta})`,
                color: currentDramaticFont.badgeTextColor,
                textShadow: currentDramaticFont.badgeTextShadow
              }}
            >
              <Shuffle className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>REMIX ALL 🎲</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-3 border-b flex items-center gap-2 overflow-x-auto" style={{ borderColor: theme.borderTheme }}>
          <button
            onClick={() => setActiveTab('remix')}
            className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'remix'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Procedural Remix Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('boxes')}
            className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'boxes'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Boxes, Robots & Dramatic Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Cyber Presets ({presets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Fine-Tune Sliders</span>
          </button>
        </div>

        {/* Body Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'remix' && (
            <div className="space-y-4">
              <div 
                className="p-5 rounded-xl border text-center space-y-3 relative overflow-hidden"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderGlow
                }}
              >
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-1">
                  <Sparkles className="w-8 h-8" style={{ color: theme.neonCyan }} />
                </div>
                <h4 className="font-mono text-base font-bold text-white">
                  Infinite Cyber Combinations Generator
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Every click mathematically computes a brand new harmonic color matrix: procedural dark void canvas tint (0°-360° hue), all 9 factory chamber boxes, robots, conveyor goods, and dramatic glowing underneath typography.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => remix()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})`,
                      color: currentDramaticFont.badgeTextColor,
                      textShadow: currentDramaticFont.badgeTextShadow
                    }}
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>REMIX EVERYTHING NOW 🎲</span>
                  </button>

                  <button
                    onClick={() => selectPreset('classic-neonforge')}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl font-mono text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Reset to Classic NeonForge
                  </button>
                </div>

                {justRemixed && (
                  <div 
                    className="mt-2 text-xs font-mono font-bold animate-bounce"
                    style={{ color: theme.neonLime }}
                  >
                    ✓ Remixed to {theme.name} (Seed #{theme.comboNumber})!
                  </div>
                )}
              </div>

              {/* D3 Heatmap Color Ramp Preview */}
              <div 
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderTheme
                }}
              >
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Active D3 Heatmap Color Scale Preview:
                </span>
                <div className="h-6 rounded-lg border border-white/20 overflow-hidden flex shadow-inner">
                  {theme.heatmapScale.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="flex-1 h-full flex items-center justify-center text-[9px] font-mono font-bold text-black/80" 
                      style={{ backgroundColor: color }}
                    >
                      {idx === 0 ? 'Min $0' : idx === theme.heatmapScale.length - 1 ? 'Peak High' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOXES, ROBOTS & DRAMATIC FONTS TAB */}
          {activeTab === 'boxes' && (
            <div className="space-y-4">
              {/* Dramatic Font Underneath Selector */}
              <div 
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderTheme
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                      Dramatic Underneath Font Styles ({dramaticFontStyles.length} Modes)
                    </h4>
                  </div>
                  <button
                    onClick={() => cycleDramaticFont()}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded border hover:bg-white/10 transition-colors"
                    style={{ color: currentDramaticFont.labelColor, borderColor: currentDramaticFont.labelColor }}
                  >
                    Cycle Next Font ↻
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Select how the text underneath factory machines, robot speech bubbles, chassis codes, and KPI labels is rendered for a high-drama visual effect:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dramaticFontStyles.map((f) => {
                    const isSelected = currentDramaticFont.id === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => cycleDramaticFont()}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? 'ring-2' : 'hover:bg-white/5'
                        }`}
                        style={{
                          backgroundColor: theme.bgSurface,
                          borderColor: isSelected ? f.labelColor : theme.borderTheme
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-white">{f.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" style={{ color: f.labelColor }} />}
                        </div>
                        <div 
                          className="text-xs font-black font-mono tracking-wider"
                          style={{
                            color: f.valueColor,
                            textShadow: f.textShadow,
                            letterSpacing: f.letterSpacing
                          }}
                        >
                          CYBERPUNK MATRIX FONT PREVIEW
                        </div>
                        <div 
                          className="text-[10px] font-mono mt-0.5"
                          style={{ color: f.statusColor, textShadow: f.statusTextShadow }}
                        >
                          ● 3D MATRIX ACTIVE (100% HEALTH)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9 Factory Boxes & Robots Preview */}
              <div 
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.borderTheme
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-lime-400" />
                    <h4 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                      Current 9 Factory Boxes & Robots
                    </h4>
                  </div>
                  <button
                    onClick={() => remixBoxes()}
                    className="px-3 py-1 rounded-lg font-mono text-xs font-bold text-black shadow-md flex items-center gap-1.5"
                    style={{ background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})` }}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Remix Boxes 🤖🎲</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {boxes.map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-lg border flex flex-col justify-between"
                      style={{
                        backgroundColor: b.boxBg,
                        borderColor: b.boxBorder,
                        boxShadow: `0 0 10px ${b.boxBorder}40`
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                        <span 
                          className="px-1.5 py-0.2 rounded" 
                          style={{ backgroundColor: b.badgeBg, color: b.badgeText, textShadow: b.badgeTextShadow }}
                        >
                          BOX #{b.id}
                        </span>
                        <span style={{ color: b.robot.eye }}>{b.robot.main}</span>
                      </div>

                      <div className="flex items-center gap-1.5 my-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.robot.main }} title="Robot Armor" />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.robot.eye }} title="Robot Visor Eyes" />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.robot.reactor }} title="Chest Reactor" />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.conveyorItems[0] }} title="Conveyor Goods" />
                      </div>

                      <div 
                        className="text-[9px] font-mono font-bold truncate mt-1"
                        style={{ color: b.fontUnderneath.valueColor, textShadow: b.fontUnderneath.textShadow }}
                      >
                        Underneath: High Drama
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {presets.map((p) => {
                const isSelected = theme.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                      isSelected ? 'ring-2' : 'hover:scale-[1.02]'
                    }`}
                    style={{
                      backgroundColor: p.bgCard,
                      borderColor: isSelected ? p.neonCyan : p.borderTheme,
                      boxShadow: isSelected ? `0 0 20px ${p.borderGlow}` : undefined
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-white truncate pr-2">
                          {p.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: p.neonCyan }} />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mb-2">
                        {p.code} · #{p.comboNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <span 
                          className="w-4 h-4 rounded border border-white/20" 
                          style={{ backgroundColor: p.bgVoid }} 
                          title="Void Tone"
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: p.neonCyan }} 
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: p.neonMagenta }} 
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: p.neonLime }} 
                        />
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: p.neonAmber }} 
                        />
                      </div>

                      {/* Mini Heatmap Strip */}
                      <div className="h-1.5 w-full rounded-full overflow-hidden flex">
                        {p.heatmapScale.map((c, i) => (
                          <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'custom' && (
            <div 
              className="p-5 rounded-xl border space-y-4"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.borderTheme
              }}
            >
              <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Manual Chromatic Frequency Tuner</span>
              </h4>

              {/* Background Hue */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Background Void Tint Hue</span>
                  <span className="text-cyan-400 font-bold">{customBgHue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={customBgHue}
                  onChange={(e) => setCustomBgHue(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500"
                />
              </div>

              {/* Background Darkness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Void Lightness Level (Dark Cyber Threshold)</span>
                  <span className="text-cyan-400 font-bold">{customBgDarkness}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.5"
                  step="0.1"
                  value={customBgDarkness}
                  onChange={(e) => setCustomBgDarkness(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Primary Accent Hue */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Primary Neon Accent Frequency</span>
                  <span className="text-cyan-400 font-bold">{customAccentHue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={customAccentHue}
                  onChange={(e) => setCustomAccentHue(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-cyan-400 via-fuchsia-400 via-yellow-400 to-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleApplyCustomTuner}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-black flex items-center gap-2 transition-transform active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})`
                  }}
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Apply Chromatic Calibration</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex items-center justify-between text-xs font-mono text-slate-400"
          style={{ borderColor: theme.borderTheme, backgroundColor: theme.bgVoid }}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Boxes, robots, and dramatic fonts are persisted across sessions.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-700 hover:bg-white/10 text-white transition-colors"
          >
            Close Matrix Studio
          </button>
        </div>
      </div>
    </div>
  );
};
