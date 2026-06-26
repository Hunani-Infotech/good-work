import { useEffect, useState } from 'react';
import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6" aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function GerozVideo({
  posterImage = GEROZ_TEMPLATE_IMAGES.video,
  title = 'Videography Production',
  titleAccent = 'Production',
  youtubeId = 'Cn4G2lZ_g2I',
  showHeader = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

  return (
    <section className="bg-stone-950 py-16 lg:py-24">
      {showHeader && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
          <h2 className="text-4xl font-semibold leading-tight text-stone-100 md:text-5xl">
            {title.replace(titleAccent, '').trim()}
            <br />
            <span className="text-amber-500">{titleAccent}</span>
          </h2>
        </div>
      )}

      <div className="relative w-full">
        <div
          className="relative min-h-[320px] bg-cover bg-center bg-no-repeat md:min-h-[480px] lg:min-h-[560px]"
          style={{ backgroundImage: `url(${posterImage})` }}
        >
          <div className="absolute inset-0 bg-stone-950/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-stone-950 shadow-lg transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
              aria-label="Play video"
            >
              <PlayIcon />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-stone-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-stone-950/80 text-stone-100 transition-colors hover:bg-amber-500 hover:text-stone-950"
              aria-label="Close video"
            >
              <CloseIcon />
            </button>
            <iframe
              src={videoSrc}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
