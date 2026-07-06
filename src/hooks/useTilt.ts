import { useEffect } from 'react';

// 3D tilt-on-hover for the Focus bento cards, gated on the card having
// finished its reveal-in animation (matches the design's data-revealed flag).
export function useTilt() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));

    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      if (card.dataset.revealed !== '1') return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'border-color 0.3s';
      card.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateZ(10px)`;
    };
    const onLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      if (card.dataset.revealed !== '1') return;
      card.style.transition = 'border-color 0.3s, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform = 'none';
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);
}
