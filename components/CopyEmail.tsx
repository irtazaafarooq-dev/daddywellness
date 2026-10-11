'use client';

import { useState } from 'react';
import { PERSON } from '@/lib/site';
import { useSound } from './SoundProvider';

export default function CopyEmail() {
  const [shown, setShown] = useState(false);
  const { blip } = useSound();
  const copy = async () => {
    try { await navigator.clipboard.writeText(PERSON.email); } catch {}
    blip(1200);
    setShown(true);
    setTimeout(() => setShown(false), 2000);
  };
  return (
    <>
      <button className="btn" onClick={copy}>Copy email</button>
      <div className={`toast ${shown ? 'show' : ''}`} role="status">{shown ? 'Email copied' : ' '}</div>
    </>
  );
}
