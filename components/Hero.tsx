'use client';

import Image from 'next/image';
import Link from 'next/link';
import SiupWord from './SiupWord';
import Counter from './Counter';
import { useSound } from './SoundProvider';
import { kick } from '@/lib/pulse';
import { engine } from '@/lib/siup-audio';

export default function Hero() {
  const { enabled, enable } = useSound();

  const siup = async () => {
    if (!enabled) await enable();
    engine.play('classic');
    kick(1, 800);
  };

  return (
    <section className="hero" id="top">
      <div className="hero-meta label">
        <span><span className="dot" />New vlogs every Wed &amp; Sun · 3pm EST</span>
        <span>Comedy · Travel · The SIUP</span>
      </div>

      <div className="hero-word">
        <span className="hint" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 8c10 2 20 10 24 24" /><path d="M24 30l6 2 1-7" /></svg>
          Click the letters
        </span>
        <SiupWord onClick={siup} ariaLabel="SIUP: click to hear it" intensity={1.1} />
        <figure className="hero-photo" data-parallax="-18">
          <div className="frame">
            <Image src="/img/yacht-sunset.jpg" alt="Richie Lovelace in a SIUUP t-shirt on a boat at sunset" width={487} height={640} priority sizes="(max-width: 600px) 38vw, 270px" />
            <p>golden hour siup</p>
          </div>
          <span className="sticker">Daddy<br />Well<br />ness</span>
        </figure>
      </div>

      <div className="hero-foot">
        <h1>
          <span className="red">Richie Lovelace</span> is Daddy Wellness: comedy, travel vlogs and the loudest catchphrase on the internet.
        </h1>
        <div className="hero-stats">
          <div className="stat"><Counter value={3.7} decimals={1} suffix="M" /><span>Followers</span></div>
          <div className="stat"><Counter value={70.8} decimals={1} suffix="M" /><span>TikTok likes</span></div>
        </div>
        <div className="ctas">
          <Link href="#soundboard" className="btn red">Hit the SIUP <span className="arr">→</span></Link>
          <Link href="/work-with-me" className="btn">Work with me</Link>
        </div>
      </div>
    </section>
  );
}
