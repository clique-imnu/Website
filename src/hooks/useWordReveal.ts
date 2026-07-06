import { useEffect, type RefObject } from 'react';

// Unrevealed words rest at this opacity — high enough to stay readable on
// #0B0B0B, low enough that the scroll-driven brighten still reads as a sweep.
const DIM_OPACITY = '0.55';

// Splits the About paragraph into per-word spans and brightens them
// left-to-right as the paragraph scrolls up through the viewport.
export function useWordReveal(hostRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const spans: HTMLSpanElement[] = [];
    const wrap = (node: ChildNode) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        const parts = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (/^\s*$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          const s = document.createElement('span');
          s.textContent = p;
          s.style.opacity = DIM_OPACITY;
          s.style.transition = 'opacity 0.3s ease-out';
          frag.appendChild(s);
          spans.push(s);
        });
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(wrap);
      }
    };
    Array.from(host.childNodes).forEach(wrap);

    const update = () => {
      const vh = window.innerHeight;
      const r = host.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (vh * 0.75)));
      const n = Math.floor(prog * spans.length);
      spans.forEach((s, i) => {
        s.style.opacity = i < n ? '1' : DIM_OPACITY;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const timer = window.setInterval(update, 400);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.clearInterval(timer);
    };
  }, [hostRef]);
}
