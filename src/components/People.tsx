import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FACULTY_COORDINATOR, MEMBER_ROWS } from '../lib/content';
import { slugForName } from '../lib/members';
import { useScramble } from '../hooks/useScramble';
import { SectionTag } from './SectionTag';

export function People() {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  useScramble(line1Ref);
  useScramble(line2Ref);

  return (
    <section id="people" style={{ padding: '120px 0', borderTop: '1px dashed #FFFFFF1F', overflow: 'hidden', position: 'relative' }}>
      <div data-mpad="true" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box' }}>
        <SectionTag fig="05" label="THE PEOPLE" marginBottom={20} />
        <h2
          data-reveal="true"
          data-reveal-delay="100"
          style={{ margin: '0 0 14px 0', fontFamily: "'Unbounded', sans-serif", fontWeight: 800, fontSize: 'clamp(34px, 5vw, 64px)', letterSpacing: '-0.01em' }}
        >
          <span ref={line1Ref} style={{ display: 'block' }}>13 members.</span>
          <span ref={line2Ref} style={{ display: 'block' }}>One clique.</span>
        </h2>
        <div
          data-reveal="true"
          data-reveal-delay="200"
          style={{
            margin: '0 0 12px 0',
            fontFamily: "'Shantell Sans', cursive",
            fontWeight: 600,
            fontSize: 19,
            color: 'var(--lime)',
            rotate: '-1.2deg',
            width: 'fit-content',
          }}
        >
          certified main characters, every single one ✦
        </div>
        <div
          data-reveal="true"
          data-reveal-delay="280"
          style={{
            margin: '0 0 56px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#0B0B0B',
            background: 'var(--accent)',
            padding: '10px 18px',
            borderRadius: 100,
            border: '2px solid #0B0B0B',
            boxShadow: '4px 4px 0 #00000080',
            animation: 'pulseGlow 2.4s ease-in-out infinite',
          }}
        >
          👆 TAP A NAME TO OPEN THE DOSSIER <span style={{ fontSize: 16 }}>→</span>
        </div>
      </div>

      <div data-reveal="true" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {MEMBER_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} data-skew="1" style={{ overflow: 'hidden', willChange: 'transform' }}>
            <div
              data-marquee="true"
              style={{
                display: 'flex',
                width: 'max-content',
                animation: `${row.direction === 'reverse' ? 'tickerRev' : 'ticker'} calc(var(--ticker-dur) * ${row.speedMult}) linear infinite`,
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.6vw, 52px)',
                letterSpacing: '-0.01em',
                color: row.outline ? 'transparent' : '#F5F3F0',
                WebkitTextStroke: row.outline ? '1px #5E574E' : undefined,
              }}
            >
              {[0, 1].map((copy) => (
                <span key={copy} style={{ paddingRight: 20 }}>
                  {row.names.map((name, i) => (
                    <Fragment key={i}>
                      <Link to={`/people/${slugForName(name)}`} className="glitch-name">
                        {name}
                      </Link>{' '}
                      <span style={{ color: row.outline ? undefined : 'var(--accent)' }}>✦</span>{' '}
                    </Fragment>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        data-reveal="true"
        data-reveal-delay="150"
        style={{
          maxWidth: 1200,
          margin: '72px auto 0 auto',
          padding: '0 32px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '1px dashed var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'var(--accent)',
            animation: 'spinSlow 16s linear infinite',
          }}
        >
          ✦
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>{FACULTY_COORDINATOR}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#9A948C', marginTop: 3 }}>
            FACULTY COORDINATOR
          </div>
        </div>
      </div>
    </section>
  );
}
