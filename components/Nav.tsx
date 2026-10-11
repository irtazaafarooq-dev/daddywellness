'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SoundToggle from './SoundToggle';
import { useSound } from './SoundProvider';

const LINKS = [
  { href: '/#siup', label: 'The SIUP' },
  { href: '/#soundboard', label: 'Soundboard' },
  { href: '/#vlogs', label: 'Vlogs' },
  { href: '/#music', label: 'Music' },
];

export default function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { blip } = useSound();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
  }, [open]);

  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="brand" aria-label="Daddy Wellness home" onMouseEnter={() => blip(990)}>
          <Image src="/img/avatar.jpg" alt="Richie Lovelace" width={42} height={42} priority />
          Daddy Wellness
        </Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onMouseEnter={() => blip(780)}>{l.label}</Link>
          ))}
          <Link href="/work-with-me" aria-current={path === '/work-with-me' ? 'page' : undefined} onMouseEnter={() => blip(780)}>Work with me</Link>
        </nav>
        <div className="nav-right">
          <SoundToggle />
          <Link href="/work-with-me" className="btn red" style={{ height: 42, padding: '0 20px', fontSize: 14 }}>Brands <span className="arr">→</span></Link>
          <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden={!open}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{l.label}</Link>
        ))}
        <Link href="/work-with-me" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>Work with me →</Link>
      </div>
    </>
  );
}
