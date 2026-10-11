export default function Marquee({ items, variant = 'red', reverse = false }: { items: string[]; variant?: 'red' | 'ink'; reverse?: boolean }) {
  const row = items.map((t, i) => (
    <span key={i}>{t} <i>✦</i></span>
  ));
  return (
    <div className={`marquee ${variant === 'ink' ? 'ink' : ''} ${reverse ? 'rev' : ''}`} aria-hidden="true">
      <div className="track">{row}{row}</div>
    </div>
  );
}
