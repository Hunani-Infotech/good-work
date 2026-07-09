/** Repeat label around a circle for Isak rotating CTA rings. */
export function buildIsakCircleLabel(label) {
  const trimmed = (label || "Let's Connect").trim();
  if (!trimmed) return "Let's Connect — ";

  const unit = `${trimmed} — `;
  let ring = unit;
  while (ring.length < 28) ring += unit;
  return ring;
}

export function splitIsakCircleChars(ringText) {
  const chars = ringText.split('');
  const step = 360 / chars.length;
  return chars.map((char, index) => ({
    char,
    rotate: index * step,
  }));
}
