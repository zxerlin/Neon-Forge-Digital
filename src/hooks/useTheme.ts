import { useState, useEffect, useCallback } from 'react';
import { 
  ThemePalette, 
  BoxRobotTheme,
  DramaticFontStyle,
  DRAMATIC_FONT_STYLES,
  getActiveTheme, 
  getActiveBoxes,
  getActiveDramaticFontIndex,
  setActiveTheme, 
  remixTheme as triggerRemix, 
  remixBoxes as triggerRemixBoxes,
  remixSingleBox as triggerRemixSingleBox,
  cycleDramaticFont as triggerCycleDramaticFont,
  isHighContrastTheme,
  toggleHighContrastTheme as triggerToggleHighContrast,
  subscribeToTheme, 
  subscribeToBoxes,
  PRESET_THEMES 
} from '../utils/themeManager';
import { playSound } from '../utils/audio';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePalette>(getActiveTheme);
  const [boxes, setBoxesState] = useState<BoxRobotTheme[]>(getActiveBoxes);
  const [dramaticFontIndex, setDramaticFontIndex] = useState<number>(getActiveDramaticFontIndex);
  const [justRemixed, setJustRemixed] = useState(false);

  useEffect(() => {
    // Initial sync
    setThemeState(getActiveTheme());
    setBoxesState(getActiveBoxes());
    setDramaticFontIndex(getActiveDramaticFontIndex());

    // Subscribe to theme changes
    const unsubTheme = subscribeToTheme((updated) => {
      setThemeState({ ...updated });
    });

    // Subscribe to box changes
    const unsubBoxes = subscribeToBoxes((updatedBoxes, fontIdx) => {
      setBoxesState([...updatedBoxes]);
      setDramaticFontIndex(fontIdx);
    });

    return () => {
      unsubTheme();
      unsubBoxes();
    };
  }, []);

  const remix = useCallback(() => {
    playSound('warp');
    const newTheme = triggerRemix();
    setJustRemixed(true);
    setTimeout(() => setJustRemixed(false), 2000);
    return newTheme;
  }, []);

  const remixBoxes = useCallback(() => {
    playSound('warp');
    const newBoxes = triggerRemixBoxes();
    setJustRemixed(true);
    setTimeout(() => setJustRemixed(false), 2000);
    return newBoxes;
  }, []);

  const remixSingleBox = useCallback((boxId: number) => {
    playSound('click');
    return triggerRemixSingleBox(boxId);
  }, []);

  const cycleDramaticFont = useCallback(() => {
    playSound('agent');
    return triggerCycleDramaticFont();
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    const found = PRESET_THEMES.find(p => p.id === presetId);
    if (found) {
      playSound('click');
      setActiveTheme(found);
      triggerRemixBoxes();
    }
  }, []);

  const selectCustom = useCallback((customTheme: ThemePalette) => {
    playSound('click');
    setActiveTheme(customTheme);
  }, []);

  const toggleHighContrast = useCallback(() => {
    playSound('click');
    return triggerToggleHighContrast();
  }, []);

  const isHighContrast = isHighContrastTheme(theme);
  const currentDramaticFont = DRAMATIC_FONT_STYLES[dramaticFontIndex] || DRAMATIC_FONT_STYLES[0];

  return {
    theme,
    boxes,
    currentDramaticFont,
    dramaticFontStyles: DRAMATIC_FONT_STYLES,
    remix,
    remixBoxes,
    remixSingleBox,
    cycleDramaticFont,
    selectPreset,
    selectCustom,
    toggleHighContrast,
    isHighContrast,
    presets: PRESET_THEMES,
    justRemixed
  };
}
