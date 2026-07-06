import { Link } from 'react-router-dom';
import { FilmGrain } from '../components/FilmGrain';

export function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0B0B',
        color: '#7CFF9B',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 'clamp(12px, 1.6vw, 16px)',
        lineHeight: 2.2,
        letterSpacing: '0.06em',
        padding: 'clamp(24px, 8vw, 90px)',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <FilmGrain />
      <div style={{ animation: 'fadeUp 0.4s both' }}>$ cd {typeof location !== 'undefined' ? location.pathname : '/???'}</div>
      <div style={{ animation: 'fadeUp 0.4s 0.3s both', color: '#FF6FB5' }}>
        bash: no such file or directory (404)
      </div>
      <div style={{ animation: 'fadeUp 0.4s 0.7s both' }}>$ vibe --check</div>
      <div style={{ animation: 'fadeUp 0.4s 1.0s both', color: '#9A948C' }}>→ lost, but the aura is intact</div>
      <div style={{ animation: 'fadeUp 0.4s 1.4s both', marginTop: 16 }}>
        ${' '}
        <Link to="/" style={{ color: '#7CFF9B', textDecorationStyle: 'dashed', textUnderlineOffset: 5 }}>
          cd /clique
        </Link>
        <span style={{ display: 'inline-block', width: 9, height: 16, background: '#7CFF9B', marginLeft: 8, verticalAlign: 'text-bottom', animation: 'blink 0.9s step-end infinite' }} />
      </div>
    </div>
  );
}
