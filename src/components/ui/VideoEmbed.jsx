import { useSite } from '../../context/SiteContext';

export default function VideoEmbed({ src, poster, className = 'video-cont-p2 home' }) {
  const { site } = useSite();
  const videoPoster = poster || site.site.assets.videoPosterHome;

  return (
    <div className={className}>
      <div className="code-video w-embed">
        <video autoPlay loop muted playsInline width="100%" height="100%" preload="metadata" poster={videoPoster}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
