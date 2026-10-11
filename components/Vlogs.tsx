'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOCIALS, VLOGS } from '@/lib/site';

export default function Vlogs() {
  // GSAP pins this inner box, never the <section> itself: the pin wrapper GSAP inserts then
  // lives inside React's own element, so React can unmount the page without a removeChild crash.
  const pinBox = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -dist(),
        ease: 'none',
        // pin only once the whole card row is on screen
        scrollTrigger: { trigger: pinBox.current, start: 'bottom bottom-=48', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="vlogs" id="vlogs" aria-labelledby="vlogs-title">
      <div ref={pinBox}>
      <div className="head">
        <div className="eyebrow label"><span>03 — The vlogs</span><a href={SOCIALS.youtube} target="_blank" rel="noopener">YouTube ↗</a></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(30px,4vw,56px)' }}>
          <h2 id="vlogs-title" className="h-lg">Passport<br /><span className="red">full of SIUPs.</span></h2>
          <p className="lead" style={{ maxWidth: 380 }}>Greek weddings, volcanic beaches, a day run by strangers in Spain. New episodes every <strong>Wednesday &amp; Sunday, 3pm EST.</strong></p>
        </div>
      </div>
      <div className="vtrack" ref={track}>
        {VLOGS.map((v) => (
          <a key={v.id} className="vcard" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener">
            <div className="thumb">
              <Image src={v.img} alt={`YouTube vlog: ${v.title}`} width={1280} height={720} sizes="(max-width: 900px) 82vw, 46vw" loading="eager" />
              <span className="tag">{v.tag}</span>
              <span className="play" aria-hidden="true">▶</span>
            </div>
            <h3>{v.title}</h3>
          </a>
        ))}
        <a className="vcard sub" href={`${SOCIALS.youtube}?sub_confirmation=1`} target="_blank" rel="noopener">
          <span>
            <b>Subscribe</b>
            <span className="label">1.3K+ videos · @daddywellness</span>
          </span>
        </a>
      </div>
      </div>
    </section>
  );
}
