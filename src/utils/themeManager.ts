/**
 * NeonForge OS - Color Matrix & Dynamic Theme Engine
 * Generates thousands of mathematically harmonic cyberpunk color combinations,
 * including tinted dark void/black backgrounds, 7-slot neon accent hierarchies,
 * matching D3 heatmap color ramps, full 9-box and robot chamber remixes,
 * and dramatic glowing typography for all underneath fonts.
 */

export interface DramaticFontStyle {
  id: string;
  name: string;
  labelColor: string;
  valueColor: string;
  textShadow: string;
  letterSpacing: string;
  badgeTextColor: string;
  badgeTextShadow: string;
  statusColor: string;
  statusTextShadow: string;
}

export const DRAMATIC_FONT_STYLES: DramaticFontStyle[] = [
  {
    id: 'cyan-laser',
    name: 'Electric Cyan Laser Glow',
    labelColor: '#38bdf8',
    valueColor: '#ffffff',
    textShadow: '0 0 8px #00f0ff, 0 0 18px rgba(0, 240, 255, 0.75)',
    letterSpacing: '0.06em',
    badgeTextColor: '#020617',
    badgeTextShadow: '0 0 6px rgba(255, 255, 255, 0.85)',
    statusColor: '#00f0ff',
    statusTextShadow: '0 0 8px #00f0ff'
  },
  {
    id: 'gold-plasma',
    name: 'Solar Gold Plasma',
    labelColor: '#fcd34d',
    valueColor: '#fffbeb',
    textShadow: '0 0 8px #fbbf24, 0 0 20px rgba(245, 158, 11, 0.8)',
    letterSpacing: '0.07em',
    badgeTextColor: '#1c1002',
    badgeTextShadow: '0 0 6px rgba(255, 240, 180, 0.9)',
    statusColor: '#fbbf24',
    statusTextShadow: '0 0 8px #fbbf24'
  },
  {
    id: 'acid-matrix',
    name: 'Toxic Acid Matrix',
    labelColor: '#bef264',
    valueColor: '#f7fee7',
    textShadow: '0 0 8px #a3e635, 0 0 20px rgba(132, 204, 22, 0.8)',
    letterSpacing: '0.08em',
    badgeTextColor: '#061302',
    badgeTextShadow: '0 0 6px rgba(217, 249, 157, 0.9)',
    statusColor: '#39ff14',
    statusTextShadow: '0 0 10px #39ff14'
  },
  {
    id: 'synthwave-pulse',
    name: 'Ultraviolet Synthwave Pulse',
    labelColor: '#f472b6',
    valueColor: '#fdf4ff',
    textShadow: '0 0 8px #f43f5e, 0 0 22px rgba(192, 38, 211, 0.85)',
    letterSpacing: '0.07em',
    badgeTextColor: '#18041a',
    badgeTextShadow: '0 0 6px rgba(253, 232, 255, 0.9)',
    statusColor: '#e879f9',
    statusTextShadow: '0 0 10px #e879f9'
  },
  {
    id: 'chromatic-glitch',
    name: 'Chromatic Glitch Halo',
    labelColor: '#cbd5e1',
    valueColor: '#ffffff',
    textShadow: '-1.5px -1.5px 0 #00f0ff, 1.5px 1.5px 0 #ff007f, 0 0 10px rgba(255, 255, 255, 0.7)',
    letterSpacing: '0.1em',
    badgeTextColor: '#040711',
    badgeTextShadow: '-1px 0 0 #00f0ff, 1px 0 0 #ff007f',
    statusColor: '#38bdf8',
    statusTextShadow: '-1px 0 0 #00f0ff, 1px 0 0 #ff007f'
  },
  {
    id: 'crimson-core',
    name: 'Molten Crimson Core',
    labelColor: '#fda4af',
    valueColor: '#fff1f2',
    textShadow: '0 0 8px #ff3344, 0 0 20px rgba(225, 29, 72, 0.8)',
    letterSpacing: '0.06em',
    badgeTextColor: '#190306',
    badgeTextShadow: '0 0 6px rgba(255, 200, 210, 0.9)',
    statusColor: '#ff3344',
    statusTextShadow: '0 0 10px #ff3344'
  }
];

export interface BoxRobotTheme {
  id: number;
  boxBg: string;
  boxBgHover: string;
  boxBorder: string;
  boxBorderHover: string;
  boxGlow: string;
  extrudedRimColor: string;
  hologramColor: string;
  badgeBg: string;
  badgeText: string;
  badgeTextShadow: string;
  machineBg: string;
  machineBorder: string;
  machineIconColor: string;
  machineGlow: string;
  platformFloorBg: string;
  hazardColor1: string;
  hazardColor2: string;
  conveyorBg: string;
  conveyorBorder: string;
  conveyorItems: [string, string, string];
  robot: {
    main: string;
    dark: string;
    eye: string;
    glow: string;
    reactor: string;
    antenna: string;
    cargo: string;
    bubbleBg: string;
    bubbleText: string;
    bubbleTextShadow: string;
  };
  fontUnderneath: {
    labelColor: string;
    valueColor: string;
    textShadow: string;
    letterSpacing: string;
    statusColor: string;
    statusTextShadow: string;
  };
}

export interface ThemePalette {
  id: string;
  name: string;
  code: string;
  comboNumber: number;
  bgVoid: string;        // Deepest canvas background (the "black" background)
  bgSurface: string;     // Navbar, sidebar, panel shells
  bgCard: string;        // Card & table bodies
  bgElevated: string;    // Dropdowns, modals, highlighted rows
  borderTheme: string;   // Subtle structural border
  borderGlow: string;    // Intense accent border
  neonCyan: string;      // Primary electric accent
  neonMagenta: string;   // Secondary electric accent
  neonLime: string;      // Tertiary electric accent
  neonAmber: string;     // Quaternary electric accent
  neonPurple: string;    // Quinary electric accent
  neonBlue: string;      // Senary electric accent
  neonRed: string;       // Septenary electric accent
  heatmapScale: string[]; // 5-stop color gradient for D3 heatmaps
  isRemixed?: boolean;
}

export const HIGH_CONTRAST_MONOCHROME_THEME: ThemePalette = {
  id: 'high-contrast-technical',
  name: 'High-Contrast Technical (Monochrome)',
  code: 'TECH-MONO-HC',
  comboNumber: 99999,
  bgVoid: '#000000',
  bgSurface: '#080808',
  bgCard: '#111111',
  bgElevated: '#1c1c1c',
  borderTheme: '#404040',
  borderGlow: '#ffffff',
  neonCyan: '#ffffff',
  neonMagenta: '#e4e4e7',
  neonLime: '#d4d4d8',
  neonAmber: '#f4f4f5',
  neonPurple: '#a1a1aa',
  neonBlue: '#ffffff',
  neonRed: '#ffffff',
  heatmapScale: ['#111111', '#3f3f46', '#71717a', '#d4d4d8', '#ffffff']
};

export const PRESET_THEMES: ThemePalette[] = [
  HIGH_CONTRAST_MONOCHROME_THEME,
  {
    id: 'classic-neonforge',
    name: 'Classic NeonForge OS',
    code: 'CYBER-001',
    comboNumber: 1042,
    bgVoid: '#05070c',
    bgSurface: '#07090e',
    bgCard: '#090d18',
    bgElevated: '#0e1526',
    borderTheme: 'rgba(51, 65, 85, 0.45)',
    borderGlow: 'rgba(0, 240, 255, 0.4)',
    neonCyan: '#00f0ff',
    neonMagenta: '#ff007f',
    neonLime: '#39ff14',
    neonAmber: '#ffb700',
    neonPurple: '#b026ff',
    neonBlue: '#3b82f6',
    neonRed: '#ff3344',
    heatmapScale: ['#090d18', '#004753', '#00a8b5', '#00f0ff', '#ffffff']
  },
  {
    id: 'obsidian-emerald',
    name: 'Obsidian Emerald Matrix',
    code: 'BIO-MATRIX-07',
    comboNumber: 18492,
    bgVoid: '#020d07',
    bgSurface: '#04140c',
    bgCard: '#061c11',
    bgElevated: '#0a2618',
    borderTheme: 'rgba(16, 185, 129, 0.25)',
    borderGlow: 'rgba(57, 255, 20, 0.5)',
    neonCyan: '#00ffc4',
    neonMagenta: '#00ff66',
    neonLime: '#39ff14',
    neonAmber: '#ccff00',
    neonPurple: '#10b981',
    neonBlue: '#06b6d4',
    neonRed: '#10e050',
    heatmapScale: ['#061c11', '#064e3b', '#059669', '#34d399', '#a7f3d0']
  },
  {
    id: 'tokyo-midnight',
    name: 'Tokyo Midnight Syndicate',
    code: 'SHINJUKU-2099',
    comboNumber: 47219,
    bgVoid: '#090412',
    bgSurface: '#0f071f',
    bgCard: '#150a2b',
    bgElevated: '#1e0f3d',
    borderTheme: 'rgba(168, 85, 247, 0.3)',
    borderGlow: 'rgba(217, 70, 239, 0.45)',
    neonCyan: '#38bdf8',
    neonMagenta: '#e879f9',
    neonLime: '#a855f7',
    neonAmber: '#f43f5e',
    neonPurple: '#c084fc',
    neonBlue: '#6366f1',
    neonRed: '#fb7185',
    heatmapScale: ['#150a2b', '#4c1d95', '#7c3aed', '#c084fc', '#fdf4ff']
  },
  {
    id: 'blood-moon-void',
    name: 'Blood Moon Syndicate',
    code: 'CRIMSON-EXEC',
    comboNumber: 62804,
    bgVoid: '#0f0306',
    bgSurface: '#17060a',
    bgCard: '#21080f',
    bgElevated: '#2d0c15',
    borderTheme: 'rgba(244, 63, 94, 0.3)',
    borderGlow: 'rgba(255, 51, 68, 0.5)',
    neonCyan: '#fb7185',
    neonMagenta: '#ff0055',
    neonLime: '#f59e0b',
    neonAmber: '#fbbf24',
    neonPurple: '#e11d48',
    neonBlue: '#be123c',
    neonRed: '#ff3344',
    heatmapScale: ['#21080f', '#881337', '#e11d48', '#fb7185', '#ffe4e6']
  },
  {
    id: 'cyberpunk-night-city',
    name: 'Night City High-Voltage',
    code: 'VOLT-GOLD-88',
    comboNumber: 83921,
    bgVoid: '#0c0a03',
    bgSurface: '#141105',
    bgCard: '#1d1908',
    bgElevated: '#2a240c',
    borderTheme: 'rgba(234, 179, 8, 0.3)',
    borderGlow: 'rgba(255, 183, 0, 0.5)',
    neonCyan: '#ffe600',
    neonMagenta: '#ff0055',
    neonLime: '#a3e635',
    neonAmber: '#ffb700',
    neonPurple: '#c026d3',
    neonBlue: '#00f0ff',
    neonRed: '#ff2200',
    heatmapScale: ['#1d1908', '#713f12', '#ca8a04', '#facc15', '#fef9c3']
  },
  {
    id: 'deep-abyssal-ocean',
    name: 'Deep Abyssal Trench',
    code: 'MARIANA-VOID',
    comboNumber: 31054,
    bgVoid: '#020912',
    bgSurface: '#04101e',
    bgCard: '#06172a',
    bgElevated: '#0a213b',
    borderTheme: 'rgba(14, 165, 233, 0.3)',
    borderGlow: 'rgba(0, 240, 255, 0.45)',
    neonCyan: '#00f5ff',
    neonMagenta: '#0ea5e9',
    neonLime: '#2dd4bf',
    neonAmber: '#38bdf8',
    neonPurple: '#6366f1',
    neonBlue: '#0284c7',
    neonRed: '#f43f5e',
    heatmapScale: ['#06172a', '#0c4a6e', '#0284c7', '#38bdf8', '#e0f2fe']
  },
  {
    id: 'synthwave-sunset',
    name: 'Miami 1984 Synthwave',
    code: 'RETRO-WAVE-84',
    comboNumber: 94103,
    bgVoid: '#0b040e',
    bgSurface: '#130718',
    bgCard: '#1c0a24',
    bgElevated: '#280e33',
    borderTheme: 'rgba(236, 72, 153, 0.3)',
    borderGlow: 'rgba(255, 0, 127, 0.5)',
    neonCyan: '#00f0ff',
    neonMagenta: '#ff00a0',
    neonLime: '#f472b6',
    neonAmber: '#fb923c',
    neonPurple: '#a855f7',
    neonBlue: '#3b82f6',
    neonRed: '#f43f5e',
    heatmapScale: ['#1c0a24', '#831843', '#db2777', '#f472b6', '#fdf2f8']
  },
  {
    id: 'arctic-frost-protocol',
    name: 'Cryo Frost Protocol',
    code: 'ZERO-KELVIN',
    comboNumber: 15940,
    bgVoid: '#03080e',
    bgSurface: '#06101c',
    bgCard: '#0a1728',
    bgElevated: '#0f223a',
    borderTheme: 'rgba(186, 230, 253, 0.25)',
    borderGlow: 'rgba(56, 189, 248, 0.45)',
    neonCyan: '#7dd3fc',
    neonMagenta: '#38bdf8',
    neonLime: '#a5f3fc',
    neonAmber: '#e0f2fe',
    neonPurple: '#818cf8',
    neonBlue: '#60a5fa',
    neonRed: '#f87171',
    heatmapScale: ['#0a1728', '#075985', '#0284c7', '#7dd3fc', '#f0f9ff']
  },
  {
    id: 'toxic-acid-grid',
    name: 'Toxic Acid Cyberware',
    code: 'HAZARD-99',
    comboNumber: 52084,
    bgVoid: '#060a02',
    bgSurface: '#0b1204',
    bgCard: '#111a06',
    bgElevated: '#1a270a',
    borderTheme: 'rgba(132, 204, 22, 0.3)',
    borderGlow: 'rgba(163, 230, 53, 0.5)',
    neonCyan: '#bef264',
    neonMagenta: '#84cc16',
    neonLime: '#4ade80',
    neonAmber: '#eab308',
    neonPurple: '#65a30d',
    neonBlue: '#22c55e',
    neonRed: '#ef4444',
    heatmapScale: ['#111a06', '#365314', '#65a30d', '#a3e635', '#ecfccb']
  }
];

// Helper to generate a complete single Box & Robot Theme
export function generateSingleBoxTheme(roomId: number, baseHue?: number, fontStyle?: DramaticFontStyle): BoxRobotTheme {
  const h = baseHue !== undefined ? baseHue : Math.floor(Math.random() * 360);
  const hAlt = (h + 120) % 360;
  const hTriad = (h + 240) % 360;
  const hComp = (h + 180) % 360;

  const font = fontStyle || DRAMATIC_FONT_STYLES[Math.floor(Math.random() * DRAMATIC_FONT_STYLES.length)];

  const mainColor = `hsl(${h}, 100%, 50%)`;
  const eyeColor = `hsl(${hAlt}, 100%, 60%)`;
  const reactorColor = `hsl(${hComp}, 100%, 55%)`;
  const darkFrame = `hsl(${h}, 50%, 12%)`;
  const boxBg = `hsl(${h}, 35%, 4%)`;
  const boxBgHover = `hsl(${h}, 45%, 7%)`;
  const boxBorder = `hsl(${h}, 90%, 48%)`;
  const boxBorderHover = `hsl(${h}, 100%, 65%)`;

  return {
    id: roomId,
    boxBg,
    boxBgHover,
    boxBorder,
    boxBorderHover,
    boxGlow: `0 0 25px hsla(${h}, 100%, 50%, 0.45)`,
    extrudedRimColor: `hsla(${h}, 100%, 50%, 0.4)`,
    hologramColor: mainColor,
    badgeBg: mainColor,
    badgeText: font.badgeTextColor,
    badgeTextShadow: font.badgeTextShadow,
    machineBg: `hsla(${h}, 100%, 50%, 0.16)`,
    machineBorder: mainColor,
    machineIconColor: mainColor,
    machineGlow: `0 0 20px hsla(${h}, 100%, 50%, 0.55)`,
    platformFloorBg: `hsl(${h}, 30%, 3%)`,
    hazardColor1: mainColor,
    hazardColor2: '#050505',
    conveyorBg: '#090d16',
    conveyorBorder: `hsla(${h}, 100%, 50%, 0.35)`,
    conveyorItems: [mainColor, eyeColor, reactorColor],
    robot: {
      main: mainColor,
      dark: darkFrame,
      eye: eyeColor,
      glow: `hsla(${h}, 100%, 50%, 0.85)`,
      reactor: reactorColor,
      antenna: mainColor,
      cargo: `hsl(${hTriad}, 100%, 55%)`,
      bubbleBg: mainColor,
      bubbleText: font.badgeTextColor,
      bubbleTextShadow: font.badgeTextShadow
    },
    fontUnderneath: {
      labelColor: font.labelColor,
      valueColor: font.valueColor,
      textShadow: font.textShadow,
      letterSpacing: font.letterSpacing,
      statusColor: font.statusColor,
      statusTextShadow: font.statusTextShadow
    }
  };
}

// Generates 9 distinct, coordinated box and robot themes
export function generateRemixedBoxes(baseTheme: ThemePalette, dramaticFontIdx?: number): BoxRobotTheme[] {
  const fontStyle = dramaticFontIdx !== undefined 
    ? DRAMATIC_FONT_STYLES[dramaticFontIdx % DRAMATIC_FONT_STYLES.length]
    : DRAMATIC_FONT_STYLES[Math.floor(Math.random() * DRAMATIC_FONT_STYLES.length)];

  // Seed base hue from the active theme or random
  const seedHue = Math.floor(Math.random() * 360);

  return Array.from({ length: 9 }, (_, i) => {
    // Stagger hue by ~40 degrees so each box is visually unique yet unified
    const roomHue = (seedHue + i * 40 + Math.floor(Math.random() * 15)) % 360;
    return generateSingleBoxTheme(i + 1, roomHue, fontStyle);
  });
}

// Mathematical Procedural Palette Generator
export function generateRandomRemixTheme(): ThemePalette {
  const comboNumber = Math.floor(10000 + Math.random() * 989999);

  const bgHue = Math.floor(Math.random() * 360);
  const bgSat = Math.floor(20 + Math.random() * 35);
  const bgLight = Number((2.4 + Math.random() * 2.8).toFixed(1));

  const bgVoid = `hsl(${bgHue}, ${bgSat}%, ${bgLight}%)`;
  const bgSurface = `hsl(${bgHue}, ${bgSat}%, ${(bgLight + 1.8).toFixed(1)}%)`;
  const bgCard = `hsl(${bgHue}, ${bgSat}%, ${(bgLight + 3.8).toFixed(1)}%)`;
  const bgElevated = `hsl(${bgHue}, ${bgSat}%, ${(bgLight + 6.2).toFixed(1)}%)`;
  const borderTheme = `hsla(${bgHue}, ${(bgSat * 0.8).toFixed(0)}%, ${(bgLight + 16).toFixed(1)}%, 0.45)`;

  const primaryHue = (bgHue + Math.floor(90 + Math.random() * 180)) % 360;
  const harmonyMode = Math.floor(Math.random() * 4);
  let h1 = primaryHue;
  let h2: number, h3: number, h4: number, h5: number, h6: number, h7: number;

  switch (harmonyMode) {
    case 0:
      h2 = (primaryHue + 120) % 360;
      h3 = (primaryHue + 240) % 360;
      h4 = (primaryHue + 60) % 360;
      h5 = (primaryHue + 180) % 360;
      h6 = (primaryHue + 300) % 360;
      h7 = (primaryHue + 45) % 360;
      break;
    case 1:
      h2 = (primaryHue + 150) % 360;
      h3 = (primaryHue + 210) % 360;
      h4 = (primaryHue + 75) % 360;
      h5 = (primaryHue + 270) % 360;
      h6 = (primaryHue + 330) % 360;
      h7 = (primaryHue + 30) % 360;
      break;
    case 2:
      h2 = (primaryHue + 90) % 360;
      h3 = (primaryHue + 180) % 360;
      h4 = (primaryHue + 270) % 360;
      h5 = (primaryHue + 45) % 360;
      h6 = (primaryHue + 135) % 360;
      h7 = (primaryHue + 315) % 360;
      break;
    default:
      h2 = (primaryHue + 35) % 360;
      h3 = (primaryHue + 70) % 360;
      h4 = (primaryHue + 180) % 360;
      h5 = (primaryHue + 215) % 360;
      h6 = (primaryHue + 250) % 360;
      h7 = (primaryHue + 300) % 360;
      break;
  }

  const neonCyan = `hsl(${h1}, 100%, 50%)`;
  const neonMagenta = `hsl(${h2}, 98%, 52%)`;
  const neonLime = `hsl(${h3}, 95%, 50%)`;
  const neonAmber = `hsl(${h4}, 100%, 50%)`;
  const neonPurple = `hsl(${h5}, 95%, 55%)`;
  const neonBlue = `hsl(${h6}, 95%, 55%)`;
  const neonRed = `hsl(${h7}, 100%, 54%)`;

  const borderGlow = `hsla(${h1}, 100%, 50%, 0.45)`;

  const heatmapScale = [
    bgCard,
    `hsl(${h1}, 80%, 25%)`,
    `hsl(${h1}, 100%, 45%)`,
    `hsl(${h2}, 100%, 60%)`,
    `#ffffff`
  ];

  const prefixes = [
    'Obsidian', 'Hyper', 'Neon', 'Void', 'Cyber', 'Abyssal', 'Solar', 'Quantum',
    'Chrono', 'Matrix', 'Plasma', 'Neural', 'Titanium', 'Vapor', 'Echo', 'Cryptic'
  ];
  const roots = [
    'Emerald', 'Amethyst', 'Sapphire', 'Crimson', 'Citrine', 'Onyx', 'Cobalt', 'Violet',
    'Pulse', 'Reactor', 'Overdrive', 'Prism', 'Hydra', 'Vortex', 'Aurora', 'Eclipse'
  ];
  const pName = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rName = roots[Math.floor(Math.random() * roots.length)];
  const themeName = `${pName} ${rName} #${comboNumber.toLocaleString()}`;

  return {
    id: `remix-${comboNumber}`,
    name: themeName,
    code: `RMX-${comboNumber.toString(16).toUpperCase()}`,
    comboNumber,
    bgVoid,
    bgSurface,
    bgCard,
    bgElevated,
    borderTheme,
    borderGlow,
    neonCyan,
    neonMagenta,
    neonLime,
    neonAmber,
    neonPurple,
    neonBlue,
    neonRed,
    heatmapScale,
    isRemixed: true
  };
}

// In-Memory & LocalStorage Controller
let activeTheme: ThemePalette = PRESET_THEMES[0];
let activeBoxes: BoxRobotTheme[] = generateRemixedBoxes(PRESET_THEMES[0], 0);
let activeDramaticFontIndex: number = 0;

const themeListeners: Array<(theme: ThemePalette) => void> = [];
const boxListeners: Array<(boxes: BoxRobotTheme[], fontIndex: number) => void> = [];

export function getActiveTheme(): ThemePalette {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('neonforge_active_theme');
    if (saved) {
      try {
        activeTheme = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
  }
  return activeTheme;
}

export function getActiveBoxes(): BoxRobotTheme[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('neonforge_active_boxes');
    if (saved) {
      try {
        activeBoxes = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved boxes', e);
      }
    }
  }
  return activeBoxes;
}

export function getActiveDramaticFontIndex(): number {
  return activeDramaticFontIndex;
}

export function applyThemeToDOM(theme: ThemePalette) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--bg-void', theme.bgVoid);
  root.style.setProperty('--bg-surface', theme.bgSurface);
  root.style.setProperty('--bg-card', theme.bgCard);
  root.style.setProperty('--bg-elevated', theme.bgElevated);
  root.style.setProperty('--border-theme', theme.borderTheme);
  root.style.setProperty('--border-glow', theme.borderGlow);

  root.style.setProperty('--neon-cyan', theme.neonCyan);
  root.style.setProperty('--neon-magenta', theme.neonMagenta);
  root.style.setProperty('--neon-lime', theme.neonLime);
  root.style.setProperty('--neon-amber', theme.neonAmber);
  root.style.setProperty('--neon-purple', theme.neonPurple);
  root.style.setProperty('--neon-blue', theme.neonBlue);
  root.style.setProperty('--neon-red', theme.neonRed);

  document.body.style.backgroundColor = theme.bgVoid;
}

export function setActiveTheme(theme: ThemePalette) {
  activeTheme = theme;
  if (typeof window !== 'undefined') {
    localStorage.setItem('neonforge_active_theme', JSON.stringify(theme));
  }
  applyThemeToDOM(theme);
  themeListeners.forEach(fn => fn(theme));
}

export function setBoxes(boxes: BoxRobotTheme[]) {
  activeBoxes = boxes;
  if (typeof window !== 'undefined') {
    localStorage.setItem('neonforge_active_boxes', JSON.stringify(boxes));
  }
  boxListeners.forEach(fn => fn(boxes, activeDramaticFontIndex));
}

export function remixBoxes(fontIndex?: number): BoxRobotTheme[] {
  const chosenFontIdx = fontIndex !== undefined 
    ? fontIndex 
    : (activeDramaticFontIndex + 1) % DRAMATIC_FONT_STYLES.length;
  activeDramaticFontIndex = chosenFontIdx;

  const newBoxes = generateRemixedBoxes(activeTheme, chosenFontIdx);
  setBoxes(newBoxes);
  return newBoxes;
}

export function remixSingleBox(boxId: number): BoxRobotTheme[] {
  const font = DRAMATIC_FONT_STYLES[activeDramaticFontIndex];
  const updated = activeBoxes.map(b => {
    if (b.id === boxId) {
      return generateSingleBoxTheme(boxId, undefined, font);
    }
    return b;
  });
  setBoxes(updated);
  return updated;
}

export function cycleDramaticFont(): DramaticFontStyle {
  activeDramaticFontIndex = (activeDramaticFontIndex + 1) % DRAMATIC_FONT_STYLES.length;
  const currentFont = DRAMATIC_FONT_STYLES[activeDramaticFontIndex];

  // Re-apply current dramatic font to existing boxes
  const updated = activeBoxes.map(b => ({
    ...b,
    badgeText: currentFont.badgeTextColor,
    badgeTextShadow: currentFont.badgeTextShadow,
    robot: {
      ...b.robot,
      bubbleText: currentFont.badgeTextColor,
      bubbleTextShadow: currentFont.badgeTextShadow
    },
    fontUnderneath: {
      labelColor: currentFont.labelColor,
      valueColor: currentFont.valueColor,
      textShadow: currentFont.textShadow,
      letterSpacing: currentFont.letterSpacing,
      statusColor: currentFont.statusColor,
      statusTextShadow: currentFont.statusTextShadow
    }
  }));

  setBoxes(updated);
  return currentFont;
}

// Global master remix: remixes theme + all 9 boxes + robots + dramatic font underneath!
export function remixTheme(): ThemePalette {
  const newTheme = generateRandomRemixTheme();
  setActiveTheme(newTheme);
  remixBoxes();
  return newTheme;
}

export function subscribeToTheme(fn: (theme: ThemePalette) => void) {
  themeListeners.push(fn);
  return () => {
    const idx = themeListeners.indexOf(fn);
    if (idx !== -1) themeListeners.splice(idx, 1);
  };
}

export function subscribeToBoxes(fn: (boxes: BoxRobotTheme[], fontIndex: number) => void) {
  boxListeners.push(fn);
  return () => {
    const idx = boxListeners.indexOf(fn);
    if (idx !== -1) boxListeners.splice(idx, 1);
  };
}

export function isHighContrastTheme(theme: ThemePalette): boolean {
  return theme.id === 'high-contrast-technical';
}

export function toggleHighContrastTheme(): ThemePalette {
  const current = getActiveTheme();
  if (isHighContrastTheme(current)) {
    // Switch to Classic Neon
    const neonTheme = PRESET_THEMES.find(p => p.id === 'classic-neonforge') || PRESET_THEMES[1];
    setActiveTheme(neonTheme);
    remixBoxes(0);
    return neonTheme;
  } else {
    // Switch to High-Contrast Technical Monochrome
    setActiveTheme(HIGH_CONTRAST_MONOCHROME_THEME);
    remixBoxes(0);
    return HIGH_CONTRAST_MONOCHROME_THEME;
  }
}
