import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomCursor from '../components/ui/CustomCursor';
import { usePageReveal } from '../hooks/usePageReveal';
import { PORTFOLIO_TEMPLATES } from '../data/portfolioTemplates';
import GoodWorkWordmark from '../components/ui/GoodWorkWordmark.jsx';
import '../styles/not-found.css';

const LIVE_TEMPLATES = PORTFOLIO_TEMPLATES.filter((t) => t.href);

export default function NotFoundPage() {
  usePageReveal();

  useEffect(() => {
    document.title = 'Page not found — Good Work CV';
    document.body.className = 'body not-found-page agency-page';

    return () => {
      document.body.className = 'body';
    };
  }, []);

  return (
    <>
      <CustomCursor variant="not-found" />
      <div className="not-found-page__shell">
        <header className="not-found-page__header">
          <Link to="/" className="not-found-page__logo" aria-label="Good Work home">
            <GoodWorkWordmark surface="light" className="not-found-page__logo-img" />
          </Link>
        </header>

        <main className="not-found-page__main">
          <div className="not-found-page__frame">
            <div className="not-found-page__watermark" aria-hidden="true">
              404
            </div>

            <div className="not-found-page__content">
              <p className="not-found-page__eyebrow">Error 404</p>
              <p className="not-found-page__code" aria-hidden="true">
                404
              </p>

              <h1 className="not-found-page__headline">
                This page took a{' '}
                <span className="not-found-page__accent-wrap">
                  <svg
                    className="not-found-page__oval"
                    viewBox="0 0 300 72"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="150"
                      cy="36"
                      rx="142"
                      ry="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="not-found-page__accent">wrong turn</span>
                </span>
              </h1>

              <p className="not-found-page__desc">
                The link may be broken, or the page may have moved. Head back home
                or jump straight into one of our live CV templates.
              </p>

              <div className="not-found-page__actions">
                <Link to="/" className="not-found-page__btn-primary">
                  Back to home →
                </Link>
                <Link to="/#templates" className="not-found-page__btn-ghost">
                  Browse templates
                </Link>
              </div>

              <section className="not-found-page__templates" aria-label="Live templates">
                <p className="not-found-page__templates-label">Or preview a template</p>
                <ul className="not-found-page__template-grid">
                  {LIVE_TEMPLATES.map((template) => (
                    <li key={template.id}>
                      <Link to={template.href} className="not-found-page__template-card">
                        <span className="not-found-page__template-name">{template.title}</span>
                        <span className="not-found-page__template-meta">{template.eyebrow}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </main>

        <footer className="not-found-page__footer">
          © {new Date().getFullYear()} Good Work. All rights reserved.
        </footer>
      </div>
    </>
  );
}
