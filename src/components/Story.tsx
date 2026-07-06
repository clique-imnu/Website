import type { RefObject } from 'react';
import { STORY_EXPLODE_LABELS, STORY_PHASES } from '../lib/content';

interface StoryProps {
  storySectionRef: RefObject<HTMLElement | null>;
  storyCanvasRef: RefObject<HTMLCanvasElement | null>;
  storyGlowRef: RefObject<HTMLDivElement | null>;
  storyReadoutRef: RefObject<HTMLSpanElement | null>;
}

const LABEL_POSITIONS = [
  { marginLeft: '-30vmin', marginTop: '-20vmin', textAlign: 'right' as const, lineAlign: 'margin: 8px 0 0 auto;' },
  { marginLeft: '30vmin', marginTop: '-8vmin', textAlign: 'left' as const, lineAlign: 'margin: 8px auto 0 0;' },
  { marginLeft: '0', marginTop: '26vmin', textAlign: 'center' as const, lineAlign: 'margin: 8px auto 0 auto;' },
];

export function Story({ storySectionRef, storyCanvasRef, storyGlowRef, storyReadoutRef }: StoryProps) {
  return (
    <section
      id="story"
      ref={storySectionRef as RefObject<HTMLElement>}
      style={{ height: '420vh', position: 'relative', borderTop: '1px dashed #FFFFFF1F' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          ref={storyGlowRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '70vmin',
            height: '70vmin',
            translate: '-50% -50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)',
            filter: 'blur(50px)',
            willChange: 'opacity',
          }}
        />
        <canvas
          ref={storyCanvasRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 'min(92vmin, 780px)',
            height: 'min(92vmin, 780px)',
            translate: '-50% -50%',
          }}
        />

        {STORY_EXPLODE_LABELS.map((item, i) => {
          const pos = LABEL_POSITIONS[i];
          return (
            <div
              key={i}
              data-explode-label={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                translate: '-50% -50%',
                marginLeft: pos.marginLeft,
                marginTop: pos.marginTop,
                opacity: 0,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '0.18em',
                color: '#F5F3F0',
                textAlign: pos.textAlign,
                willChange: 'opacity, transform',
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: 4 }}>{item.tag}</div>
              {item.label}
              <div
                style={{
                  width: 70,
                  height: 1,
                  background: '#FFFFFF33',
                  margin: i === 0 ? '8px 0 0 auto' : i === 1 ? '8px auto 0 0' : '8px auto 0 auto',
                }}
              />
            </div>
          );
        })}

        {STORY_PHASES.map((phase, i) => (
          <div
            key={i}
            data-phase={i}
            style={{
              position: 'absolute',
              left: '6vw',
              bottom: '12vh',
              maxWidth: 460,
              opacity: 0,
              willChange: 'opacity, transform, filter',
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>
              {phase.tag}
            </div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.6vw, 52px)', lineHeight: 1.1 }}>
              {phase.title}
            </div>
            <p style={{ margin: '16px 0 0 0', color: '#9A948C', fontSize: 16, lineHeight: 1.6 }}>{phase.body}</p>
          </div>
        ))}

        <div
          data-mhide="true"
          style={{
            position: 'absolute',
            right: 32,
            bottom: 32,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.2em',
            color: '#6E6862',
            textAlign: 'right',
            lineHeight: 1.9,
          }}
        >
          FIG. 02 — SCROLL SCENE
          <br />
          CAMERA: SCROLL-BOUND
          <br />
          <span ref={storyReadoutRef}>T+0.00</span>
        </div>
      </div>
    </section>
  );
}
