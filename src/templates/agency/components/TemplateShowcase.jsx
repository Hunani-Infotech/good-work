import { useCallback } from 'react';
import PortfolioTemplatePicker from './PortfolioTemplatePicker';

export default function TemplateShowcase() {
  const handleSelect = useCallback(({ template }) => {
    if (template.href) {
      window.open(template.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <section className="agency-templates" id="templates" data-nav-logo="dark">
      <PortfolioTemplatePicker onSelect={handleSelect} />
    </section>
  );
}
