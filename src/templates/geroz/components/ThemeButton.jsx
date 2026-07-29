export default function ThemeButton({
  href,
  children,
  className = '',
  variant = 'accent',
}) {
  const variantClass =
    variant === 'light'
      ? 'geroz-theme-btn--light'
      : variant === 'dark'
        ? 'geroz-theme-btn--dark'
        : 'geroz-theme-btn--accent';

  return (
    <a
      href={href}
      className={`geroz-theme-btn ${variantClass} ${className}`.trim()}
    >
      <span className="geroz-theme-btn__label">{children}</span>
    </a>
  );
}
