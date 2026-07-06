import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const BOOT_LINES = [
  'CLIQUE BIOS v2.6 — IMNU CAMPUS EDITION',
  'MEM CHECK ........ 13 NODES OK',
  'CHAI MODULE ...... LOADED ☕',
  'AURA DRIVERS ..... +999',
  'VIBE CHECK ....... IMMACULATE',
  'BOOTING CLIQUE.EXE',
];

// Decided once per page load (module scope) so React StrictMode's double
// mount can't read back the flag the first mount just wrote and skip the boot.
const alreadyBooted = (() => {
  try {
    return sessionStorage.getItem('cliqueBooted') === '1';
  } catch {
    return false;
  }
})();

// CRT-style fake BIOS boot replacing the plain intro loader. Shows once per
// browser session (sessionStorage) so route hops / reloads don't replay it.
export function BootScreen() {
  const [show, setShow] = useState(!alreadyBooted);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem('cliqueBooted', '1');
    } catch {
      // ignore
    }
    const t = window.setTimeout(() => setShow(false), 3400);
    return () => window.clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#050705',
        padding: 'clamp(20px, 6vw, 70px)',
        boxSizing: 'border-box',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#7CFF9B',
        fontSize: 'clamp(11px, 1.5vw, 15px)',
        lineHeight: 2.1,
        letterSpacing: '0.08em',
        animation: 'wipeUp 0.7s cubic-bezier(0.76, 0, 0.24, 1) 2.55s both',
        overflow: 'hidden',
      }}
    >
      {/* scanlines + vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #00000066 3px, transparent 4px)',
          animation: 'crtFlicker 3.4s steps(1) infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 55%, #000000B3 100%)',
        }}
      />

      <div style={{ opacity: 0.55, marginBottom: 18, animation: 'fadeUp 0.3s both' }}>
        ██████╗ CLIQUE(R) SYSTEMS
      </div>

      {BOOT_LINES.map((line, i) => (
        <div key={i} style={{ animation: `fadeUp 0.18s ${0.25 + i * 0.28}s both` }}>
          <span style={{ opacity: 0.5 }}>&gt; </span>
          {line}
          {i === BOOT_LINES.length - 1 && (
            <span
              style={{
                display: 'inline-block',
                width: 9,
                height: 15,
                background: '#7CFF9B',
                marginLeft: 6,
                verticalAlign: 'text-bottom',
                animation: 'blink 0.8s step-end infinite',
              }}
            />
          )}
        </div>
      ))}

      <div
        style={{
          marginTop: 24,
          width: 'min(340px, 70vw)',
          height: 10,
          border: '1px solid #7CFF9B66',
          padding: 2,
          animation: `fadeUp 0.2s ${0.25 + BOOT_LINES.length * 0.28}s both`,
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#7CFF9B',
            boxShadow: '0 0 12px #7CFF9B',
            animation: 'loaderBar 0.9s cubic-bezier(0.65, 0, 0.35, 1) 1.9s both',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(20px, 6vw, 70px)',
          left: 'clamp(20px, 6vw, 70px)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          animation: 'fadeUp 0.4s 2.1s both',
        }}
      >
        <Logo size={54} />
        <span
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(26px, 4vw, 48px)',
            color: '#F5F3F0',
            lineHeight: 1,
          }}
        >
          CLIQUE<span style={{ color: '#7CFF9B' }}>.</span>
        </span>
      </div>
    </div>
  );
}
