import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'cliqueSound';

export interface SoundApi {
  enabled: boolean;
  toggle: () => void;
  blip: (freq: number, vol: number, dur: number, force?: boolean) => void;
}

// Tiny Web Audio "blip" synth used for hover/click feedback across the site.
// Sound is ON by default; the AudioContext still only starts on the first real
// user gesture (hover/click), so nothing plays until the visitor interacts.
// A visitor who toggles it off has that choice persisted and respected.
export function useSound(): SoundApi {
  const [enabled, setEnabled] = useState(true);
  const acRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    try {
      // Default on: only an explicit '0' (user turned it off before) disables it.
      if (localStorage.getItem(STORAGE_KEY) === '0') setEnabled(false);
    } catch {
      // ignore storage access errors (private browsing, etc.)
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (!acRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) acRef.current = new AC();
    }
    if (acRef.current && acRef.current.state === 'suspended') acRef.current.resume();
    return acRef.current;
  }, []);

  const blip = useCallback(
    (freq: number, vol: number, dur: number, force = false) => {
      if (!force && !enabledRef.current) return;
      const ac = ensureContext();
      if (!ac) return;
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    },
    [ensureContext],
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      if (next) blip(880, 0.09, 0.16, true);
      return next;
    });
  }, [blip]);

  useEffect(() => {
    let lastEl: Element | null = null;
    let lastT = 0;
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const t = target?.closest?.('a, button, [data-globe-card], [data-tilt]') ?? null;
      if (!t || t === lastEl) return;
      const now = performance.now();
      if (now - lastT < 70) return;
      lastEl = t;
      lastT = now;
      blip(1240, 0.03, 0.05);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const t = target?.closest?.('a, button, [data-globe-card]') ?? null;
      if (t) blip(620, 0.06, 0.09);
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('click', onClick, true);
    };
  }, [blip]);

  useEffect(() => {
    const ac = acRef.current;
    return () => {
      try {
        ac?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  return { enabled, toggle, blip };
}
