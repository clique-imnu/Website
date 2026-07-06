interface SocialIconProps {
  icon: 'instagram' | 'linkedin' | 'globe';
  size?: number;
}

// Inline monoline SVG icons — sharp at any DPI, no dependency, colour follows
// currentColor so the parent link can drive hover states.
export function SocialIcon({ icon, size = 18 }: SocialIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (icon === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
      </svg>
    );
  }
  if (icon === 'linkedin') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="8" y1="10" x2="8" y2="17" />
        <circle cx="8" cy="7" r="0.9" fill="currentColor" stroke="none" />
        <path d="M12 17v-4a2.5 2.5 0 015 0v4M12 10v7" />
      </svg>
    );
  }
  // globe
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  );
}
