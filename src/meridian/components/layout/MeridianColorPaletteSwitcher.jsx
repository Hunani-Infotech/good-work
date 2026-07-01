import { useMeridianColorTheme } from '../../context/MeridianColorThemeContext.jsx';

export default function MeridianColorPaletteSwitcher({ className = '', onHero = false }) {
  const { paletteIndex, setPaletteIndex, palettes, activePalette } = useMeridianColorTheme();

  return (
    <div
      className={`meridian-palette ${onHero ? 'meridian-palette--on-hero' : ''} ${className}`.trim()}
      role="group"
      aria-label="Colour palette"
    >
      <span className="meridian-palette__label">Palette</span>

      <div className="meridian-palette__swatches">
        {palettes.map((palette, index) => (
          <button
            key={palette.id}
            type="button"
            className={`meridian-palette__swatch${index === paletteIndex ? ' is-active' : ''}`}
            style={{
              '--swatch-accent': palette.accent,
              '--swatch-hero': palette.heroBg,
            }}
            onClick={() => setPaletteIndex(index)}
            aria-label={`${palette.name} palette`}
            aria-pressed={index === paletteIndex}
            title={palette.name}
          />
        ))}
      </div>

      <span className="meridian-palette__name" aria-live="polite">
        {activePalette.name}
      </span>
    </div>
  );
}
