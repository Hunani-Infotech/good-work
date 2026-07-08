import { useEffect, useState } from 'react';
import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import SocialLinks from '../../../components/shared/SocialLinks.jsx';
import GoodWorkFooterBrand from '../../../components/shared/GoodWorkFooterBrand.jsx';

function formatLocalTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MeridianContactSection() {
  const { contact, footer, social } = useMeridianContent();
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
            <div className="meridian-contact__heading-wrap">
            <span className="meridian-contact__heading-arrow" aria-hidden="true">↙</span>
            <h2 className="meridian-contact__heading">
              <span className="meridian-contact__heading-line">{headingLines[0]}</span>
              {headingLines[1] ? (
                <span className="meridian-contact__heading-line">{headingLines[1]}</span>
              ) : null}
            </h2>
          </div>

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
                <span className="meridian-contact__cta-ring">
                  <span className="meridian-magnetic__label" data-magnetic-text>
                    {contact.ctaLabel}
                  </span>
                </span>
              </span>
            </a>
          </div>

          <div className="meridian-contact__pills">
            {contact.email ? (
              <a
                href={contact.emailHref}
                className="meridian-contact__pill meridian-magnetic"
                data-magnetic-strength="0.36"
                data-magnetic-label-strength="0.1"
              >
                <span className="meridian-magnetic__inner" data-magnetic-inner>
                  <span className="meridian-magnetic__surface meridian-liquid-fill">
                    <span className="meridian-liquid-fill__wave" aria-hidden="true" />
                    <span className="meridian-magnetic__label" data-magnetic-text>
                      {contact.email}
                    </span>
                  </span>
                </span>
              </a>
            ) : null}
            {contact.phone ? (
              <a
                href={contact.phoneHref}
                className="meridian-contact__pill meridian-magnetic"
                data-magnetic-strength="0.36"
                data-magnetic-label-strength="0.1"
              >
                <span className="meridian-magnetic__inner" data-magnetic-inner>
                  <span className="meridian-magnetic__surface meridian-liquid-fill">
                    <span className="meridian-liquid-fill__wave" aria-hidden="true" />
                    <span className="meridian-magnetic__label" data-magnetic-text>
                      {contact.phone}
                    </span>
                  </span>
                </span>
              </a>
            ) : null}
          </div>
          </div>

          <footer className="meridian-footer">
            <GoodWorkFooterBrand
              surface="dark"
              copyrightName={footer.copyrightName}
              className="meridian-footer__brand"
              logoClassName="meridian-footer__logo"
            />

            <div className="meridian-footer__meta">
            <div>
              <p className="meridian-footer__label">Version</p>
              <p className="meridian-footer__value">{footer.version}</p>
            </div>
            <div>
              <p className="meridian-footer__label">Local time</p>
              <p className="meridian-footer__value">{localTime}</p>
            </div>
          </div>

          {social.length ? (
            <div className="meridian-footer__socials">
              <p className="meridian-footer__label">Social</p>
              <SocialLinks links={social} className="meridian-footer__social-list" iconSize={18} />
            </div>
          ) : null}
          </footer>
        </div>
      </div>
    </section>
  );
}
