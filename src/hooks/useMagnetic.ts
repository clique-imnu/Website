import { useEffect } from 'react';

// Nav/CTA buttons ([data-magnet]) nudge toward the cursor within a 130px
// capture radius, snapping back on mouseleave via the translate reset below.
export function useMagnetic() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          const f = (1 - d / 130) * 0.45;
          el.style.translate = `${dx * f}px ${dy * f}px`;
        } else {
          el.style.translate = '0px 0px';
        }
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
}
