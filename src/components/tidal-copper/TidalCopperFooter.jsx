import { useSite } from '../../context/SiteContext.jsx';
import GoodWorkFooterBrand from '../shared/GoodWorkFooterBrand.jsx';

export default function TidalCopperFooter() {
  const { site } = useSite();
  const copyrightName = site.site.brand?.firstName ?? '';

  return (
    <footer className="tc-site-footer">
      <GoodWorkFooterBrand surface="dark" copyrightName={copyrightName} />
    </footer>
  );
}
