import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import ShareButton from '../ui/ShareButton';
import LottieEmbed from '../ui/LottieEmbed';
import BrandLogo from '../ui/BrandLogo';

export default function Nav() {
  const { site } = useSite();
  const { brand, assets, social } = site.site;
  const useLogo = brand.navDisplay === 'logo' && assets.navLogo;

  return (
    <>
      <ul role="list" className="nav-menu-mobile w-list-unstyled">
        <li>
          <Link to="/" className="w-inline-block">
            {useLogo ? (
              <BrandLogo type="symbol" className="nav-logo-mobile" alt="" />
            ) : (
              <LottieEmbed src={assets.navLottie} />
            )}
          </Link>
        </li>
        <li>
          <Link to="/work" className="nav-link-mobile">
            Work
          </Link>
        </li>
      </ul>

      <div className="container-2">
        <div className="cont-name-logo">
          <Link to="/" className="nav-name w-inline-block">
            {useLogo ? (
              <BrandLogo type="wordmark" className="nav-logo" alt={brand.firstName} />
            ) : (
              <>
                <div className="nav-brand-name">{brand.firstName}</div>
                {brand.lastName ? (
                  <>
                    <div className="dot-jm" />
                    <div className="nav-brand-name">{brand.lastName}</div>
                  </>
                ) : null}
              </>
            )}
          </Link>
        </div>

        <ul role="list" className="nav-menu w-list-unstyled">
          <li>
            <Link to="/" className="w-inline-block">
              {useLogo ? (
                <BrandLogo type="symbol" className="nav-logo-icon" alt="" />
              ) : (
                <LottieEmbed src={assets.navLottie} />
              )}
            </Link>
          </li>
          <li className="cont-social-link">
            <Link to="/work" className="nav-link">
              Work
            </Link>
          </li>
        </ul>

        <ol role="list" className="nav-social-wrapper w-list-unstyled">
          <li className="cont-social-link">
            <ShareButton />
          </li>
          {social.nav.map((link) => (
            <li key={link.label} className="cont-social-link">
              {link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer" className="nav-social-link">
                  {link.label}
                </a>
              ) : (
                <a href={link.href} className="nav-social-link">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
