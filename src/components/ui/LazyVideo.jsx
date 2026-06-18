export default function LazyVideo({ src, poster, containerClass = 'video-cont-p2' }) {
  return (
    <div className={containerClass}>
      <div className="code-video w-embed">
        <video
          className="lazy-video"
          autoPlay
          loop
          muted
          playsInline
          width="100%"
          height="auto"
          preload="none"
          poster={poster}
        >
          <data-src src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
