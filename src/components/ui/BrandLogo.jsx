import { useSite } from '../../context/SiteContext';
import { resolveBrandLogoSrc } from '../../utils/brandLogos';

export default function BrandLogo({
  type = 'wordmark',
  className = '',
  alt = 'Good Work',
  assets: assetsProp,
}) {
  const { site } = useSite();
  const assets = assetsProp || site.site.assets;

  return (
    <img
      src={resolveBrandLogoSrc(type, assets)}
      alt={alt}
      className={className}
      decoding="async"
    />
  );
}
