'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SPELLINGS } from '@/lib/site';

const CHAPTERS = [
  {
    n: '01 / The sound',
    h: 'It started as a shout.',
    p: 'SIUP is Richie’s celebration cry. Big win, good news, cold drink, beautiful view: you SIUP. If you know Ronaldo’s famous “Siuuu”, you’re halfway there. This one has a P on the end, and it lands like a mic drop.',
  },
  {
    n: '02 / The internet',
    h: 'Then fans took it.',
    p: 'Followers started SIUPing back in the comments, in their own videos, underwater, on nights out. Nobody agrees on the spelling, and that’s half the fun. “New SIUP unlocked” became a format of its own.',
    chips: true,
  },
  {
    n: '03 / The pitch',
    h: 'Then it hit the pitch.',
    p: 'Leeds United’s Dan James scored and celebrated with a SIUP. A catchphrase born on a phone camera ended up as a professional footballer’s goal celebration.',
  },
];

export default function Story() {
  const [active, setActive] = useState(0);
  const [spell, setSpell] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSpell((s) => (s + 1) % SPELLINGS.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="dark" id="siup" aria-labelledby="siup-title">
      <div className="eyebrow label"><span>01 — What is SIUP?</span><span>A short history of a very loud word</span></div>
      <div className="story">
        <div className="story-sticky">
          <div className="phone">
            <Image src="/img/siuup-selfie.jpg" alt="Richie Lovelace selfie captioned Siuup!" width={360} height={640} sizes="320px" />
            <div className="ig"><span>@daddywellness</span><span>{`0${active + 1} / 03`}</span></div>
          </div>
          <p className="spell" aria-live="off">{SPELLINGS[spell]}</p>
        </div>
        <div>
          <h2 id="siup-title" className="sr-only">What is SIUP?</h2>
          {CHAPTERS.map((c, i) => (
            <div className="chapter" key={c.n} data-i={i} ref={(n) => { refs.current[i] = n; }} style={{ opacity: active === i ? 1 : 0.35, transition: 'opacity .6s' }}>
              <span className="num">{c.n}</span>
              <h3>{c.h}</h3>
              <p className="lead">{c.p}</p>
              {c.chips && <div className="chips">{SPELLINGS.map((s) => <span key={s}>{s}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
