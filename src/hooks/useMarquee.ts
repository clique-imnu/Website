import { useEffect } from 'react';

interface MarqueeState {
  el: HTMLElement;
  cur: number;
  target: number;
  anim: Animation | null;
  settled: boolean;
}

// Ticker rows ([data-marquee]) ease into reverse-and-slow when hovered, then
// ease back to forward speed — driven by adjusting the CSS animation's
// playbackRate rather than re-triggering it, so the loop stays seamless.
export function useMarquee() {
  useEffect(() => {
    const marquees: MarqueeState[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-marquee]'),
    ).map((el) => ({ el, cur: 1, target: 1, anim: null, settled: false }));

    const listeners: Array<() => void> = [];
    marquees.forEach((m) => {
      const host = m.el.parentElement;
      if (!host) return;
      const onEnter = () => {
        m.target = -2.4;
      };
      const onLeave = () => {
        m.target = 1;
      };
      host.addEventListener('pointerenter', onEnter);
      host.addEventListener('pointerleave', onLeave);
      listeners.push(() => {
        host.removeEventListener('pointerenter', onEnter);
        host.removeEventListener('pointerleave', onLeave);
      });
    });

    let raf = 0;
    const tick = () => {
      marquees.forEach((m) => {
        if (Math.abs(m.target - m.cur) < 0.004 && m.target === 1 && m.settled) return;
        m.cur += (m.target - m.cur) * 0.065;
        m.settled = Math.abs(m.target - m.cur) < 0.004 && m.target === 1;
        if (!m.anim) {
          const anims = m.el.getAnimations ? m.el.getAnimations() : [];
          m.anim = anims[0] ?? null;
        }
        const anim = m.anim;
        if (!anim) return;
        try {
          const duration =
            anim.effect && 'getComputedTiming' in anim.effect
              ? (anim.effect.getComputedTiming().duration as number)
              : 30000;
          if (m.cur < 0 && anim.currentTime !== null && Number(anim.currentTime) < duration * 4) {
            anim.currentTime = Number(anim.currentTime) + duration * 1000;
          }
          if (anim.playState === 'finished') {
            anim.currentTime = duration * 1000;
            anim.play();
          }
          anim.playbackRate = m.cur;
        } catch {
          // ignore — Web Animations API quirks across browsers
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      listeners.forEach((off) => off());
    };
  }, []);
}
