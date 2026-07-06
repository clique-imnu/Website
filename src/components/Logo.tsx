import { type CSSProperties } from 'react';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  wordmarkSize?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

// One source of truth for the CLIQUE brand mark. The PNG lives at
// `public/logo.png` and is served at `/logo.png`. `withWordmark` shows the
// icon + "CLIQUE." text (used in the nav / boot screen); the icon alone is
// the compact mode for tight spots (top bars).
export function Logo({ size = 36, withWordmark = false, wordmarkSize = 18, onClick, ariaLabel = 'CLIQUE — home' }: LogoProps) {
  const imgStyle: CSSProperties = {
    width: size,
    height: size,
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 32%, transparent))',
  };

  const inner = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: withWordmark ? Math.round(wordmarkSize * 0.55) : 0,
        textDecoration: 'none',
      }}
    >
      <img src="/logo.png" alt="" style={imgStyle} aria-hidden />
      {withWordmark && (
        <span
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 800,
            fontSize: wordmarkSize,
            letterSpacing: '0.06em',
            color: '#F5F3F0',
            lineHeight: 1,
          }}
        >
          CLIQUE<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        {inner}
      </button>
    );
  }
  return inner;
}
