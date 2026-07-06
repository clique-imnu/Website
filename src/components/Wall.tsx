import { useRef } from 'react';
import { MEMORY_CARDS } from '../lib/content';
import { useMemoryGlobe } from '../hooks/useMemoryGlobe';
import { useScramble } from '../hooks/useScramble';
import { SectionTag } from './SectionTag';

const JOKES = MEMORY_CARDS.map((c) => c.joke);

export function Wall() {
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tip = useMemoryGlobe(globeWrapRef, JOKES);
  useScramble(headingRef);

  return (
    <section
      id="wall"
      data-mpad="true"
      style={{ padding: '120px 32px 140px 32px', borderTop: '1px dashed #FFFFFF1F', maxWidth: 1240, margin: '0 auto', boxSizing: 'border-box', position: 'relative' }}
    >
      <SectionTag fig="04" label="THE MEMORY GLOBE" marginBottom={20} />

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 70 }}>
        <h2
          ref={headingRef}
          data-reveal="true"
          data-reveal-delay="100"
          style={{ margin: 0, fontFamily: "'Unbounded', sans-serif", fontWeight: 800, fontSize: 'clamp(34px, 5vw, 64px)', letterSpacing: '-0.01em' }}
        >
          Proof of life.
        </h2>
        <div data-reveal="true" data-reveal-delay="200" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.16em', color: '#6E6862' }}>
          SPIN IT · TAP A MEMORY FOR THE LORE
        </div>
      </div>

      <div
        data-reveal="true"
        ref={globeWrapRef}
        style={{
          position: 'relative',
          height: 'min(96vw, 640px)',
          cursor: 'grab',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            width: 'min(72vw, 500px)',
            height: 'min(72vw, 500px)',
            borderRadius: '50%',
            border: '1px dashed #FFFFFF12',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            width: 'min(90vw, 640px)',
            height: 'min(32vw, 210px)',
            borderRadius: '50%',
            border: '1px dashed #FFFFFF0E',
            rotate: '-16deg',
            pointerEvents: 'none',
          }}
        />

        {MEMORY_CARDS.map((card) => (
          <div
            key={card.id}
            data-globe-card={card.i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'clamp(92px, 15vw, 146px)',
              boxSizing: 'border-box',
              background: '#F5F3F0',
              padding: '6px 6px 4px 6px',
              boxShadow: '0 12px 34px #00000073',
              willChange: 'transform, opacity',
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.2)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -9,
                left: '50%',
                translate: '-50% 0',
                rotate: card.tapeRot,
                width: 46,
                height: 15,
                background: card.tape,
                opacity: 0.85,
                boxShadow: '0 2px 5px #00000033',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                overflow: 'hidden',
                background: '#171512',
                border: '1px dashed #FFFFFF24',
              }}
            >
              <img
                src={card.src}
                alt={card.label}
                draggable={false}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: 6,
                aspectRatio: '1',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
                background:
                  'radial-gradient(circle at 82% 8%, #FF9E5A4D, transparent 52%), radial-gradient(circle at 6% 94%, #FF6FB533, transparent 46%), linear-gradient(205deg, #FFDCA91F, transparent 42%)',
              }}
            />
            <div
              style={{
                fontFamily: "'Shantell Sans', cursive",
                fontWeight: 600,
                fontSize: 12,
                color: '#23201C',
                padding: '4px 2px 2px 2px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.label}
            </div>
          </div>
        ))}

        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '2%',
            translate: tip.visible ? '-50% -8px' : '-50% 0px',
            zIndex: 600,
            background: 'var(--lime)',
            color: '#0B0B0B',
            fontFamily: "'Shantell Sans', cursive",
            fontWeight: 700,
            fontSize: 'clamp(13px, 1.7vw, 18px)',
            padding: '10px 18px',
            borderRadius: 100,
            border: '2px solid #0B0B0B',
            boxShadow: '4px 4px 0 #00000080',
            opacity: tip.visible ? 1 : 0,
            transition: 'opacity 0.25s, translate 0.3s',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            maxWidth: '94%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {tip.text}
        </div>
      </div>

      <div
        data-reveal="true"
        style={{ textAlign: 'center', marginTop: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#6E6862' }}
      >
        DRAG TO SPIN <span style={{ color: 'var(--accent)' }}>✦</span> TAP A PHOTO FOR THE LORE
      </div>

      <div style={{ position: 'absolute', bottom: 40, right: 20, width: 110, height: 110, animation: 'spinSlow 22s linear infinite', opacity: 0.85, pointerEvents: 'none' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <path id="stampCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <circle cx="50" cy="50" r="47" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 4" />
          <text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.35em', fill: 'var(--accent)' }}>
            <textPath href="#stampCircle">CLIQUE ✦ IMNU ✦ IT &amp; ANALYTICS ✦</textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
