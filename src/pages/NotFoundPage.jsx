import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCursor from '../components/ui/CustomCursor';

function WrongTurnAccent() {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <svg
        className="pointer-events-none absolute left-1/2 top-[54%] h-[2.4em] w-[108%] -translate-x-1/2 -translate-y-1/2 text-nf-orange"
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
      <span className="relative z-[1]">wrong turn</span>
    </span>
  );
}

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Page not found — Good Work CV';
    document.body.className = 'body not-found-page';

    return () => {
      document.body.className = 'body';
    };
  }, []);

  return (
    <>
      <CustomCursor variant="not-found" />
      <div className="not-found-shell flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-[clamp(1.5rem,4vw,3.5rem)] pb-[clamp(3rem,8vw,5rem)] pt-[clamp(2rem,6vw,4rem)]">
          <div className="relative w-full max-w-[52rem] text-center">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[54%] select-none font-goga text-[clamp(8rem,28vw,16rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(81,0,102,0.08)]"
              aria-hidden="true"
            >
              404
            </div>

            <div className="relative z-[1]">
              <p className="mb-5 inline-block font-plex text-[0.72rem] font-medium uppercase tracking-[0.22em] text-nf-ink/50">
                Error 404
              </p>
              <p
                className="m-0 font-goga text-[clamp(4.5rem,14vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-nf-purple"
                aria-hidden="true"
              >
                404
              </p>

              <h1 className="mx-auto mt-[clamp(1rem,2.5vw,1.5rem)] max-w-[18ch] font-goga text-[clamp(1.65rem,4.5vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] max-[720px]:max-w-none">
                This page took a <WrongTurnAccent />
              </h1>

              <p className="mx-auto mt-[clamp(1rem,2vw,1.35rem)] max-w-[36ch] font-goga text-[clamp(0.95rem,1.8vw,1.08rem)] leading-[1.65] text-nf-ink/60">
                The link may be broken, or the page may have moved. Go back to where
                you were.
              </p>

              <button
                type="button"
                className="mt-[clamp(1.75rem,4vw,2.5rem)] inline-flex min-h-[2.85rem] cursor-pointer items-center justify-center rounded-full border border-transparent bg-nf-orange px-6 py-[0.65rem] font-goga text-[0.9rem] font-semibold tracking-[0.02em] text-white transition-[transform,background] duration-[220ms] ease-out hover:scale-[1.03] hover:bg-[color-mix(in_srgb,var(--color-nf-orange)_85%,white)]"
                onClick={() => navigate(-1)}
              >
                Go back →
              </button>
            </div>
          </div>
        </main>

        <footer className="px-[clamp(1.5rem,4vw,3.5rem)] pb-7 pt-5 text-center font-goga text-[0.78rem] text-nf-ink/45">
          © {new Date().getFullYear()} Good Work. All rights reserved.
        </footer>
      </div>
    </>
  );
}
