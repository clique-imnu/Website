import { forwardRef } from 'react';

export const ScrollProgress = forwardRef<HTMLDivElement>((_props, ref) => (
  <div
    ref={ref}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: 3,
      width: '0%',
      background: 'linear-gradient(90deg, var(--accent), var(--pink), var(--lime))',
      zIndex: 60,
      boxShadow: '0 0 12px var(--accent)',
    }}
  />
));
ScrollProgress.displayName = 'ScrollProgress';
