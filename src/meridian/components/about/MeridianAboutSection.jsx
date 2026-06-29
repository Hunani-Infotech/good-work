import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';

export default function MeridianAboutSection() {
  const { about } = useMeridianContent();

  if (!about.paragraphs.length) return null;

  return (
    <section id="about" className="meridian-about">
      <div className="meridian-about__inner">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="meridian-about__paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
