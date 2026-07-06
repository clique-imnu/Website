import { useEffect, type RefObject } from 'react';
import { buildIcosahedron, drawIcosahedron, sizeCanvasToDisplay } from '../lib/icosahedron';
import { getStoredAccent } from './useAccent';

// Standalone icosahedron ticker for cards outside the master scroll loop.
// Owns its own rAF; reads the live accent color every frame.
export function useMiniIco(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  speed: number = 0.004,
  scale: number = 0.32,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ico = buildIcosahedron();
    sizeCanvasToDisplay(canvas);
    let rot = Math.random() * 6;
    let raf = 0;
    const tick = () => {
      rot += speed;
      if (canvas.width > 2) {
        drawIcosahedron(ico, canvas, rot, { color: getStoredAccent(), scale, rings: true });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => sizeCanvasToDisplay(canvas);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [canvasRef, speed, scale]);
}
