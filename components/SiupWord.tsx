'use client';

import { useRef } from 'react';
import { useAudioFrame } from './SoundProvider';
import { pulse } from '@/lib/pulse';

type Props = {
  text?: string;
  className?: string;
  /** how hard the letters react, 0..1.5 */
  intensity?: number;
  onClick?: () => void;
  ariaLabel?: string;
  as?: 'h1' | 'div' | 'span';
};

/**
 * Giant variable-width letters. They stretch with the live audio level,
 * with the visual pulse, and toward the pointer.
 */
export default function SiupWord({ text = 'SIUP', className = '', intensity = 1, onClick, ariaLabel, as = 'div' }: Props) {
  const wrap = useRef<HTMLElement | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const smooth = useRef<number[]>([]);

  useAudioFrame((level, t) => {
    const el = wrap.current;
    if (!el) return;
    const letters = el.querySelectorAll<HTMLSpanElement>('[data-l]');
    const energy = Math.min(1.2, Math.max(level, pulse(t)) * intensity);
    letters.forEach((s, i) => {
      let near = 0;
      if (pointer.current) {
        const r = s.getBoundingClientRect();
        const dx = (r.left + r.width / 2 - pointer.current.x) / Math.max(200, r.width * 1.6);
        near = Math.max(0, 1 - Math.abs(dx)) * 0.55;
      }
      const wob = 0.65 + 0.35 * Math.sin(t / 90 + i * 1.3);
      const target = Math.min(1, energy * wob + near);
      const prev = smooth.current[i] ?? 0;
      const v = prev + (target - prev) * 0.22;
      smooth.current[i] = v;
      s.style.setProperty('--k', v.toFixed(3));
    });
  });

  const Tag = as as 'div';
  return (
    <Tag
      ref={(n: HTMLElement | null) => { wrap.current = n; }}
      className={`siup-word ${onClick ? 'is-clickable' : ''} ${className}`}
      aria-label={ariaLabel || text}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      onPointerMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY }; }}
      onPointerLeave={() => { pointer.current = null; }}
    >
      {text.split('').map((c, i) => (
        <span key={i} data-l aria-hidden="true">{c}</span>
      ))}
    </Tag>
  );
}
