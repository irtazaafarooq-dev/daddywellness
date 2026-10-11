'use client';

import Link from 'next/link';
import SiupWord from './SiupWord';
import ConnectPill from './ConnectPill';
import { useSound } from './SoundProvider';
import { engine } from '@/lib/siup-audio';
import { kick } from '@/lib/pulse';
import { PERSON, SOCIALS } from '@/lib/site';

export default function Footer() {
  const { enabled, enable } = useSound();
  const siup = async () => {
    if (!enabled) await enable();
    engine.play('classic');
    kick(1, 800);
  };
  return (
    <footer className="footer">
      <span className="label">Say it with me</span>
      <SiupWord onClick={siup} ariaLabel="SIUP: click to hear it" />
      <div className="footer-grid">
        <div>
          <h4>Connect with Richie</h4>
          <ConnectPill source="footer" tone="dark" />
          <a className="mail-line" href={`mailto:${PERSON.email}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
            {PERSON.email}
          </a>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li><a href={SOCIALS.instagram} target="_blank" rel="noopener">Instagram</a></li>
            <li><a href={SOCIALS.tiktok} target="_blank" rel="noopener">TikTok</a></li>
            <li><a href={SOCIALS.youtube} target="_blank" rel="noopener">YouTube</a></li>
            <li><a href={SOCIALS.snapchat} target="_blank" rel="noopener">Snapchat</a></li>
            <li><a href={SOCIALS.spotify} target="_blank" rel="noopener">Spotify</a></li>
          </ul>
        </div>
        <div>
          <h4>Site</h4>
          <ul>
            <li><Link href="/#siup">The SIUP</Link></li>
            <li><Link href="/#soundboard">Soundboard</Link></li>
            <li><Link href="/#vlogs">Vlogs</Link></li>
            <li><Link href="/work-with-me">Work with me</Link></li>
          </ul>
        </div>
      </div>
      <div className="small">
        <span>© {new Date().getFullYear()} Daddy Wellness</span>
        <span>Richie Lovelace · @daddywellness</span>
      </div>
    </footer>
  );
}
