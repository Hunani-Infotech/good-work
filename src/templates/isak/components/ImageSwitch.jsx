import { useEffect, useState } from 'react';
import { useIsakTheme } from './IsakThemeProvider.jsx';

export function ImageSwitch({
  light,
  dark,
  alt = 'Image',
  width,
  height,
  className,
  loading = 'lazy',
}) {
  const { resolvedTheme } = useIsakTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === 'dark' && dark ? dark : light;

  return (
    <img
      className={['image-switch', className].filter(Boolean).join(' ')}
      data-light={light}
      data-dark={dark}
      loading={loading}
      width={width}
      height={height}
      src={src}
      alt={alt}
    />
  );
}
