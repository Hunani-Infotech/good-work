import { resolveGoodworkWordmark } from '../../utils/brandLogos.js';

/**
 * GoodWork stacked wordmark — picks light or dark variant for the surface behind it.
 * @param {'light' | 'dark'} surface
 */
export default function GoodWorkWordmark({
  surface = 'light',
  className = '',
  alt = 'Good Work',
  ...props
}) {
  return (
    <img
      src={resolveGoodworkWordmark(surface)}
      alt={alt}
      className={className}
      decoding="async"
      {...props}
    />
  );
}
