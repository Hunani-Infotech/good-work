import { useSite } from '../../context/SiteContext';

export default function ExpertiseSection() {
  const { site } = useSite();
  const expertise = site.home.expertise;

  if (!expertise?.categories?.length) return null;

  return (
    <section data-nav="peach" className="section expertise-section">
      <div className="expertise-wrapper">
        <div className="expertise-header">
          <span className="tag-text expertise-tag">{expertise.tag}</span>
          <h2 className="expertise-headline">{expertise.headline}</h2>
        </div>
        <div className="expertise-categories">
          {expertise.categories.map((cat) => (
            <div key={cat.name} className="expertise-category">
              <h3 className="expertise-category__name">{cat.name}</h3>
              <div className="expertise-pills">
                {cat.skills.map((skill) => (
                  <span key={skill} className="expertise-pill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
