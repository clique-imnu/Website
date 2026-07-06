import { useEffect, useRef } from 'react';

export interface NormalizedPointer {
  x: number;
  y: number;
}

// Tracks cursor position normalized to [-0.5, 0.5] of the viewport, read by
// canvases (hero/story tilt) and the magnetic-button effect without causing
// re-renders on every mouse move.
export function usePointerNormalized() {
  const ref = useRef<NormalizedPointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = e.clientX / window.innerWidth - 0.5;
      ref.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return ref;
}
