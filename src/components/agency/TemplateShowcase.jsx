import { Link } from 'react-router-dom';

const TEMPLATES = [
  {
    id: 'dark',
    variant: 'dark',
    name: 'The Developer',
    badge: 'Popular',
    href: '/cv/sanjay',
    cta: 'Preview Template',
  },
  {
    id: 'warm',
    variant: 'warm',
    name: 'The Classic',
    badge: 'Clean',
    href: '/cv/sanjay',
    cta: 'Preview Template',
  },
  {
    id: 'tech',
    variant: 'tech',
    name: 'The Tech Lead',
    badge: 'Coming soon',
    href: null,
    cta: 'Coming Soon',
  },
];

function TemplatePreview({ variant }) {
  return (
    <div className="template-card__preview">
      <div className="template-card__preview-nav">
        <div className="template-card__preview-logo" />
        <div className="template-card__preview-dots">
          <div className="template-card__preview-dot" />
          <div className="template-card__preview-dot" />
        </div>
      </div>
      <div className="template-card__preview-body">
        <div className="template-card__preview-avatar" />
        <div className="template-card__preview-line template-card__preview-line--lg" />
        <div className="template-card__preview-line template-card__preview-line--md" />
        <div className="template-card__preview-line template-card__preview-line--sm" />
        <div className="template-card__preview-line template-card__preview-line--md" />
        <div className="template-card__preview-pill" />
      </div>
    </div>
  );
}

export default function TemplateShowcase() {
  return (
    <section className="agency-templates" id="templates">
      <div className="agency-section__inner">
        <div className="agency-section__header">
          <span className="agency-tag">Templates</span>
          <h2 className="agency-section__headline">Your CV, your style</h2>
        </div>

        <div className="agency-templates__grid">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className={`template-card template-card--${tpl.variant}`}>
              <TemplatePreview variant={tpl.variant} />
              <div className="template-card__footer">
                <p className="template-card__name">{tpl.name}</p>
                <span className="template-card__badge">{tpl.badge}</span>
              </div>
              {tpl.href ? (
                <Link to={tpl.href} className="template-card__action">
                  {tpl.cta}
                </Link>
              ) : (
                <span className="template-card__action" style={{ opacity: 0.45, cursor: 'default' }}>
                  {tpl.cta}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
