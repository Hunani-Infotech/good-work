import { useGerozColorTheme } from '../context/ColorThemeContext.jsx';

export default function ColorPaletteSwitcher({ className = '' }) {
  const { colorThemeIndex, setColorThemeIndex, palettes, activeTheme } =
    useGerozColorTheme();

  return (
    <div
      className={`geroz-palette ${className}`.trim()}
      role="group"
      aria-label="Colour palette demo"
    >
      <span className="geroz-palette__label">Palette</span>

      <div className="geroz-palette__swatches">
        {palettes.map((palette, index) => (
          <button
            key={palette.id}
            type="button"
            className={`geroz-palette__swatch${index === colorThemeIndex ? ' is-active' : ''}`}
            style={{
              '--swatch-base': palette.accent,
              '--swatch-glow': palette.secondary,
              '--swatch-shape': palette.shape ?? palette.secondary,
            }}
            onClick={() => setColorThemeIndex(index)}
            aria-label={`${palette.name} theme`}
            aria-pressed={index === colorThemeIndex}
            title={palette.name}
          />
        ))}
      </div>

      <span className="geroz-palette__name" aria-live="polite">
        {activeTheme.name}
      </span>
    </div>
  );
}
