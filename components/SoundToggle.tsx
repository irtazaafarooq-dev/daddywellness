'use client';

import { useRef } from 'react';
import { useAudioFrame, useSound } from './SoundProvider';

export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  const bars = useRef<HTMLSpanElement>(null);
  const on = useRef(enabled);
  on.current = enabled;

  useAudioFrame((level, t) => {
    const el = bars.current;
    if (!el) return;
    el.querySelectorAll('i').forEach((b, i) => {
      const idle = on.current ? 0.25 + 0.2 * Math.abs(Math.sin(t / (220 + i * 70) + i)) : 0.15;
      (b as HTMLElement).style.transform = `scaleY(${Math.min(1, idle + level * (0.7 + i * 0.12))})`;
    });
  });

  return (
    <button className={`sound-toggle ${enabled ? 'on' : ''}`} onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}>
      <span className="eq" ref={bars} aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="st-label">{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
