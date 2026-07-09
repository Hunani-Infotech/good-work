import { resolveGoodworkAnimatedLogo, resolveGoodworkWordmark } from '../../utils/brandLogos.js';

/**
 * GoodWork brand mark — stacked wordmark or animated Malaysia Digital logo.
 * @param {'light' | 'dark'} surface — background the logo sits on (wordmark variant only)
 * @param {boolean} animated — use animated Malaysia Digital logo (individual CV pages)
 */
export default function GoodWorkWordmark({
  surface = 'light',
  animated = false,
  className = '',
  alt = animated ? 'GoodWork — Malaysia Digital' : 'Good Work',
  ...props
}) {
  return (
    <img
      src={animated ? resolveGoodworkAnimatedLogo() : resolveGoodworkWordmark(surface)}
      alt={alt}
      className={['goodwork-wordmark', animated ? 'goodwork-wordmark--animated' : '', className]
        .filter(Boolean)
        .join(' ')}
      decoding="async"
      {...props}
    />
  );
}
