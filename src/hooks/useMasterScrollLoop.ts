import { useEffect, useRef, type RefObject } from 'react';
import { buildIcosahedron, drawIcosahedron, sizeCanvasToDisplay } from '../lib/icosahedron';
import type { NormalizedPointer } from './usePointerNormalized';

export interface MasterLoopRefs {
  progressRef: RefObject<HTMLDivElement | null>;
  navRef: RefObject<HTMLElement | null>;
  heroContentRef: RefObject<HTMLDivElement | null>;
  gridRef: RefObject<HTMLDivElement | null>;
  heroCanvasRef: RefObject<HTMLCanvasElement | null>;
  joinCanvasRef: RefObject<HTMLCanvasElement | null>;
  cardCanvasRef: RefObject<HTMLCanvasElement | null>;
  storyCanvasRef: RefObject<HTMLCanvasElement | null>;
  storySectionRef: RefObject<HTMLElement | null>;
  storyGlowRef: RefObject<HTMLDivElement | null>;
  storyReadoutRef: RefObject<HTMLSpanElement | null>;
  pointerRef: RefObject<NormalizedPointer>;
  accentRef: RefObject<string>;
}

const STORY_PHASE_CENTERS = [0.08, 0.36, 0.62, 0.9];

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Single requestAnimationFrame loop mirroring the prototype's master tick():
// scroll progress, nav auto-hide, hero parallax/letter kinetics, background
// grid tilt, [data-plx]/[data-skew]/[data-drift]/[data-zoom] utility
// transforms, the three ambient icosahedron canvases, and the pinned Story
// scene's phase captions + explode/reassemble animation.
export function useMasterScrollLoop(refs: MasterLoopRefs) {
  const icoRef = useRef(buildIcosahedron());

  useEffect(() => {
    const {
      progressRef,
      navRef,
      heroContentRef,
      gridRef,
      heroCanvasRef,
      joinCanvasRef,
      cardCanvasRef,
      storyCanvasRef,
      storySectionRef,
      storyGlowRef,
      storyReadoutRef,
      pointerRef,
      accentRef,
    } = refs;
    const ico = icoRef.current;

    const allCanvases = () =>
      [heroCanvasRef.current, joinCanvasRef.current, cardCanvasRef.current, storyCanvasRef.current].filter(
        (c): c is HTMLCanvasElement => !!c,
      );

    allCanvases().forEach(sizeCanvasToDisplay);
    const onResize = () => allCanvases().forEach(sizeCanvasToDisplay);
    window.addEventListener('resize', onResize);

    let cur = window.scrollY;
    let last = window.scrollY;
    let lastNavY = window.scrollY;
    let skewCur = 0;
    let stretchCur = 0;
    let rot = 0;
    let sizeTick = 0;

    const updateStory = (vh: number) => {
      const sec = storySectionRef.current;
      const canvas = storyCanvasRef.current;
      if (!sec || !canvas || canvas.width <= 2) return;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const total = r.height - vh;
      const prog = Math.max(0, Math.min(1, -r.top / total));

      document.querySelectorAll<HTMLElement>('[data-phase]').forEach((el) => {
        const i = parseInt(el.dataset.phase ?? '0', 10);
        const d = Math.abs(prog - STORY_PHASE_CENTERS[i]);
        let w = Math.max(0, 1 - d / 0.17);
        if (i === 0 && prog < STORY_PHASE_CENTERS[0]) w = 1;
        if (i === 3 && prog > STORY_PHASE_CENTERS[3]) w = 1;
        el.style.opacity = String(w);
        el.style.transform = `translateY(${(1 - w) * 26}px)`;
        el.style.filter = `blur(${(1 - w) * 8}px)`;
      });

      const zoomP = Math.max(0, Math.min(1, (prog - 0.25) / 0.2));
      const settle = Math.max(0, Math.min(1, (prog - 0.82) / 0.16));
      let explode = 0;
      if (prog > 0.5 && prog <= 0.7) explode = Math.min(1, (prog - 0.5) / 0.16);
      else if (prog > 0.7) explode = Math.max(0, 1 - (prog - 0.7) / 0.18);
      explode = easeInOutQuad(explode);

      const scale = 0.27 + easeInOutQuad(zoomP) * 0.13 - easeInOutQuad(settle) * 0.06 - explode * 0.05;
      const iRot = 1.2 + prog * 5.2 + rot * 0.15;
      drawIcosahedron(ico, canvas, iRot, {
        color: accentRef.current ?? '#E8823A',
        scale,
        rings: true,
        explode,
        tilt: (pointerRef.current?.y ?? 0) * 0.25,
      });

      if (storyGlowRef.current) {
        storyGlowRef.current.style.opacity = String(0.5 + explode * 0.5 + zoomP * 0.2);
      }
      document.querySelectorAll<HTMLElement>('[data-explode-label]').forEach((el, i) => {
        const w = Math.max(0, explode * 1.4 - 0.4 - i * 0.08);
        el.style.opacity = String(Math.min(1, w));
        el.style.transform = `translateY(${(1 - Math.min(1, w)) * 14}px)`;
      });
      if (storyReadoutRef.current) storyReadoutRef.current.textContent = `T+${prog.toFixed(2)}`;
    };

    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      cur += (y - cur) * 0.1;
      const vel = y - last;
      last = y;

      if (progressRef.current) {
        const total = document.documentElement.scrollHeight - vh;
        progressRef.current.style.width = `${total > 0 ? (y / total) * 100 : 0}%`;
      }

      if (navRef.current) {
        if (y > lastNavY + 6 && y > 140) navRef.current.style.transform = 'translateY(-110%)';
        else if (y < lastNavY - 6) navRef.current.style.transform = 'none';
        lastNavY = y;
      }

      if (heroContentRef.current) {
        const p = Math.min(cur / vh, 1.2);
        heroContentRef.current.style.transform = `translateY(${p * vh * 0.32}px)`;
        heroContentRef.current.style.opacity = String(Math.max(0, 1 - p * 1.15));
        // kinetic type: letters shear apart with scroll + stretch with velocity
        stretchCur += (Math.min(Math.abs(vel) * 0.012, 0.28) - stretchCur) * 0.14;
        document.querySelectorAll<HTMLElement>('[data-hero-letter]').forEach((el, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          el.style.marginLeft = `${p * 14 * (i * 0.5)}px`;
          el.style.transform = `translateY(${p * dir * -18}px) rotate(${p * dir * 2.5}deg) scaleY(${1 + stretchCur})`;
        });
      }

      if (gridRef.current) {
        const p = Math.min(cur / vh, 1);
        gridRef.current.style.transform = `perspective(1100px) rotateX(${p * 38}deg) translateY(${p * 60}px)`;
      }

      document.querySelectorAll<HTMLElement>('[data-plx]').forEach((el) => {
        const sp = parseFloat(el.dataset.plx ?? '0');
        el.style.translate = `0 ${-cur * sp}px`;
      });

      const skew = Math.max(-7, Math.min(7, vel * 0.35));
      skewCur += (skew - skewCur) * 0.12;
      document.querySelectorAll<HTMLElement>('[data-skew]').forEach((el) => {
        el.style.transform = `skewX(${skewCur}deg)`;
      });

      document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        const sp = parseFloat(el.dataset.drift ?? '0');
        el.style.transform = `translateX(${-(r.top + r.height - vh) * sp - 100}px)`;
      });

      document.querySelectorAll<HTMLElement>('[data-zoom]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.7)));
        const sc = 0.82 + prog * 0.18;
        el.style.transform = `scale(${sc})`;
        el.style.opacity = String(0.2 + prog * 0.8);
      });

      sizeTick++;
      if (sizeTick % 30 === 0) {
        allCanvases().forEach((c) => {
          if (c.width <= 2 && c.getBoundingClientRect().width > 0) sizeCanvasToDisplay(c);
        });
      }

      rot += 0.0035 + Math.min(Math.abs(vel) * 0.0006, 0.05);
      const accent = accentRef.current ?? '#E8823A';
      const nmx = pointerRef.current?.x ?? 0;
      const nmy = pointerRef.current?.y ?? 0;

      const heroCanvas = heroCanvasRef.current;
      if (heroCanvas && heroCanvas.width > 2) {
        const r = heroCanvas.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          drawIcosahedron(ico, heroCanvas, rot + cur * 0.0016 + nmx * 0.5, {
            color: accent,
            scale: 0.33,
            rings: true,
            tilt: nmy * 0.4,
          });
        }
      }
      const joinCanvas = joinCanvasRef.current;
      if (joinCanvas && joinCanvas.width > 2) {
        const r = joinCanvas.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          drawIcosahedron(ico, joinCanvas, -rot * 0.6, { color: '#0B0B0B', scale: 0.3, rings: true });
        }
      }
      const cardCanvas = cardCanvasRef.current;
      if (cardCanvas && cardCanvas.width > 2) {
        const r = cardCanvas.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          drawIcosahedron(ico, cardCanvas, rot * 0.8, { color: accent, scale: 0.3, rings: true });
        }
      }

      updateStory(vh);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs]);
}
