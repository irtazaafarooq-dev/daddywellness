'use client';

import Image from 'next/image';
import { useState } from 'react';
import { sendContact } from '@/lib/contact';
import { useSound } from './SoundProvider';
import { PERSON } from '@/lib/site';

/** One-field "Connect with Richie" box, like the link.me one, but it lands in the management inbox. */
export default function ConnectPill({ source, tone = 'light' }: { source: string; tone?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const { blip } = useSound();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    const r = await sendContact({ email, website: hp, source });
    if (r.ok) { setState('sent'); blip(1320); return; }
    setState('error');
    setMsg(r.reason === 'not-configured' ? `Email ${PERSON.email} for now.` : r.message);
  };

  if (state === 'sent') {
    return (
      <div className={`connect connect-${tone} is-sent`} role="status">
        <span className="connect-done">✓ Got it. Richie’s team will be in touch at <b>{email}</b>.</span>
      </div>
    );
  }

  return (
    <form className={`connect connect-${tone}`} onSubmit={submit} noValidate={false}>
      <label className="sr-only" htmlFor={`connect-${source}`}>Your email</label>
      <input
        id={`connect-${source}`}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
      />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
      <button type="submit" disabled={state === 'sending'}>
        <span>{state === 'sending' ? 'Sending…' : 'Connect with'}</span>
        <Image src="/img/avatar.jpg" alt="" width={40} height={40} />
      </button>
      {state === 'error' && <p className="connect-err" role="alert">{msg}</p>}
    </form>
  );
}
