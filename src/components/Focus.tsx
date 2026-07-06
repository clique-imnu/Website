import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import { FOCUS_CARDS, TERMINAL_LINES } from '../lib/content';
import { useTerminalTyping } from '../hooks/useTerminalTyping';
import { SectionTag } from './SectionTag';

interface FocusProps {
  cardCanvasRef: RefObject<HTMLCanvasElement | null>;
}

const cardBase: CSSProperties = {
  border: '1px solid #FFFFFF14',
  borderRadius: 20,
  padding: '34px 30px',
  background: '#FFFFFF08',
  backdropFilter: 'blur(14px)',
  transformStyle: 'preserve-3d',
  willChange: 'transform',
  transition: 'border-color 0.3s',
  position: 'relative',
};

const moduleTag: CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 16,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.2em',
  color: '#4A443C',
};

const stickerPill: CSSProperties = {
  color: '#0B0B0B',
  fontFamily: "'Shantell Sans', cursive",
  fontWeight: 700,
  fontSize: 13,
  padding: '6px 13px',
  borderRadius: 100,
  border: '2px solid #0B0B0B',
  boxShadow: '3px 3px 0 #00000080',
};

const cardNum: CSSProperties = {
  fontFamily: "'Unbounded', sans-serif",
  fontWeight: 800,
  fontSize: 15,
  color: '#5A5248',
  marginBottom: 30,
};

const cardTitle: CSSProperties = {
  margin: '0 0 14px 0',
  fontFamily: "'Unbounded', sans-serif",
  fontWeight: 600,
  fontSize: 22,
  lineHeight: 1.3,
};

const cardBody: CSSProperties = {
  margin: 0,
  color: '#9A948C',
  lineHeight: 1.65,
  fontSize: 15,
};

// -- Card 2 visual: EQ bars for the speaker sessions card
const EQ_BARS = [
  { duration: '1.1s', delay: '-0.2s', opacity: 0.9 },
  { duration: '0.9s', delay: '-0.6s', opacity: 0.55 },
  { duration: '1.3s', delay: '-0.4s', opacity: 0.75 },
  { duration: '0.8s', delay: '-0.9s', opacity: 0.4 },
  { duration: '1.05s', delay: '-0.1s', opacity: 0.85 },
  { duration: '1.2s', delay: '-0.75s', opacity: 0.5 },
  { duration: '0.95s', delay: '-0.35s', opacity: 0.7 },
];

// -- Card 3 visual: rolling die that cycles through faces
const DIE_PIPS: Record<number, [number, number][]> = {
  1: [[30, 30]],
  2: [[18, 18], [42, 42]],
  3: [[18, 18], [30, 30], [42, 42]],
  4: [[18, 18], [42, 18], [18, 42], [42, 42]],
  5: [[18, 18], [42, 18], [30, 30], [18, 42], [42, 42]],
  6: [[18, 18], [42, 18], [18, 30], [42, 30], [18, 42], [42, 42]],
};

function RollingDie({ color }: { color: string }) {
  const [face, setFace] = useState(1);
  useEffect(() => {
    const t = window.setInterval(() => setFace((f) => (f % 6) + 1), 700);
    return () => window.clearInterval(t);
  }, []);
  const pips = DIE_PIPS[face];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, marginBottom: 30 }}>
      <div style={{ perspective: 200 }}>
        <svg
          viewBox="0 0 60 60"
          width="64"
          height="64"
          style={{ display: 'block', animation: 'spinSlow 6s linear infinite', transformStyle: 'preserve-3d' }}
        >
          <rect x="5" y="5" width="50" height="50" rx="9" fill="none" stroke={color} strokeWidth="2" opacity="0.9" />
          <rect x="9" y="9" width="42" height="42" rx="6" fill={color} opacity="0.06" />
          {pips.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill={color} />
          ))}
        </svg>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#6E6862' }}>
        ROLL: {face} · GG WP
      </div>
    </div>
  );
}

export function Focus({ cardCanvasRef }: FocusProps) {
  const terminalText = useTerminalTyping(TERMINAL_LINES);

  return (
    <section
      id="focus"
      data-mpad="true"
      style={{ padding: '140px 32px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box' }}
    >
      <SectionTag fig="03" label="WHAT WE DO" marginBottom={48} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, perspective: 1200 }} data-mod-a="true">
        {/* ── Card 1 · Hands-on Learning · terminal (full width) ── */}
        <div
          data-reveal-3d="0"
          data-tilt="true"
          data-mod-a="true"
          className="hover-card"
          style={{
            ...cardBase,
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div style={moduleTag}>MODULE_A · REV 2.6</div>
          <div>
            <div style={cardNum}>{FOCUS_CARDS.handsOn.tag}</div>
            <h3 style={cardTitle}>{FOCUS_CARDS.handsOn.title}</h3>
            <p style={cardBody}>{FOCUS_CARDS.handsOn.body}</p>
            <div style={{ position: 'absolute', bottom: -13, left: 28, rotate: '-3deg', background: 'var(--lime)', ...stickerPill }}>
              {FOCUS_CARDS.handsOn.sticker}
            </div>
          </div>
          <div
            style={{
              background: '#0B0B0BCC',
              border: '1px solid #FFFFFF12',
              borderRadius: 12,
              padding: '18px 20px',
              minHeight: 170,
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #00000052 3px, transparent 4px)', animation: 'crtFlicker 3.4s steps(1) infinite' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '-26%', height: '34%', pointerEvents: 'none', zIndex: 2, background: 'linear-gradient(180deg, transparent, #D9C4A30E 45%, #FFFFFF14 50%, #D9C4A30E 55%, transparent)', animation: 'crtSweep 4.6s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'radial-gradient(ellipse at center, transparent 58%, #00000059 100%)' }} />
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, color: '#D9C4A3', whiteSpace: 'pre-wrap', minHeight: 110 }}>
              <span>{terminalText}</span>
              <span style={{ display: 'inline-block', width: 8, height: 15, background: 'var(--accent)', verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
            </div>
          </div>
        </div>

        {/* ── Card 2 · Industry Connect · EQ bars ── */}
        <div data-reveal-3d="120" data-tilt="true" className="hover-card" style={cardBase}>
          <div style={moduleTag}>MODULE_B</div>
          <div style={cardNum}>{FOCUS_CARDS.industry.tag}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 64, marginBottom: 30 }}>
            {EQ_BARS.map((bar, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: '100%',
                  background: 'var(--accent)',
                  transformOrigin: 'bottom',
                  animation: `eq ${bar.duration} ease-in-out ${bar.delay} infinite`,
                  borderRadius: 3,
                  opacity: bar.opacity,
                }}
              />
            ))}
            <div style={{ marginLeft: 12, alignSelf: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#6E6862' }}>
              <span style={{ color: 'var(--lime)' }}>●</span> MIC ON
            </div>
          </div>
          <h3 style={cardTitle}>{FOCUS_CARDS.industry.title}</h3>
          <p style={cardBody}>{FOCUS_CARDS.industry.body}</p>
          <div style={{ position: 'absolute', bottom: -13, right: 22, rotate: '3deg', background: 'var(--pink)', ...stickerPill }}>
            {FOCUS_CARDS.industry.sticker}
          </div>
        </div>

        {/* ── Card 3 · Events & Engagement · rolling die ── */}
        <div data-reveal-3d="200" data-tilt="true" className="hover-card" style={cardBase}>
          <div style={moduleTag}>MODULE_C</div>
          <div style={cardNum}>{FOCUS_CARDS.events.tag}</div>
          <RollingDie color="var(--accent)" />
          <h3 style={cardTitle}>{FOCUS_CARDS.events.title}</h3>
          <p style={cardBody}>{FOCUS_CARDS.events.body}</p>
          <div style={{ position: 'absolute', bottom: -13, left: 26, rotate: '-2deg', background: 'var(--accent)', ...stickerPill }}>
            {FOCUS_CARDS.events.sticker}
          </div>
        </div>

        {/* ── Card 4 · Community Building · icosahedron network (full width) ── */}
        <div
          data-reveal-3d="280"
          data-tilt="true"
          data-mod-a="true"
          className="hover-card"
          style={{
            ...cardBase,
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 32,
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={moduleTag}>MODULE_D · NETWORK</div>
          <div
            style={{
              position: 'relative',
              background: '#0B0B0BCC',
              border: '1px solid #FFFFFF12',
              borderRadius: 12,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <canvas ref={cardCanvasRef} style={{ width: '100%', height: 220, display: 'block' }} />
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.2em',
                color: '#6E6862',
              }}
            >
              NODES 13 · EDGES ∞
            </div>
          </div>
          <div>
            <div style={cardNum}>{FOCUS_CARDS.community.tag}</div>
            <h3 style={cardTitle}>{FOCUS_CARDS.community.title}</h3>
            <p style={cardBody}>{FOCUS_CARDS.community.body}</p>
            <div style={{ position: 'absolute', bottom: -13, right: 28, rotate: '3deg', background: 'var(--lime)', ...stickerPill }}>
              {FOCUS_CARDS.community.sticker}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
