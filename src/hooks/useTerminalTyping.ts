import { useEffect, useState } from 'react';

// Types the Convergence card's terminal lines out one character at a time,
// pauses, then clears and loops — a lightweight "live demo" feel.
export function useTerminalTyping(lines: string[]): string {
  const [text, setText] = useState('');

  useEffect(() => {
    let out = '';
    let li = 0;
    let ci = 0;
    let timer = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (li >= lines.length) {
        timer = window.setTimeout(() => {
          out = '';
          li = 0;
          ci = 0;
          setText('');
          timer = window.setTimeout(step, 300);
        }, 3600);
        return;
      }
      const line = lines[li];
      ci++;
      setText(out + line.slice(0, ci));
      if (ci >= line.length) {
        out += line + '\n';
        li++;
        ci = 0;
        timer = window.setTimeout(step, 520);
      } else {
        timer = window.setTimeout(step, 26 + Math.random() * 42);
      }
    };

    timer = window.setTimeout(step, 2400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [lines]);

  return text;
}
