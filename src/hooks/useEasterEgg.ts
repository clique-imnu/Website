import { useEffect, useRef } from 'react';
import { fireConfetti } from '../lib/confetti';

type BlipFn = (freq: number, vol: number, dur: number, force?: boolean) => void;

// Two hidden triggers — typing "clique" anywhere, or tapping the nav logo 5x
// within ~2.2s — both fire a confetti burst. Also swaps the tab title while
// the page is hidden, as a small "come back" nudge.
export function useEasterEgg(blip: BlipFn) {
  const tapsRef = useRef(0);
  const tapTRef = useRef(0);

  const confetti = () => {
    blip(980, 0.1, 0.3, true);
    fireConfetti();
  };

  useEffect(() => {
    let buf = '';
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key && e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-6);
        if (buf === 'clique') {
          buf = '';
          confetti();
        }
      }
    };
    window.addEventListener('keydown', onKeydown);

    const originalTitle = document.title;
    let titleTimer = 0;
    const onVisibility = () => {
      if (titleTimer) {
        clearTimeout(titleTimer);
        titleTimer = 0;
      }
      if (document.hidden) {
        document.title = 'come back bestie 😭';
      } else {
        document.title = 'yayy you’re back ✦';
        titleTimer = window.setTimeout(() => {
          document.title = originalTitle;
        }, 1600);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      document.removeEventListener('visibilitychange', onVisibility);
      if (titleTimer) clearTimeout(titleTimer);
      document.title = originalTitle;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoTap = () => {
    const now = performance.now();
    if (!tapsRef.current || now - tapTRef.current > 2200) tapsRef.current = 0;
    tapsRef.current++;
    tapTRef.current = now;
    if (tapsRef.current >= 5) {
      tapsRef.current = 0;
      confetti();
    }
  };

  return { logoTap };
}
