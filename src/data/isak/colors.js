export const colorSwatches = [
  {
    label: 'Default',
    mode: 'light',
    className: 'type-body-default',
    bodyClass: 'body-default',
  },
  {
    label: 'Silver Dawn',
    mode: 'light',
    className: 'type-body-v1',
    bodyClass: 'body-v1',
  },
  {
    label: 'Lavender Stone',
    mode: 'light',
    className: 'type-body-v2',
    bodyClass: 'body-v2',
  },
  {
    label: 'Ocean Breeze',
    mode: 'light',
    className: 'type-body-v3',
    bodyClass: 'body-v3',
  },
  {
    label: 'Midnight Fade',
    mode: 'dark',
    className: 'type-dark-v1',
    bodyClass: 'dark-v1',
  },
  {
    label: 'Charcoal Mist',
    mode: 'dark',
    className: 'type-dark-v2',
    bodyClass: 'dark-v2',
  },
  {
    label: 'Forest Shadow',
    mode: 'dark',
    className: 'type-dark-v3',
    bodyClass: 'dark-v3',
  },
];

export const COLOR_VARIANT_STORAGE_KEY = 'isak-color-variant';

export function getColorSwatch(bodyClass) {
  return colorSwatches.find((item) => item.bodyClass === bodyClass);
}

export function getDefaultColorBodyClass(mode = 'dark') {
  return mode === 'dark' ? 'dark-v1' : 'body-default';
}

export function isColorBodyClass(className) {
  return className === 'body-default'
    || className.startsWith('body-v')
    || className.startsWith('dark-v');
}

export function clearColorBodyClasses(body = document.body) {
  body.classList.forEach((className) => {
    if (isColorBodyClass(className)) {
      body.classList.remove(className);
    }
  });
}

export function applyBodyModeClass(mode, body = document.body) {
  body.classList.remove('dark-mode', 'light-mode');
  body.classList.add(mode === 'dark' ? 'dark-mode' : 'light-mode');
}

/** Apply palette + light/dark mode together (keeps CSS selectors in sync). */
export function applyColorVariant(bodyClass, body = document.body) {
  const swatch = getColorSwatch(bodyClass);
  if (!swatch) return null;

  clearColorBodyClasses(body);
  body.classList.add(swatch.bodyClass);
  applyBodyModeClass(swatch.mode, body);

  return swatch;
}
