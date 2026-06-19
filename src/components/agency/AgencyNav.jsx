import BrandLogo from '../ui/BrandLogo';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function AgencyNav() {
  return (
    <nav className="agency-nav">
      <div className="agency-nav__inner">
        <a href="/" className="agency-nav__logo">
          <BrandLogo type="wordmark" className="agency-nav__logo-img" />
        </a>

        <ul className="agency-nav__links" role="list">
          <li>
            <button onClick={() => scrollTo('how-it-works')}>How it works</button>
          </li>
          <li>
            <button onClick={() => scrollTo('templates')}>Templates</button>
          </li>
          <li>
            <button onClick={() => scrollTo('features')}>Features</button>
          </li>
        </ul>

        <button
          className="agency-nav__cta"
          onClick={() => scrollTo('cta')}
        >
          Start Building
        </button>
      </div>
    </nav>
  );
}
