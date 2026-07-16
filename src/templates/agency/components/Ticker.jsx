const ITEMS = [
  'Mobile-first design',
  'Instant share link',
  'Custom URL',
  'Professional templates',
  'Gen-Z ready',
  'Built with React',
  'WhatsApp sharing',
  'Multiple formats',
];

export default function Ticker() {
  return (
    <div className="agency-ticker" aria-hidden="true">
      <div className="agency-ticker__track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="agency-ticker__item">{item}</span>
        ))}
      </div>
    </div>
  );
}
