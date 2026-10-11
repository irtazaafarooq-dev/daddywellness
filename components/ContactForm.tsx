'use client';

import { useState } from 'react';
import { sendContact } from '@/lib/contact';
import { useSound } from './SoundProvider';
import { engine } from '@/lib/siup-audio';
import { kick } from '@/lib/pulse';
import { PERSON } from '@/lib/site';

const BUDGETS = ['Under $2.5K', '$2.5K – $10K', '$10K – $25K', '$25K+', 'Not sure yet'];

/** Full brand enquiry form for the Work With Me page. */
export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', company: '', budget: '', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const { enabled } = useSound();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    const r = await sendContact({ ...f, source: 'work-with-me' });
    if (r.ok) {
      setState('sent');
      if (enabled) engine.play('classic');
      kick(1, 800);
      return;
    }
    setState('error');
    setMsg(r.reason === 'not-configured' ? `Online messages aren’t switched on yet. Email ${PERSON.email} directly.` : r.message);
  };

  if (state === 'sent') {
    return (
      <div className="form-sent" role="status">
        <b>SIUP! Message sent.</b>
        <p>Richie’s management will reply to <strong>{f.email}</strong>, usually within a few working days.</p>
      </div>
    );
  }

  return (
    <form className="brand-form" onSubmit={submit}>
      <div className="row2">
        <label>Your name<input required value={f.name} onChange={set('name')} autoComplete="name" maxLength={120} /></label>
        <label>Work email<input required type="email" value={f.email} onChange={set('email')} autoComplete="email" maxLength={254} /></label>
      </div>
      <div className="row2">
        <label>Brand / company<input required value={f.company} onChange={set('company')} autoComplete="organization" maxLength={160} /></label>
        <label>Budget
          <select value={f.budget} onChange={set('budget')}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
      </div>
      <label>What do you have in mind?<textarea required rows={5} value={f.message} onChange={set('message')} maxLength={4000} placeholder="Campaign, dates, platforms, anything useful…" /></label>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} name="website" />
      <div className="form-foot">
        <button className="btn red" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : <>Send to management <span className="arr">→</span></>}</button>
        {state === 'error' && <p className="connect-err" role="alert">{msg}</p>}
      </div>
    </form>
  );
}
