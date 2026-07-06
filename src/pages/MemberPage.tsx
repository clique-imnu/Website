import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MEMBERS, memberIndex } from '../lib/members';
import { buildIcosahedron, drawIcosahedron, sizeCanvasToDisplay } from '../lib/icosahedron';
import { getStoredAccent } from '../hooks/useAccent';
import { useScramble } from '../hooks/useScramble';
import { FilmGrain } from '../components/FilmGrain';
import { Logo } from '../components/Logo';
import { NotFound } from './NotFound';

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const monoLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  letterSpacing: '0.22em',
  color: '#6E6862',
} as const;

export function MemberPage() {
  const { slug } = useParams<{ slug: string }>();
  const idx = memberIndex(slug ?? '');
  const member = idx >= 0 ? MEMBERS[idx] : undefined;

  const nameRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useScramble(nameRef, member?.name);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // small ambient icosahedron, own rAF loop (independent of the home page's)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ico = buildIcosahedron();
    sizeCanvasToDisplay(canvas);
    let rot = hash(slug ?? '') % 6;
    let raf = 0;
    const tick = () => {
      rot += 0.004;
      if (canvas.width > 2) drawIcosahedron(ico, canvas, rot, { color: getStoredAccent(), scale: 0.32, rings: true });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => sizeCanvasToDisplay(canvas);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [slug]);

  if (!member) return <NotFound />;

  const h = hash(member.name);
  const nodeLabel = String(member.nodeNum).padStart(2, '0');
  const prev = MEMBERS[(idx + MEMBERS.length - 1) % MEMBERS.length];
  const next = MEMBERS[(idx + 1) % MEMBERS.length];
  const initials = member.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  const role = member.keyValues.role ?? 'CORE TEAM';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0B0B',
        color: '#F5F3F0',
        fontFamily: "'Space Grotesk', sans-serif",
        overflowX: 'clip',
        position: 'relative',
      }}
    >
      <FilmGrain />

      {/* ambient canvas */}
      <div style={{ position: 'fixed', top: '-6%', right: '-8%', width: 'min(52vw, 700px)', height: 'min(52vw, 700px)', pointerEvents: 'none', opacity: 0.5 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* top bar */}
      <div data-mpad="true" style={{ padding: '22px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <Link
          to="/"
          className="hover-accent"
          style={{ ...monoLabel, color: '#9A948C', textDecoration: 'none' }}
        >
          ← BACK TO THE CLIQUE
        </Link>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }} aria-label="CLIQUE — home">
          <Logo size={32} withWordmark wordmarkSize={16} />
        </Link>
      </div>

      <main
        data-mpad="true"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(30px, 6vh, 80px) 32px 80px 32px',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 340px) 1fr',
          gap: 'clamp(28px, 5vw, 64px)',
          alignItems: 'start',
          position: 'relative',
          zIndex: 2,
        }}
        data-mod-a="true"
      >
        {/* polaroid */}
        <div
          style={{
            background: '#F5F3F0',
            padding: '12px 12px 8px 12px',
            rotate: `${((h % 7) - 3) * 1.2}deg`,
            boxShadow: '0 18px 50px #00000080',
            position: 'relative',
            animation: 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -11,
              left: '50%',
              translate: '-50% 0',
              rotate: `${(h % 9) - 4}deg`,
              width: 64,
              height: 20,
              background: 'color-mix(in oklab, var(--accent) 55%, #FFFFFF30)',
              opacity: 0.85,
              boxShadow: '0 2px 5px #00000033',
            }}
          />
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              background: '#171512',
              border: '1px dashed #FFFFFF24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(48px, 8vw, 92px)',
              color: 'var(--accent)',
            }}
          >
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              initials
            )}
          </div>
          <div style={{ fontFamily: "'Shantell Sans', cursive", fontWeight: 600, fontSize: 14, color: '#23201C', padding: '10px 6px 4px 6px', textAlign: 'center', lineHeight: 1.35 }}>
            &ldquo;{member.mantra}&rdquo;
          </div>
        </div>

        {/* dossier */}
        <div>
          <div style={{ ...monoLabel, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
            NODE / {nodeLabel}
            <span style={{ width: 34, height: 1, background: '#3A3630', display: 'inline-block' }} />
            <span style={{ color: '#6E6862' }}>MEMBER DOSSIER</span>
          </div>

          <h1
            ref={nameRef}
            style={{
              margin: '18px 0 10px 0',
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(34px, 6vw, 84px)',
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
            }}
          >
            {member.name}
          </h1>

          <div
            style={{
              width: 'fit-content',
              rotate: '-2deg',
              background: 'var(--lime)',
              color: '#0B0B0B',
              fontFamily: "'Shantell Sans', cursive",
              fontWeight: 700,
              fontSize: 14,
              padding: '7px 15px',
              borderRadius: 100,
              border: '2px solid #0B0B0B',
              boxShadow: '3px 3px 0 #00000080',
              margin: '10px 0 26px 0',
              animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both',
            }}
          >
            {role.toLowerCase()} ✦ no cap
          </div>

          <p style={{ margin: '0 0 30px 0', maxWidth: 520, color: '#B9B4AE', fontSize: 17, lineHeight: 1.65, animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both' }}>
            {member.oneLiner}
          </p>

          <pre
            style={{
              margin: '0 0 34px 0',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              lineHeight: 1.9,
              color: '#D9C4A3',
              letterSpacing: '0.02em',
              background: '#0B0B0BCC',
              border: '1px solid #FFFFFF12',
              borderRadius: 12,
              padding: '16px 20px',
              maxWidth: '100%',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both',
            }}
          >
            {JSON.stringify(member.keyValues, null, 2)}
          </pre>

        </div>
      </main>

      {/* prev / next */}
      <nav
        data-mpad="true"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 32px 70px 32px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: '0.14em',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Link to={`/people/${prev.slug}`} className="hover-accent" style={{ color: '#9A948C', textDecoration: 'none' }}>
          ← {prev.name.toUpperCase()}
        </Link>
        <Link to={`/people/${next.slug}`} className="hover-accent" style={{ color: '#9A948C', textDecoration: 'none', textAlign: 'right' }}>
          {next.name.toUpperCase()} →
        </Link>
      </nav>
    </div>
  );
}
