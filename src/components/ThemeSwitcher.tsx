import { ACCENT_OPTIONS } from '../lib/content';

interface ThemeSwitcherProps {
  accent: string;
  onPick: (color: string) => void;
}

export function ThemeSwitcher({ accent, onPick }: ThemeSwitcherProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }} title="pick ur color">
      {ACCENT_OPTIONS.map((color) => (
        <button
          key={color}
          onClick={() => onPick(color)}
          aria-label={`accent ${color}`}
          style={{
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: color,
            border: accent === color ? '2px solid #F5F3F0' : '2px solid transparent',
            padding: 0,
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
            transform: accent === color ? 'scale(1.25)' : 'scale(1)',
          }}
        />
      ))}
    </span>
  );
}
