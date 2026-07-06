interface SectionTagProps {
  fig: string;
  label: string;
  marginBottom?: number;
  revealDelay?: number;
}

export function SectionTag({ fig, label, marginBottom = 40, revealDelay }: SectionTagProps) {
  return (
    <div
      data-reveal="true"
      data-reveal-delay={revealDelay}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        letterSpacing: '0.22em',
        color: 'var(--accent)',
        marginBottom,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ color: '#6E6862' }}>FIG. {fig}</span>
      <span style={{ width: 34, height: 1, background: '#3A3630', display: 'inline-block' }} />
      {label}
    </div>
  );
}
