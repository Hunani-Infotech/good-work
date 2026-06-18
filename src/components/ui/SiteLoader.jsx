import { useSite } from '../../context/SiteContext';

export default function SiteLoader() {
  const { site } = useSite();
  const { brand, assets } = site.site;
  const logo = assets.logoFullColour || assets.navLogo;

  return (
    <div className="container-loader">
      <div className="orange-intro">
        <div className="cont-juan-intro">
          {logo ? (
            <img src={logo} alt={brand.firstName} className="loader-brand-logo" />
          ) : (
            <>
              <div className="nav-name-jm intro">{brand.firstName}</div>
              {brand.lastName ? (
                <>
                  <div className="dot-jm intro" />
                  <div className="nav-name-jm intro">{brand.lastName}</div>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className="grow-line" />
    </div>
  );
}
