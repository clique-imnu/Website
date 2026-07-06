import { useEffect } from 'react';

// Fades/slides in any [data-reveal] or [data-reveal-3d] element once it's
// ~85% into the viewport. IntersectionObserver does the common case; a 400ms
// interval + scroll listener catch anything the observer missed (e.g. layout
// shifts from web-font loading).
export function useReveal() {
  useEffect(() => {
    const pending: HTMLElement[] = [];
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-3d]'),
    );

    const reveal = (el: HTMLElement) => {
      const d = parseInt(el.dataset.revealDelay || el.dataset.reveal3d || '0', 10);
      el.style.transition = `opacity 1s cubic-bezier(0.22,1,0.36,1) ${d}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${d}ms`;
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.dataset.revealed = '1';
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          reveal(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '1000% 0px 0px 0px' },
    );

    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const is3d = el.dataset.reveal3d !== undefined;
      if (r.top < window.innerHeight * 0.85) {
        el.style.opacity = '1';
        el.dataset.revealed = '1';
      } else {
        el.style.opacity = '0';
        el.style.transform = is3d
          ? 'perspective(1000px) rotateX(18deg) translateY(80px) scale(0.95)'
          : 'translateY(30px)';
        io.observe(el);
        pending.push(el);
      }
    });

    const checkPending = () => {
      if (!pending.length) return;
      const vh = window.innerHeight;
      for (let i = pending.length - 1; i >= 0; i--) {
        const el = pending[i];
        if (el.dataset.revealed === '1') {
          pending.splice(i, 1);
          continue;
        }
        if (el.getBoundingClientRect().top < vh * 0.85) {
          reveal(el);
          io.unobserve(el);
          pending.splice(i, 1);
        }
      }
    };

    const onScroll = () => checkPending();
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = window.setInterval(checkPending, 400);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(timer);
    };
  }, []);
}
