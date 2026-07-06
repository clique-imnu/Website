import { useEffect, useState } from 'react';

// Live IST clock shown in the footer.
export function useClock(): string {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }),
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}
