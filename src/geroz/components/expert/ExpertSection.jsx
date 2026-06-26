import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGerozContent } from '../../../hooks/geroz/useGerozContent.js';

gsap.registerPlugin(ScrollTrigger);

export default function ExpertSection() {
  const { expert } = useGerozContent();
  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return undefined;

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 48,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="expert-wrapper">
      <h2 ref={titleRef} className="marquee-title text_invert-3">
        {expert.marqueeTitle}
      </h2>
      <div className="container container-1520">
        <div className="row align-items-end justify-content-between">
          <div className="col-xl-2 col-lg-2 col-md-12">
            <div className="experiance has_fade_anim">
              <h2>
                <span>{expert.years}</span>
                <sup>+</sup>
              </h2>
              <p>
                {expert.experiencePrefix}
                <br />
                {expert.experienceField}
              </p>
            </div>
          </div>
          <div className="col-xl-6 col-lg-5 col-md-6">
            <div className="image has_fade_anim">
              <img
                width="670"
                height="955"
                src={expert.image}
                alt={expert.authorName}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="expeart-infu has_fade_anim">
              <div className="icon">
                <i className="flaticon-right-quotation-mark"></i>
              </div>
              <p>{expert.quote}</p>
              <div className="expeart-intro d-flex align-items-end">
                <div className="name">
                  <h5>{expert.authorName}</h5>
                  <span>{expert.authorRole}</span>
                </div>
                <div className="sing">{expert.signature}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
