import { useEffect, useState } from 'react';
import { useContent } from '../../../../hooks/meridian/useContent.js';

function getCardPosition(index, activeIndex, total) {
  let position = index - activeIndex;
  const half = Math.floor(total / 2);

  if (position > half) {
    position -= total;
  } else if (position < -half) {
    position += total;
  }

  return position;
}

export default function CapabilitiesSection() {
  const { capabilities } = useContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardSize, setCardSize] = useState(368);

  const items = capabilities.items ?? [];

  useEffect(() => {
    const updateCardSize = () => {
      if (window.innerWidth < 640) {
        setCardSize(286);
        return;
      }

      if (window.innerWidth < 1024) {
        setCardSize(320);
        return;
      }

      setCardSize(368);
    };

    updateCardSize();
    window.addEventListener('resize', updateCardSize);

    return () => window.removeEventListener('resize', updateCardSize);
  }, []);

  if (!items.length) return null;

  const handleMove = (steps) => {
    setActiveIndex((current) => {
      const next = current + steps;
      const total = items.length;
      return ((next % total) + total) % total;
    });
  };

  return (
    <section id="capabilities" className="meridian-capabilities">
      <div className="meridian-capabilities__inner">
        <h2 className="meridian-capabilities__eyebrow">{capabilities.eyebrow}</h2>

        <div className="meridian-capabilities__stage-wrap">
          <ul
            className="meridian-capabilities__grid"
            style={{ '--meridian-cap-card-size': `${cardSize}px` }}
          >
            {items.map((item, index) => {
              const position = getCardPosition(index, activeIndex, items.length);
              const isCenter = position === 0;
              const isVisible = Math.abs(position) < 4;

              return (
                <li
                  key={item.id}
                  className={[
                    'meridian-capabilities__card',
                    isCenter ? 'is-active' : '',
                    isVisible ? 'is-visible' : 'is-hidden',
                  ].filter(Boolean).join(' ')}
                  style={{ zIndex: isCenter ? 20 : Math.max(1, 10 - Math.abs(position)) }}
                >
                  <article
                    className="meridian-capabilities__card-shell"
                    style={{
                      '--meridian-card-position': position,
                      '--meridian-card-rotate': isCenter ? '0deg' : `${position % 2 === 0 ? -2.6 : 2.6}deg`,
                      '--meridian-card-offset-y': isCenter ? '-62px' : position % 2 === 0 ? '-12px' : '18px',
                    }}
                  >
                    <button
                      type="button"
                      className="meridian-capabilities__card-button"
                      onClick={() => {
                        if (!isCenter) handleMove(position);
                      }}
                      aria-pressed={isCenter}
                      aria-label={isCenter ? `${item.text} selected` : `Focus skill ${item.number}`}
                    >
                      <div className="meridian-capabilities__card-frame">
                        <span className="meridian-capabilities__corner" aria-hidden="true" />
                        <span className="meridian-capabilities__watermark" aria-hidden="true">
                          {item.number}
                        </span>
                        <div className="meridian-capabilities__card-inner">
                          <div className="meridian-capabilities__meta">
                            <span className="meridian-capabilities__label">Capability</span>
                          </div>
                          <span className="meridian-capabilities__rule" aria-hidden="true" />
                          <p className="meridian-capabilities__text">{item.text}</p>
                          <div className="meridian-capabilities__footer">
                            <span className="meridian-capabilities__progress" aria-hidden="true" />
                            <span className="meridian-capabilities__count">
                              {item.number}
                              <span>/</span>
                              {String(items.length).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="meridian-capabilities__nav" aria-label="Skills navigation">
            <button
              type="button"
              className="meridian-capabilities__nav-btn"
              onClick={() => handleMove(-1)}
              aria-label="Previous skill"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="meridian-capabilities__nav-btn"
              onClick={() => handleMove(1)}
              aria-label="Next skill"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
