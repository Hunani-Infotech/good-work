import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCursor from '../components/ui/CustomCursor';
import { usePageReveal } from '../hooks/usePageReveal';
import '../styles/not-found.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
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
                The link may be broken, or the page may have moved. Go back to where
                you were.
              </p>

              <div className="not-found-page__actions">
                <button
                  type="button"
                  className="not-found-page__btn-primary"
                  onClick={() => navigate(-1)}
                >
                  Go back →
                </button>
              </div>
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
