import { useState } from 'react';
import IsakSectionHeading from '../IsakSectionHeading.jsx';
import { useCvCtaContent } from '../../../../hooks/useCvCtaContent.js';
import { buildIsakCircleLabel, splitIsakCircleChars } from '../../../../utils/isakCircleText.js';

function IsakCircleConnectButton({ href, label }) {
  const [isHovered, setIsHovered] = useState(false);
  const ringChars = splitIsakCircleChars(buildIsakCircleLabel(label));

  return (
    <a
      href={href}
      className={`isak-cta__circle${isHovered ? ' is-hovered' : ''}`}
      aria-label={label}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className="isak-cta__circle-decor" aria-hidden="true">
        <span className="isak-cta__circle-ring" />

        <span className="isak-cta__circle-rotate">
          <span className="isak-cta__circle-track">
            {ringChars.map(({ char, rotate }, index) => (
              <span
                key={`${char}-${index}`}
                className="isak-cta__circle-char"
                style={{ transform: `rotate(${rotate}deg)` }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      </span>

      <span className="isak-cta__circle-core" aria-hidden="true">
        <i className="icon icon-arrow-right-top" />
      </span>

      <span className="isak-cta__circle-hit" aria-hidden="true" />
    </a>
  );
}

export function IsakCtaSection() {
  const cta = useCvCtaContent();

  return (
    <section id="connect" className="isak-cta flat-spacing" aria-labelledby="isak-cta-heading">
      <IsakSectionHeading tag={cta.tag} sectionIndex="03" singleLine />

      <div className="isak-cta__layout">
        <div className="isak-cta__content">
          {cta.eyebrow ? (
            <p className="isak-cta__kicker">{cta.eyebrow}</p>
          ) : null}

          <h2 id="isak-cta-heading" className="isak-cta__title split-text effect-blur-fade">
            {cta.heading}
          </h2>

          {cta.statement ? (
            <p className="isak-cta__copy s-desc text-black-56">{cta.statement}</p>
          ) : null}
        </div>

        {cta.mailto ? (
          <div className="isak-cta__circle-shell">
            <IsakCircleConnectButton href={cta.mailto} label={cta.ctaLabel} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
