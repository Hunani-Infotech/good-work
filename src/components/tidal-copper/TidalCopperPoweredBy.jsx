import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import { GOODWORK_APP_URL } from '../../utils/brandLogos.js';

export default function TidalCopperPoweredBy({ dark = false }) {
  const surface = dark ? 'light' : 'dark';

  return (
    <a
      href={GOODWORK_APP_URL}
      className={`cv-powered-by${dark ? ' cv-powered-by--dark' : ''}`}
      aria-label="Powered by GoodWork — visit GoodWork"
    >
      <GoodWorkWordmark surface={surface} className="cv-powered-by__logo" />
      <span className="cv-powered-by__text">Powered by GoodWork</span>
    </a>
  );
}
