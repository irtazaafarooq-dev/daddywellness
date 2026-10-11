import Link from 'next/link';
import Counter from './Counter';

export default function BrandCta() {
  return (
    <section className="brand-cta" aria-labelledby="brands-title">
      <span className="label">For brands</span>
      <h2 id="brands-title" className="h-xl" style={{ marginTop: 18 }} data-reveal>Let’s make<br />some noise.</h2>
      <p className="lead" data-reveal>A built-in catchphrase, a travel show that ships twice a week and <strong>3.7M people</strong> who actually shout back.</p>
      <div className="row">
        <div className="stat"><Counter value={2} suffix="M" /><span>Instagram</span></div>
        <div className="stat"><Counter value={1.4} decimals={1} suffix="M" /><span>TikTok</span></div>
        <div className="stat"><Counter value={160} suffix="K" /><span>YouTube</span></div>
      </div>
      <Link href="/work-with-me" className="btn inv">See the media kit <span className="arr">→</span></Link>
    </section>
  );
}
