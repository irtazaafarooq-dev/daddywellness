import type { Metadata } from 'next';
import Image from 'next/image';
import Counter from '@/components/Counter';
import CopyEmail from '@/components/CopyEmail';
import ConnectPill from '@/components/ConnectPill';
import ContactForm from '@/components/ContactForm';
import Marquee from '@/components/Marquee';
import Reveals from '@/components/Reveals';
import { PERSON, SOCIALS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Work with me: brand partnerships',
  description: 'Partner with Richie Lovelace (Daddy Wellness): 3.7M followers, 70.8M TikTok likes, two travel vlogs a week. Reels, TikToks, YouTube integrations and SIUP collabs.',
  alternates: { canonical: '/work-with-me' },
  openGraph: { url: '/work-with-me' },
};

const PLATFORMS = [
  { name: 'Instagram', value: 2, suffix: 'M', decimals: 0, note: 'followers', href: SOCIALS.instagram },
  { name: 'TikTok', value: 1.4, suffix: 'M', decimals: 1, note: '70.8M likes', href: SOCIALS.tiktok },
  { name: 'YouTube', value: 160, suffix: 'K', decimals: 0, note: '1.3K+ videos', href: SOCIALS.youtube },
  { name: 'Total reach', value: 3.7, suffix: 'M', decimals: 1, note: 'across platforms', href: SOCIALS.linkme },
];

const FORMATS = [
  { h: 'YouTube integration', p: 'A natural segment inside a long-form travel vlog. Two episodes go out every week.' },
  { h: 'Instagram Reels', p: 'Collab posts and Reels to 2M followers, written in Richie’s own voice.' },
  { h: 'TikTok', p: 'Short-form built for the For You page, on an account with 70.8M likes.' },
  { h: 'Snapchat stories', p: 'Day-in-the-life coverage that feels like a friend’s story, not an ad.' },
  { h: 'SIUP collabs', p: 'Co-branded drops and moments built around the catchphrase fans already shout.' },
  { h: 'Travel & events', p: 'On-location content and appearances: the show already travels the world.' },
];

export default function WorkWithMe() {
  return (
    <>
      <Reveals />
      <section className="wwm-hero">
        <div className="eyebrow label"><span>Work with Daddy Wellness</span><span>Media kit · {new Date().getFullYear()}</span></div>
        <h1 className="h-xl" data-reveal>3.7M people.<br /><span className="red">One very loud word.</span></h1>
        <p className="lead" style={{ marginTop: 30 }} data-reveal>
          Richie Lovelace makes comedy and travel content that people don’t skip. Here’s what partnering looks like.
        </p>
        <div style={{ marginTop: 34, maxWidth: 560 }} data-reveal>
          <ConnectPill source="work-with-me-hero" />
          <p className="label" style={{ marginTop: 12, color: 'var(--mute)' }}>Drop your email · or <a href="#contact" style={{ textDecoration: 'underline' }}>send a full brief</a></p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }} aria-labelledby="reach-title">
        <h2 id="reach-title" className="sr-only">Audience</h2>
        <div className="platforms">
          {PLATFORMS.map((p, i) => (
            <a className="pcard" key={p.name} href={p.href} target="_blank" rel="noopener" data-reveal data-delay={i * 0.08}>
              <span className="label"><span>{p.name}</span><span>↗</span></span>
              <div>
                <Counter value={p.value} decimals={p.decimals} suffix={p.suffix} />
                <div className="label" style={{ marginTop: 10, opacity: 0.7 }}>{p.note}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Marquee items={['Reels', 'TikToks', 'YouTube integrations', 'SIUP collabs', 'Travel', 'Events']} />

      <section aria-labelledby="formats-title">
        <div className="eyebrow label"><span>01 — Formats</span><span>Mix and match</span></div>
        <h2 id="formats-title" className="h-lg" style={{ marginBottom: 'clamp(40px,6vw,70px)' }} data-reveal>What we can<br /><span className="red">make together.</span></h2>
        <div className="formats">
          {FORMATS.map((f, i) => (
            <div className="format" key={f.h}>
              <span className="label">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark" aria-labelledby="why-title">
        <div className="eyebrow label"><span>02 — Why it works</span><span>The short version</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,auto)', gap: 40, alignItems: 'end', marginBottom: 'clamp(40px,6vw,80px)' }}>
          <h2 id="why-title" className="h-lg" data-reveal>A catchphrase<br /><span className="red">is a distribution channel.</span></h2>
        </div>
        <div className="why">
          <div data-reveal><span className="label red">01</span><h3>Fans remix it</h3><p className="lead">People make their own SIUP videos. Even a pro footballer celebrated a goal with one. Your brand rides that energy.</p></div>
          <div data-reveal data-delay="0.1"><span className="label red">02</span><h3>Travel = placement</h3><p className="lead">Hotels, flights, gear, drinks and apps show up naturally in a show that’s always on the move.</p></div>
          <div data-reveal data-delay="0.2"><span className="label red">03</span><h3>Consistency</h3><p className="lead">Two YouTube vlogs a week plus daily short-form, with 1.3K+ videos published so far.</p></div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title">
        <div className="contact-card" data-reveal>
          <div>
            <span className="label red">Management</span>
            <h2 id="contact-title" className="h-lg" style={{ margin: '14px 0 26px' }}>Let’s talk.</h2>
            <ContactForm />
          </div>
          <aside className="contact-side">
            <div className="polaroid" style={{ transform: 'rotate(4deg)' }}>
              <Image src="/img/golf-cart.jpg" alt="Richie Lovelace in a SIUUP cap doing his hand sign with a fan" width={480} height={640} sizes="320px" />
              <p>the hand sign</p>
            </div>
            <div>
              <span className="label" style={{ color: 'var(--mute)' }}>Prefer email?</span>
              <a className="mail" href={`mailto:${PERSON.email}?subject=Brand%20partnership%20with%20Daddy%20Wellness`}>{PERSON.email}</a>
              <div style={{ marginTop: 14 }}><CopyEmail /></div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
