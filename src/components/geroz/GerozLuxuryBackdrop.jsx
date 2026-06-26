export const GEROZ_AMBIENT_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

const WASH_VARIANTS = {
  cream:
    'bg-[radial-gradient(ellipse_55%_45%_at_8%_42%,color-mix(in_srgb,var(--color-lawyer)_9%,transparent),transparent_68%),radial-gradient(ellipse_45%_40%_at_92%_58%,color-mix(in_srgb,var(--color-lawyer)_7%,transparent),transparent_72%)]',
  white:
    'bg-[radial-gradient(ellipse_50%_40%_at_12%_20%,color-mix(in_srgb,var(--color-lawyer)_6%,transparent),transparent_70%),radial-gradient(ellipse_45%_35%_at_88%_80%,color-mix(in_srgb,var(--color-lawyer)_5%,transparent),transparent_72%)]',
  dark:
    'bg-[radial-gradient(ellipse_52%_42%_at_10%_18%,color-mix(in_srgb,var(--color-lawyer)_14%,transparent),transparent_72%),radial-gradient(ellipse_48%_38%_at_90%_82%,color-mix(in_srgb,var(--color-lawyer)_10%,transparent),transparent_74%)]',
};

export default function GerozLuxuryBackdrop({ variant = 'cream' }) {
  const wash = WASH_VARIANTS[variant] ?? WASH_VARIANTS.cream;
  const noiseOpacity = variant === 'dark' ? 'opacity-35' : 'opacity-25';

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 ${wash}`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute inset-0 ${noiseOpacity}`}
        style={{ backgroundImage: GEROZ_AMBIENT_BG }}
        aria-hidden="true"
      />
    </>
  );
}
