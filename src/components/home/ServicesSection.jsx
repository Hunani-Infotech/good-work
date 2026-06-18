import VideoEmbed from '../ui/VideoEmbed';
import { useSite } from '../../context/SiteContext';

function ServiceMedia({ item }) {
  if (!item.src) return null;

  const hiddenClass = item.hidden ? ' hide' : '';
  const inner = item.type === 'video'
    ? <VideoEmbed src={item.src} className="video-cont-p2" />
    : <img src={item.src} loading="lazy" sizes="100vw" alt="" className="img-service" />;

  return (
    <div className={`mask-img-service${hiddenClass}`}>
      <div className="mask-img-service-tilt">{inner}</div>
    </div>
  );
}

export default function ServicesSection() {
  const { site } = useSite();
  const { services } = site.home;

  return (
    <section className="section">
      <div className="service-headline-wrapper">
        <div className="tag-text">{services.tag}</div>
        <h1 className="service-headline" aria-label={services.headline}>{services.headline}</h1>
      </div>
      <ul role="list" className="main-wrapper-services w-list-unstyled">
        {services.items.map((service) => (
          <li key={service.id} className="service-wrapper">
            <div className="cont-text-service">
              <div className="cont-title-service">
                <div className="dot-project test" />
                <h2 className="service-h2">{service.title}</h2>
              </div>
              <p className="body-copy home-work">{service.description}</p>
            </div>
            {service.media?.length ? (
            <div className="cont-imgs-service">
              <div className="cont-imgs-service-track">
                {service.media.map((item, idx) => (
                  <ServiceMedia key={`${service.id}-${idx}`} item={item} />
                ))}
              </div>
            </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
