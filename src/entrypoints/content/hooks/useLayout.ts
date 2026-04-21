import { useState, useEffect } from 'preact/hooks';

export function useLayout(inputBox?: HTMLElement | null) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf = 0;
    const notify = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setTick((t) => t + 1);
        raf = 0;
      });
    };

    const ro = inputBox ? new ResizeObserver(notify) : null;
    ro?.observe(inputBox!);

    window.addEventListener('resize', notify);
    window.addEventListener('scroll', notify, true);
    return () => {
      window.removeEventListener('resize', notify);
      window.removeEventListener('scroll', notify, true);
      ro?.disconnect();
    };
  }, [inputBox]);

  return tick;
}
