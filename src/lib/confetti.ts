// Shared confetti burst + celebration pill, used by the easter eggs and the
// /join success screen. Module-level guard prevents overlapping bursts.
let busy = false;

export function fireConfetti(pillText = 'CERTIFIED CLIQUE MEMBER ✦'): void {
  if (busy) return;
  busy = true;

  const cs = getComputedStyle(document.documentElement);
  const colors = [
    cs.getPropertyValue('--accent').trim() || '#E8823A',
    cs.getPropertyValue('--lime').trim() || '#CDFF4D',
    cs.getPropertyValue('--pink').trim() || '#FF6FB5',
    '#F5F3F0',
  ];

  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;width:100vw;height:100vh;';
  document.body.appendChild(cv);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = window.innerWidth * dpr;
  cv.height = window.innerHeight * dpr;
  const ctx = cv.getContext('2d');
  ctx?.scale(dpr, dpr);

  const pill = document.createElement('div');
  pill.textContent = pillText;
  pill.style.cssText =
    "position:fixed;left:50%;top:44%;translate:-50% -50%;z-index:9999;background:var(--lime,#CDFF4D);color:#0B0B0B;font-family:'Shantell Sans',cursive;font-weight:700;font-size:clamp(18px,3vw,30px);padding:14px 26px;border-radius:100px;border:3px solid #0B0B0B;box-shadow:6px 6px 0 #00000080;rotate:-4deg;pointer-events:none;transition:scale .35s cubic-bezier(.34,1.56,.64,1),opacity .3s;scale:.2;opacity:0;white-space:nowrap;";
  document.body.appendChild(pill);
  requestAnimationFrame(() => {
    pill.style.scale = '1';
    pill.style.opacity = '1';
  });

  interface Particle {
    x: number; y: number; vx: number; vy: number; w: number; h: number; r: number; vr: number; c: string;
  }
  const particles: Particle[] = [];
  for (let i = 0; i < 160; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
    const sp = 7 + Math.random() * 13;
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.62,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      w: 7 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[i % colors.length],
    });
  }
  const t0 = performance.now();
  const step = () => {
    const el = performance.now() - t0;
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.vy += 0.26;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - el / 2600);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
    }
    if (el < 2700) {
      requestAnimationFrame(step);
    } else {
      cv.remove();
      pill.remove();
      busy = false;
    }
  };
  requestAnimationFrame(step);
  setTimeout(() => {
    pill.style.opacity = '0';
    pill.style.scale = '0.6';
  }, 1900);
}
