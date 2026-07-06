import { useState } from 'react';

const STORAGE_KEY = 'cliqueChai';

// The club-wide count is a deterministic function of the date (so it keeps
// "growing" between visits) plus this visitor's own taps from localStorage.
function baseCount(): number {
  const days = Math.floor((Date.now() - new Date('2024-06-01T00:00:00Z').getTime()) / 86400000);
  return 4200 + days * 3;
}

function localCount(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function ChaiCounter() {
  const [extra, setExtra] = useState(localCount);
  const [popping, setPopping] = useState(false);

  const sip = () => {
    const next = extra + 1;
    setExtra(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
    setPopping(true);
    window.setTimeout(() => setPopping(false), 250);
  };

  const total = baseCount() + extra;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
      <span>
        CHAI_CONSUMED: <span style={{ color: 'var(--lime)' }}>{total.toLocaleString('en-IN')}</span>
      </span>
      <button
        onClick={sip}
        aria-label="add one chai"
        style={{
          cursor: 'pointer',
          background: 'transparent',
          border: '1px dashed #FFFFFF33',
          color: '#9A948C',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.1em',
          padding: '4px 10px',
          borderRadius: 100,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s',
          transform: popping ? 'scale(1.25) rotate(-4deg)' : 'none',
        }}
        className="hover-sound"
      >
        +1 ☕
      </button>
    </div>
  );
}
