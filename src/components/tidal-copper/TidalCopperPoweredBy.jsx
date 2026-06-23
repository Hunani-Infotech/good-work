import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';

export default function TidalCopperPoweredBy({ dark = false }) {
  const surface = dark ? 'light' : 'dark';

  return (
    <div
      className={`cv-powered-by${dark ? ' cv-powered-by--dark' : ''}`}
      aria-label="Powered by GoodWork"
    >
      <GoodWorkWordmark surface={surface} className="cv-powered-by__logo" />
      <span className="cv-powered-by__text">Powered by GoodWork</span>
    </div>
  );
}
