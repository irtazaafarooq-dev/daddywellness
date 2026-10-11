'use client';

import { useEffect, useRef } from 'react';

/** Counts up to `value` the first time it scrolls into view. Renders the final value for SSR/SEO. */
export default function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1600);
        const v = value * (1 - Math.pow(1 - p, 4));
        el.textContent = v.toFixed(decimals) + suffix;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, decimals, suffix]);
  return <b ref={ref}>{value.toFixed(decimals)}{suffix}</b>;
}
