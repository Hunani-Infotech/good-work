import { useCustomContext } from '../../context/GerozContext.jsx';
import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';
import GerozLongArrow from '../icons/GerozLongArrow.jsx';

export default function CtaSection3() {
  const { cta } = useGerozContent();
  const { renderCircleText } = useCustomContext();

  return (
    <section id="cta" className="cta-wrapper cta-3">
      <div className="shape">
        <img
          className="shape-1"
          src={cta.shapeImage}
          alt=""
          width="1320"
          height="363"
        />
      </div>
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-xl-7 col-lg-7 col-12">
            <div className="section-title ms-5">
              <h2 className="text-white tp-char-animation">{cta.title}</h2>
            </div>
          </div>
          <div className="offset-xl-1 col-xl-2 col-lg-2 col-12">
            <div className="cta-arrow">
              <svg
                width="146"
                height="147"
                viewBox="0 0 146 147"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="arrow-path"
                  d="M13.2675 151.978C-14.9941 96.7215 11.0094 10.7142 56.7816 55.219C85.3472 82.9936 17.441 74.5293 41.1041 38.8724C60.0347 10.347 114.229 6.96293 138.959 8.83675L123.22 21.4655C129.971 18.3438 143.616 11.4648 144.185 8.92165C144.755 6.37851 129.378 3.31736 121.619 2.10438"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
          <div className="col-xl-2 col-lg-2 col-12">
            <a href={cta.href} className="circle">
              <div className="circle-icon">
                <GerozLongArrow />
              </div>
              <div className="circle-text">
                <p>{renderCircleText(cta.circleText)}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
