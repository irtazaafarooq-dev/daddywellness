import Image from 'next/image';
import { GALLERY, SOCIALS } from '@/lib/site';

export default function Gallery() {
  const cols = [0, 1, 2, 3].map((c) => GALLERY.filter((_, i) => i % 4 === c));
  return (
    <section aria-labelledby="gallery-title" style={{ paddingTop: 0 }}>
      <div className="eyebrow label"><span>05 — Around the world</span><a href={SOCIALS.instagram} target="_blank" rel="noopener">Instagram ↗</a></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(40px,6vw,80px)' }}>
        <h2 id="gallery-title" className="h-lg" data-reveal>Same hand sign.<br /><span className="red">Every country.</span></h2>
        <p className="lead" style={{ maxWidth: 360 }} data-reveal>2M people follow along on Instagram. Here’s the camera roll.</p>
      </div>
      <div className="gallery-grid">
        {cols.map((col, c) => (
          <div className="gcol" key={c} data-parallax={c % 2 ? '-8' : '6'}>
            {col.map((g) => (
              <a key={g.src} className="polaroid" href={SOCIALS.instagram} target="_blank" rel="noopener">
                <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(max-width: 900px) 46vw, 23vw" />
                <p>{g.label}</p>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
