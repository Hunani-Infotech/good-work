import { useEffect, useState } from 'react';
import { useContent } from '../../../../hooks/meridian/useContent.js';
import SocialLinks from '../../../../components/shared/SocialLinks.jsx';
import GoodWorkFooterBrand from '../../../../components/shared/GoodWorkFooterBrand.jsx';
import FooterWalkerLottie from './FooterWalkerLottie.jsx';

function formatLocalTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ContactSection() {
  const { contact, social } = useContent();
  const [localTime, setLocalTime] = useState(formatLocalTime);
  const headingLines = contact.headingLines ?? [contact.heading];

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(formatLocalTime()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="contact" className="meridian-contact">
      <div className="meridian-contact__curve-overlay" aria-hidden="true">
        <div className="meridian-contact__curve-wrap">
          <div className="meridian-contact__curve-ellipse" />
        </div>
      </div>

      <div className="meridian-contact__panel">
        <div className="meridian-contact__content">
          <div className="meridian-contact__inner">
            <div className="meridian-contact__copy">
              <div className="meridian-contact__heading-wrap">
                <h2 className="meridian-contact__heading">
                  {headingLines.map((line) => (
                    <span key={line} className="meridian-contact__heading-line">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>

              {contact.email ? (
                <a
                  href={contact.emailHref}
                  className="meridian-contact__email meridian-magnetic"
                  data-magnetic-strength="0.35"
                  data-magnetic-label-strength="0.11"
                  data-magnetic-wobble
                >
                  <span className="meridian-magnetic__inner" data-magnetic-inner>
                    <span className="meridian-contact__email-surface meridian-liquid-fill">
                      <span className="meridian-liquid-fill__wave" aria-hidden="true" />
                      <span className="meridian-magnetic__label" data-magnetic-text>
                        {contact.email}
                      </span>
                    </span>
                  </span>
                </a>
              ) : null}

              {contact.email ? (
                <p className="meridian-contact__or" aria-hidden="true">
                  or
                </p>
              ) : null}

              <div className="meridian-contact__divider-row">
                <div className="meridian-contact__line" aria-hidden="true" />

                <a
                  href={contact.emailHref}
                  className="meridian-contact__cta meridian-magnetic"
                  data-magnetic-strength="0.35"
                  data-magnetic-label-strength="0.11"
                  data-magnetic-wobble
                >
                  <span className="meridian-magnetic__inner" data-magnetic-inner>
                    <span className="meridian-contact__cta-ring meridian-liquid-fill">
                      <span className="meridian-liquid-fill__wave" aria-hidden="true" />
                      <span className="meridian-magnetic__label" data-magnetic-text>
                        {contact.ctaLabel}
                      </span>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <footer className="meridian-footer">
            <div className="meridian-footer__grid">
              <div className="meridian-footer__brand gw-footer-brand">
                <div className="gw-footer-walker-stack meridian-footer__walker-stack">
                  <FooterWalkerLottie className="meridian-footer__walker" />
                  <GoodWorkFooterBrand
                    surface="dark"
                    part="logo"
                    logoClassName="meridian-footer__logo"
                  />
                </div>
              </div>

              <div className="meridian-footer__aside">
                <p className="meridian-footer__value">{localTime}</p>
                {social.length ? (
                  <>
                    <span className="meridian-footer__sep" aria-hidden="true" />
                    <SocialLinks
                      links={social}
                      className="meridian-footer__social-list"
                      iconSize={16}
                    />
                  </>
                ) : null}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
