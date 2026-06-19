import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';

export default function WorkPreviewSection() {
  const { site } = useSite();
  const projects = site.work?.projects ?? [];
  const preview = projects.slice(0, 3);
  const count = preview.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || count < 2) return;

    function syncActiveIndex() {
      const scrollLeft = viewport.scrollLeft;
      let closest = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach(function (card, index) {
        if (!card) return;
        const distance = Math.abs(scrollLeft - card.offsetLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    }

    syncActiveIndex();
    viewport.addEventListener('scroll', syncActiveIndex, { passive: true });
    window.addEventListener('resize', syncActiveIndex);

    return function () {
      viewport.removeEventListener('scroll', syncActiveIndex);
      window.removeEventListener('resize', syncActiveIndex);
    };
  }, [count]);

  if (!count) return null;

  function goToSlide(index) {
    const viewport = viewportRef.current;
    const card = cardRefs.current[index];
    if (!viewport || !card) return;

    viewport.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  }

  return (
    <section data-nav="peach" className="section work-preview-section">
      <div className="work-preview-wrapper">
        <div className="work-preview-header">
          <span className="tag-text work-preview-tag">Selected Work</span>
          <h2 className="work-preview-headline">A few things I've built</h2>
        </div>

        <div className="work-preview-carousel">
          <div
            ref={viewportRef}
            className="work-preview-carousel__viewport"
          >
            <div className="work-preview-cards" aria-live="polite">
              {preview.map((project, index) => (
                <Link
                  key={project.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  to="/work"
                  className="work-preview-card"
                  aria-hidden={index !== activeIndex ? true : undefined}
                  tabIndex={index !== activeIndex ? -1 : undefined}
                >
                  <div className="work-preview-card__thumb">
                    <img
                      src={project.navThumb}
                      alt={project.titleLine1}
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {count > 1 && (
            <div className="work-preview-carousel__controls">
              <div className="work-preview-carousel__dots" role="tablist" aria-label="Work slides">
                {preview.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    className={`work-preview-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
                    aria-label={`Show project ${index + 1}`}
                    aria-selected={index === activeIndex}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="work-preview-cta">
          <Link to="/work" className="work-preview-cta__link">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
