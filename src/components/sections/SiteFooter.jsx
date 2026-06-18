import { useSite } from '../../context/SiteContext';

export default function SiteFooter({ logoSrc }) {
  const { site } = useSite();
  const { brand, footer, social } = site.site;
  const imageSrc = logoSrc || footer.logoSrc;
  const hasVideo = Boolean(footer.video?.src);
  const bgImage = footer.backgroundImage;

  return (
    <section
      data-nav="peach"
      className={`section footer${bgImage || hasVideo ? ' has-footer-bg' : ''}`}
    >
      {bgImage && !hasVideo ? (
        <img src={bgImage} alt="" className="footer-bg-image" aria-hidden="true" />
      ) : null}
      <div className="main-wrapper-footer">
        <div className="wrapper-content-footer _1">
          <div className="wrapper-column">
            <h3 className="body-footer fade">Website made using:</h3>
            <ul role="list" className="list-footer w-list-unstyled">
              {footer.builtWith.map((item) => (
                <li key={item} className="wrapper-item-column">
                  <h4 className="body-footer right">{item}</h4>
                </li>
              ))}
            </ul>
          </div>
          <div className="wrapper-column right">
            <h3 className="body-footer fade">Contact:</h3>
            <ul role="list" className="list-footer w-list-unstyled">
              {social.footer.map((link) => (
                <li key={link.label} className="wrapper-item-column">
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className="footer-social-link">
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className="footer-social-link">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="wrapper-content-footer _2">
          <h2 className="name-footer">{brand.firstName}</h2>
          {imageSrc ? (
            <img src={imageSrc} loading="lazy" alt="" className="image-4" />
          ) : null}
          {brand.lastName ? (
            <h2 className="name-footer right">{brand.lastName}</h2>
          ) : null}
        </div>
        <div className="wrapper-content-footer">
          <h3 className="body-footer big">
            {footer.tagline} <span className="text-span-4">{footer.year}</span>
          </h3>
          {footer.studio ? (
            <h3 className="body-footer big">
              {footer.studio}{' '}
              {footer.studioNote ? <span className="text-span-3">{footer.studioNote}</span> : null}
            </h3>
          ) : null}
        </div>
      </div>
      {hasVideo ? (
        <div className="video-cont-footer footer">
          <div className="video-embed w-embed">
            <video className="video-embed" muted autoPlay loop playsInline poster={footer.video.poster || undefined}>
              <source src={footer.video.src} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : null}
    </section>
  );
}
