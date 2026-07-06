import { useEffect, type RefObject } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#░▒▓01';

// Decrypt-style text reveal: when the element scrolls into view, its text
// churns through random glyphs and settles left-to-right. Runs once.
// Works on a single text line — pass the plain string via `text` when the
// element contains markup you don't want scrambled.
export function useScramble(ref: RefObject<HTMLElement | null>, text?: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = text ?? el.textContent ?? '';
    if (!target) return;

    let raf = 0;
    let done = false;

    const run = () => {
      const start = performance.now();
      const duration = 900;
      const step = (now: number) => {
        const prog = Math.min(1, (now - start) / duration);
        const settled = Math.floor(prog * target.length);
        let out = target.slice(0, settled);
        for (let i = settled; i < target.length; i++) {
          out += target[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (prog < 1) raf = requestAnimationFrame(step);
        else done = true;
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done) {
            io.unobserve(el);
            run();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = target;
    };
  }, [ref, text]);
}
