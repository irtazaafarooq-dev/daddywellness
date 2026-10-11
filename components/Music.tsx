import Image from 'next/image';
import { SOCIALS } from '@/lib/site';

export default function Music() {
  return (
    <section id="music" aria-labelledby="music-title" style={{ paddingTop: 0 }}>
      <div className="eyebrow label"><span>04 — The music</span><span>Yes, there’s a track</span></div>
      <div className="music">
        <div className="record" data-reveal>
          <div className="sleeve" aria-hidden="true">Suggie<br />Boogie</div>
          <div className="vinyl">
            <div className="label-art">
              <Image src="/img/suggie-boogie.jpg" alt="Suggie Boogie cover art: a SIUP tin" width={1280} height={720} sizes="240px" />
            </div>
          </div>
        </div>
        <div>
          <span className="label red">Rossi feat. Daddy Wellness</span>
          <h2 id="music-title" className="h-lg" style={{ margin: '14px 0 22px' }} data-reveal>Suggie<br />Boogie.</h2>
          <p className="lead" data-reveal>Richie made a track with Rossi while Rossi was in Miami. The cover is a SIUP tin with a warning label, so you’ve been told.</p>
          <div className="ctas" style={{ marginTop: 34 }} data-reveal>
            <a className="btn red" href="https://www.youtube.com/watch?v=y16uEtcNj9c" target="_blank" rel="noopener">Play on YouTube <span className="arr">→</span></a>
            <a className="btn" href={SOCIALS.spotify} target="_blank" rel="noopener">Spotify</a>
          </div>
        </div>
      </div>
    </section>
  );
}
