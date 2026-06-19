import { useSite } from '../../context/SiteContext';
import LottieEmbed from './LottieEmbed';

export default function SiteLoader() {
  const { site } = useSite();
  const { brand, assets } = site.site;
  const logo = assets.logoFullColour || assets.navLogo;
  const loaderLottie = assets.loaderLottie;

  return (
    <div className="container-loader">
      <div className="orange-intro">
        <div className="loader-intro">
          {loaderLottie ? (
            <LottieEmbed
              src={loaderLottie}
              className="brand-lottie loader-lottie"
              autoplay
              loop={false}
            />
          ) : logo ? (
            <img src={logo} alt={brand.firstName} className="loader-brand-logo" />
          ) : (
            <>
              <div className="nav-brand-name intro">{brand.firstName}</div>
              {brand.lastName ? (
                <>
                  <div className="dot-jm intro" />
                  <div className="nav-brand-name intro">{brand.lastName}</div>
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
