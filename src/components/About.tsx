import { useRef } from 'react';
import { useWordReveal } from '../hooks/useWordReveal';
import { SectionTag } from './SectionTag';

export function About() {
  const wordsRef = useRef<HTMLParagraphElement>(null);
  useWordReveal(wordsRef);

  return (
    <section
      id="about"
      data-mpad="true"
      style={{
        padding: '160px 32px 120px 32px',
        maxWidth: 1200,
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 24, left: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#3A3630' }}>
        +
      </div>
      <div style={{ position: 'absolute', top: 24, right: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#3A3630' }}>
        +
      </div>
      <div
        style={{
          position: 'absolute',
          top: 90,
          right: 0,
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(110px, 16vw, 260px)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px #242019',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        01
      </div>

      <SectionTag fig="01" label="WHO WE ARE" marginBottom={40} />

      <p
        ref={wordsRef}
        style={{
          margin: 0,
          fontSize: 'clamp(30px, 4.4vw, 60px)',
          lineHeight: 1.18,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          maxWidth: 1050,
          position: 'relative',
        }}
      >
        We are a{' '}
        <span
          style={{
            background: 'var(--lime)',
            color: '#0B0B0B',
            padding: '0.02em 0.18em',
            borderRadius: 10,
            display: 'inline-block',
            rotate: '-1.2deg',
          }}
        >
          student-led community
        </span>{' '}
        passionate about technology, analytics, and innovation. Together, we learn, collaborate, and grow{' '}
        <span
          style={{
            background: 'var(--pink)',
            color: '#0B0B0B',
            padding: '0.02em 0.18em',
            borderRadius: 10,
            display: 'inline-block',
            rotate: '1deg',
          }}
        >
          beyond the classroom
        </span>
        .
      </p>
    </section>
  );
}
