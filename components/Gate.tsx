'use client';

import { useState } from 'react';
import SiupWord from './SiupWord';
import { useSound } from './SoundProvider';
import { engine } from '@/lib/siup-audio';
import { kick } from '@/lib/pulse';

/** "Tap to SIUP": turns the browser's audio-needs-a-click rule into the site's entrance. */
export default function Gate() {
  const { enable } = useSound();
  const [state, setState] = useState<'idle' | 'filled' | 'leaving'>('idle');

  const leave = (delay: number) => {
    try { sessionStorage.setItem('dw-gate', '1'); } catch {}
    setTimeout(() => setState('leaving'), delay);
    setTimeout(() => {
      document.documentElement.dataset.gate = 'done';
      window.__lenis?.start();
      window.dispatchEvent(new Event('dw:entered'));
    }, delay + 1100);
  };

  const enter = async () => {
    if (state !== 'idle') return;
    await enable();
    // same SIUP as the hero letters
    const len = engine.play('classic');
    kick(1, 800);
    setState('filled');
    leave(Math.max(900, Math.min(1400, len * 900)));
  };

  const quiet = () => {
    if (state !== 'idle') return;
    kick(0.8, 700);
    setState('filled');
    leave(500);
  };

  return (
    <div className={`gate ${state === 'filled' || state === 'leaving' ? 'filled' : ''} ${state === 'leaving' ? 'leaving' : ''}`} role="dialog" aria-label="Enter the site">
      <div className="gate-top">
        <span className="label">Daddy Wellness</span>
        <span className="label">Richie Lovelace · 3.7M followers</span>
      </div>
      <SiupWord intensity={1.3} />
      <div className="gate-bottom">
        <span className="label" style={{ maxWidth: 220 }}>Best with sound. Volume up.</span>
        <div className="gate-cta">
          <button className="tap" onClick={enter} autoFocus>Tap to<br />SIUP</button>
          <button className="quiet" onClick={quiet}>Enter without sound</button>
        </div>
        <span className="label" style={{ maxWidth: 220, textAlign: 'right' }}>Est. on the internet</span>
      </div>
    </div>
  );
}
