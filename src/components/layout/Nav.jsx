import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import ShareButton from '../ui/ShareButton';
import LottieEmbed from '../ui/LottieEmbed';

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
              <img src={assets.navLogo} alt="" className="nav-logo-mobile" />
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
              <img src={assets.logoFullColour || assets.navLogo} alt={brand.firstName} className="nav-logo" />
            ) : (
              <>
                <div className="nav-name-jm">{brand.firstName}</div>
                {brand.lastName ? (
                  <>
                    <div className="dot-jm" />
                    <div className="nav-name-jm">{brand.lastName}</div>
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
                <img src={assets.navLogo} alt="" className="nav-logo-icon" />
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
