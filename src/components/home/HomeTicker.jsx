import { useSite } from '../../context/SiteContext';

export default function HomeTicker() {
  const { site } = useSite();
  const serviceItems = site.home.services?.items?.map((s) => s.title) || [];
  const expertiseItems = site.home.expertise?.categories?.map((c) => c.name) || [];
  const items = [...serviceItems, ...expertiseItems].filter(Boolean);

  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="home-ticker-wrap" aria-hidden="true">
      <div className="home-ticker-track">
        {doubled.map((label, i) => (
          <span key={i} className="home-ticker-item">
            {label}
            <span className="home-ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
