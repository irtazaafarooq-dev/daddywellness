'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SiupWord from './SiupWord';
import { useSound } from './SoundProvider';
import { engine, type Variant } from '@/lib/siup-audio';
import { kick } from '@/lib/pulse';
import { SPELLINGS } from '@/lib/site';

const VARIANTS: { id: Variant; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'long', label: 'Looong' },
  { id: 'underwater', label: 'Underwater' },
  { id: 'legendary', label: 'Legendary' },
  { id: 'chipmunk', label: 'Chipmunk' },
];

const RANKS: [number, string][] = [
  [0, 'Not SIUP’d yet'],
  [1, 'First SIUP'],
  [5, 'SIUP rookie'],
  [15, 'SIUP enjoyer'],
  [40, 'SIUP mogger'],
  [100, 'Legendary SIUPer'],
];
const rankOf = (n: number) => RANKS.filter(([min]) => n >= min).pop()![1];
const KEY = 'dw-siups';

export default function Soundboard() {
  const { enabled, enable } = useSound();
  const [variant, setVariant] = useState<Variant>('classic');
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState<string | null>(null);
  const [hit, setHit] = useState(false);
  const burst = useRef<HTMLDivElement>(null);
  const variantRef = useRef(variant);
  variantRef.current = variant;

  useEffect(() => {
    try { setCount(Number(localStorage.getItem(KEY)) || 0); } catch {}
  }, []);

  const spray = useCallback((v: Variant) => {
    const host = burst.current;
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const n = v === 'legendary' ? 14 : 8;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = SPELLINGS[Math.floor(Math.random() * SPELLINGS.length)] + '!';
      const size = 18 + Math.random() * (v === 'legendary' ? 46 : 30);
      s.style.fontSize = `${size}px`;
      if (v === 'underwater') s.style.color = '#2a7fd4';
      host.appendChild(s);
      const a = Math.random() * Math.PI * 2;
      const d = 170 + Math.random() * 190;
      const rot = (Math.random() - 0.5) * 60;
      s.animate(
        [
          { transform: 'translate(-50%,-50%) scale(.3) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1) rotate(${rot}deg)`, opacity: 1, offset: 0.7 },
          { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.15}px), calc(-50% + ${Math.sin(a) * d * 1.15 + 40}px)) scale(.9) rotate(${rot * 1.4}deg)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.16,1,.3,1)' },
      ).onfinish = () => s.remove();
    }
  }, []);

  const siup = useCallback(async (v: Variant = variantRef.current) => {
    if (!enabled) await enable();
    engine.play(v);
    kick(v === 'legendary' ? 1.15 : 1, v === 'long' ? 1500 : 800);
    spray(v);
    setHit(true);
    setTimeout(() => setHit(false), 140);
    setCount((c) => {
      const next = c + 1;
      try { localStorage.setItem(KEY, String(next)); } catch {}
      if (rankOf(next) !== rankOf(c)) {
        setUnlocked(rankOf(next));
        setTimeout(() => setUnlocked(null), 2400);
      }
      return next;
    });
  }, [enabled, enable, spray]);

  // press S anywhere (outside form fields) to SIUP
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 's' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]')) return;
      void siup();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [siup]);

  return (
    <section id="soundboard" aria-labelledby="sb-title">
      <div className="eyebrow label"><span>02 — The soundboard</span><span>Press <kbd>S</kbd> anywhere</span></div>
      <div className="board">
        <div>
          <h2 id="sb-title" className="h-lg" data-reveal>Go on.<br /><span className="red">Hit the SIUP.</span></h2>
          <p className="lead" style={{ marginTop: 24 }} data-reveal>
            Pick a flavour, smash the tin. Every SIUP counts toward your rank. <strong>Nobody stops at one.</strong>
          </p>
          <div className="variants" role="group" aria-label="SIUP flavour" data-reveal>
            {VARIANTS.map((v) => (
              <button key={v.id} aria-pressed={variant === v.id} onClick={() => { setVariant(v.id); void siup(v.id); }}>{v.label}</button>
            ))}
          </div>
          <div className="score" data-reveal>
            <b aria-live="polite">{count}</b>
            <div>
              <div className="label" style={{ color: 'var(--mute)', marginBottom: 8 }}>Your SIUPs</div>
              <span className="rank">{rankOf(count)}</span>
            </div>
          </div>
        </div>
        <div className="tin-wrap">
          <button className={`tin ${hit ? 'hit' : ''}`} onClick={() => void siup()} aria-label={`Play the ${variant} SIUP`}>
            <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs><path id="circ" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" /></defs>
              <text><textPath href="#circ" textLength="262" lengthAdjust="spacing">Warning: this could blow your mind ✦ Warning ✦</textPath></text>
            </svg>
            <SiupWord intensity={1.2} />
          </button>
          <div className="burst" ref={burst} aria-hidden="true" />
        </div>
      </div>
      <div className={`unlock ${unlocked ? 'show' : ''}`} role="status" aria-live="polite">
        <small>New SIUP unlocked</small>
        <strong>{unlocked || ' '}</strong>
      </div>
    </section>
  );
}
