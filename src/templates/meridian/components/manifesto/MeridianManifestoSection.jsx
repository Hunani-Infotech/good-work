import { useMeridianContent } from '../../../../hooks/meridian/useMeridianContent.js';

export default function MeridianManifestoSection() {
  const { manifesto } = useMeridianContent();

  return (
    <section id="manifesto" className="meridian-manifesto">
      <div className="meridian-manifesto__inner">
        <div className="meridian-manifesto__grid">
          <h2 className="meridian-manifesto__heading">{manifesto.heading}</h2>
          <p className="meridian-manifesto__body">{manifesto.body}</p>
        </div>
      </div>
    </section>
  );
}
