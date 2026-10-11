'use client';

import { useState } from 'react';
import { CODES } from '@/lib/site';
import { useSound } from './SoundProvider';

export default function Codes() {
  const [toast, setToast] = useState('');
  const { blip } = useSound();

  const copy = async (code: string, brand: string) => {
    try { await navigator.clipboard.writeText(code); } catch {}
    blip(1200);
    setToast(`${code} copied for ${brand}`);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <section aria-labelledby="codes-title" style={{ paddingTop: 0 }}>
      <div className="eyebrow label"><span>06 — Codes</span><span>Use code DADDY</span></div>
      <h2 id="codes-title" className="h-lg" style={{ marginBottom: 'clamp(30px,5vw,60px)' }} data-reveal>Use code <span className="red">DADDY.</span></h2>
      <div className="codes">
        {CODES.map((c, i) => (
          <div className="ticket" key={c.brand} data-reveal data-delay={i * 0.1}>
            <div className="info">
              <span className="label" style={{ color: 'var(--mute)' }}>{c.note}</span>
              <h3>{c.brand}</h3>
              <a className="btn" href={c.href} target="_blank" rel="noopener sponsored" style={{ height: 46, fontSize: 14 }}>Open <span className="arr">→</span></a>
            </div>
            <div className="stub">
              <b>{c.code}</b>
              <button onClick={() => copy(c.code, c.brand)}>Copy code</button>
            </div>
          </div>
        ))}
      </div>
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast || ' '}</div>
    </section>
  );
}
