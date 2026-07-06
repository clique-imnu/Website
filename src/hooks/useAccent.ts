import { useCallback, useEffect, useRef, useState } from 'react';
import { THEME } from '../lib/content';

const STORAGE_KEY = 'cliqueAccent';

export function getStoredAccent(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || THEME.accent;
  } catch {
    return THEME.accent;
  }
}

// Owns the site-wide accent color: writes the --accent CSS variable, persists
// the pick, and exposes a ref so canvas draw loops can read the current value
// every frame without re-rendering.
export function useAccent() {
  const [accent, setAccentState] = useState(getStoredAccent);
  const accentRef = useRef(accent);

  useEffect(() => {
    accentRef.current = accent;
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  const setAccent = useCallback((color: string) => {
    setAccentState(color);
    try {
      localStorage.setItem(STORAGE_KEY, color);
    } catch {
      // ignore
    }
  }, []);

  return { accent, accentRef, setAccent };
}
