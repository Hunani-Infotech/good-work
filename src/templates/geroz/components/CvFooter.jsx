import LuxuryBackdrop from './LuxuryBackdrop.jsx';
import GoodWorkFooterBrand from '../../../components/shared/GoodWorkFooterBrand.jsx';
import FooterWalkerLottie from './FooterWalkerLottie.jsx';

export default function CvFooter() {
  return (
    <footer className="gz-footer relative overflow-hidden bg-black text-stone-300">
      <div
        className="gz-footer__bg pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.14]"
        style={{ backgroundImage: 'var(--geroz-img-footer-bg)' }}
        aria-hidden="true"
      />
      <div
        className="gz-footer__gradient pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,#1e1e1e_94%,transparent),#161616_98%)]"
        aria-hidden="true"
      />
      <LuxuryBackdrop
        variant="dark"
        washClass="gz-footer__backdrop-wash"
        noiseClass="gz-footer__backdrop-noise"
      />

      <div className="geroz-container-wide relative z-[1]">
        <div className="gz-footer__inner flex flex-col items-center px-4 py-[clamp(2.25rem,4vw,3.25rem)] text-center sm:px-6 lg:px-8">
          <div className="gw-footer-walker-stack">
            <FooterWalkerLottie />
            <GoodWorkFooterBrand
              surface="dark"
              part="logo"
              className="gz-footer__brand"
              logoClassName="gz-footer__logo"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
