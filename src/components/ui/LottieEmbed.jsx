export default function LottieEmbed({ src, className = 'jm-icon', isIx2Target }) {
  return (
    <div
      className={className}
      data-animation-type="lottie"
      data-src={src}
      data-loop="0"
      data-direction="1"
      data-autoplay={isIx2Target ? '0' : '1'}
      data-is-ix2-target={isIx2Target ? '1' : '0'}
      data-renderer="svg"
      data-default-duration="0"
      data-duration={isIx2Target ? '2' : '2.8'}
      data-loading="eager"
    />
  );
}
