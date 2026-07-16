import { useSite } from '../../../context/SiteContext';
import Section from './Section.jsx';

export default function CapabilitiesSection() {
  const { site } = useSite();
  const capabilities = site.home.capabilities;

  if (!capabilities?.bullets?.length) return null;

  return (
    <Section
      screenClass="cv-capabilities-screen"
      label="04 — Skills"
      eyebrowId="capEyebrow"
      eyebrow={capabilities.tag}
      backgroundImage={capabilities.backgroundImage}
      poweredByDark
    >
      <ul role="list">
        {capabilities.bullets.map((text, index) => (
          <li key={text} className="cap-item">
            <div className="cap-item__num" aria-hidden="true">
              <span className="cap-item__num-inner">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="cap-item__text">
              <span className="cap-item__text-inner">{text}</span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
