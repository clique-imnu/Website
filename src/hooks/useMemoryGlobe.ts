import { useEffect, useState, type RefObject } from 'react';

interface GlobeTip {
  text: string;
  visible: boolean;
}

// Drives the "memory globe" in the Wall section: cards orbit a sphere, drag
// to spin (yaw/pitch), idle auto-rotation resumes when untouched, hover/click
// "focuses" a card (scales + centers it) and surfaces its caption as a tip.
// Runs its own rAF loop since the orbit keeps spinning independent of scroll.
export function useMemoryGlobe(
  wrapRef: RefObject<HTMLDivElement | null>,
  jokes: string[],
): GlobeTip {
  const [tip, setTip] = useState<GlobeTip>({ text: '', visible: false });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let gYaw = 0.6;
    let gPitch = -0.14;
    let gVel = 0.0035;
    let gHover = -1;
    let gFocus = -1;
    let gFocusT = 0;
    let gIntro = 0;
    let gMovedTotal = 0;
    let down = false;
    let gDrag = false;
    let px = 0;
    let py = 0;

    const updateTip = () => {
      const idx = gFocus >= 0 ? gFocus : gHover;
      if (idx >= 0 && jokes[idx]) {
        setTip({ text: jokes[idx], visible: true });
      } else {
        setTip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      down = true;
      gDrag = true;
      gMovedTotal = 0;
      px = e.clientX;
      py = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      gMovedTotal += Math.abs(dx) + Math.abs(dy);
      px = e.clientX;
      py = e.clientY;
      gYaw += dx * 0.0052;
      gPitch = Math.max(-0.7, Math.min(0.7, gPitch + dy * 0.0028));
      gVel = Math.max(-0.03, Math.min(0.03, dx * 0.0007));
      if (gMovedTotal > 8) wrap.style.cursor = 'grabbing';
    };
    const onPointerUp = () => {
      down = false;
      gDrag = false;
      wrap.style.cursor = 'grab';
    };
    const onClick = (e: MouseEvent) => {
      if (gMovedTotal > 8) return;
      const target = e.target as Element | null;
      const card = (target?.closest?.('[data-globe-card]') ?? null) as HTMLElement | null;
      if (!card) {
        if (gFocus >= 0) {
          gFocus = -1;
          updateTip();
        }
        return;
      }
      const i = parseInt(card.dataset.globeCard ?? '-1', 10);
      gFocus = gFocus === i ? -1 : i;
      updateTip();
    };
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = (target?.closest?.('[data-globe-card]') ?? null) as HTMLElement | null;
      gHover = card ? parseInt(card.dataset.globeCard ?? '-1', 10) : -1;
      if (gFocus < 0) updateTip();
    };
    const onPointerLeave = () => {
      gHover = -1;
      if (gFocus < 0) updateTip();
    };

    wrap.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    wrap.addEventListener('click', onClick);
    wrap.addEventListener('pointerover', onPointerOver);
    wrap.addEventListener('pointerleave', onPointerLeave);

    let raf = 0;
    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const onScreen = rect.width >= 10 && rect.bottom >= -80 && rect.top <= window.innerHeight + 80;
      if (onScreen) {
        if (!gDrag) {
          const idle = gHover < 0 && gFocus < 0;
          gVel += ((idle ? 0.0035 : 0.0004) - gVel) * 0.04;
          gYaw += gVel;
        }
        gIntro += (1 - gIntro) * 0.055;
        gFocusT += ((gFocus >= 0 ? 1 : 0) - gFocusT) * 0.14;
        const cards = wrap.querySelectorAll<HTMLElement>('[data-globe-card]');
        const N = cards.length;
        if (N) {
          const R = Math.min(rect.width, rect.height) * 0.365;
          const cp = Math.cos(gPitch);
          const sp = Math.sin(gPitch);
          cards.forEach((el) => {
            const i = parseInt(el.dataset.globeCard ?? '0', 10);
            const t = (i + 0.5) / N;
            let y = 1 - 2 * t;
            const rad = Math.sqrt(Math.max(0, 1 - y * y));
            const phi = i * 2.39996 + gYaw;
            const x = Math.cos(phi) * rad;
            let z = Math.sin(phi) * rad;
            const y2 = y * cp - z * sp;
            const z2 = y * sp + z * cp;
            y = y2;
            z = z2;
            let sx = x * R;
            let sy = y * R * 0.92;
            let s = (0.52 + (z + 1) * 0.34) * gIntro;
            let op = (0.26 + (z + 1) * 0.37) * gIntro;
            const focused = gFocus === i;
            if (focused) {
              sx *= 1 - gFocusT;
              sy = sy * (1 - gFocusT) - 14 * gFocusT;
              s = s + (1.8 - s) * gFocusT;
              op = 1;
            } else {
              if (gHover === i) {
                s *= 1.15;
                op = Math.min(1, op + 0.3);
              }
              if (gFocus >= 0) op *= 0.3;
            }
            el.style.transform = `translate(-50%, -50%) translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0) scale(${s.toFixed(3)}) rotate(${(Math.sin((i + 1) * 4.7) * 5).toFixed(1)}deg)`;
            el.style.opacity = Math.min(1, op).toFixed(3);
            el.style.zIndex = String(focused ? 500 : 100 + Math.round((z + 1) * 100));
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('click', onClick);
      wrap.removeEventListener('pointerover', onPointerOver);
      wrap.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [wrapRef, jokes]);

  return tip;
}
