export default function ThemeButton({
  href,
  children,
  className = '',
  variant = 'accent',
}) {
  const variantClass =
    variant === 'light'
      ? 'geroz-theme-btn--light bg-white hover:bg-white'
      : variant === 'dark'
        ? 'bg-[#333] hover:bg-[#151515]'
        : 'geroz-theme-btn--accent bg-lawyer hover:bg-[color-mix(in_srgb,var(--color-lawyer)_88%,#000)]';

  return (
    <a
      href={href}
      className={`geroz-theme-btn ${variantClass} ${className}`.trim()}
    >
      <span className="geroz-theme-btn__label">{children}</span>
    </a>
  );
}
