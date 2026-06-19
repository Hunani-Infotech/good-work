import LottieEmbed from '../ui/LottieEmbed';
import HomeTicker from './HomeTicker';
import { useSite } from '../../context/SiteContext';

export default function ClickScrollSection() {
  const { site } = useSite();
  const { clickScroll } = site.home;
  const suffix = clickScroll.suffix ?? 'to explore';

  const shapes = (clickScroll.shapes || []).filter((shape) => shape.src);
  const hasMedia = clickScroll.lottie || shapes.length;

  return (
    <section data-nav="grey" className="section click-scroll-section">
      <div className="click-scroll-height">
        <div className="wrapper-cont-50">
          <h1 className="click-scroll-text">
            {clickScroll.lines[0]}
            <br />
            {clickScroll.lines[1]}
            <br />
            {clickScroll.lines[2] ? (
              <>
                {clickScroll.lines[2]}
                <br />
              </>
            ) : null}
            <span className="click-scroll-row">
              {clickScroll.scrollWord}
              {suffix ? (
                <>
                  {'\u00A0'}
                  <span className="click-scroll-tail">{suffix}</span>
                </>
              ) : null}
            </span>
          </h1>
        </div>
        {hasMedia ? (
          <div className="wrapper-icons" aria-hidden="true">
            {clickScroll.lottie ? (
              <LottieEmbed src={clickScroll.lottie} className="ll-scroll" />
            ) : null}
            {shapes.map((shape) => (
              <img
                key={shape.className}
                src={shape.src}
                loading="lazy"
                sizes={shape.sizes}
                alt=""
                className={shape.className}
              />
            ))}
          </div>
        ) : null}
        <HomeTicker />
      </div>
    </section>
  );
}
