/** WebGL plasma-line shader — matches reference logic, Isak theme colours. */

export const VERTEX_SHADER = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec3 uLineColor;
  uniform vec3 uBgColor1;
  uniform vec3 uBgColor2;
  uniform float uLineGain;
  uniform float uLightMode;
  uniform float uEdgeInset;
  uniform float uSideVignette;

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float axisWidth = 0.05;
  const float majorLineWidth = 0.025;
  const float minorLineWidth = 0.0125;
  const float majorLineFrequency = 5.0;
  const float minorLineFrequency = 1.0;
  const float scale = 4.0;
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
  #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float sideBell = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
    float horizontalFade = mix(1.0, sideBell, uSideVignette);
    float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);
    float tightEdgeX = smoothstep(0.0, uEdgeInset, uv.x) * smoothstep(1.0, 1.0 - uEdgeInset, uv.x);
    float tightEdgeY = smoothstep(0.0, 0.14, uv.y) * smoothstep(1.0, 0.86, uv.y);
    float lineMask = horizontalFade * verticalFade * tightEdgeX * tightEdgeY;

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec4 lines = vec4(0.0);
    vec4 lineColor = vec4(uLineColor, 1.0);
    float lineStrength = 0.0;

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade * tightEdgeX) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade * tightEdgeX);
      float linePosition = getPlasmaY(space.x, horizontalFade * tightEdgeX, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade * tightEdgeX, offset));
      float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

      line = line + circle;
      lines += line * lineColor * rand;
      lineStrength += line * rand;
    }

    fragColor = mix(vec4(uBgColor1, 1.0), vec4(uBgColor2, 1.0), uv.x);
    fragColor.a = 1.0;

    if (uLightMode > 0.5) {
      float alpha = min(lineStrength * lineMask * uLineGain, 0.98);
      fragColor.rgb = mix(fragColor.rgb, uLineColor, alpha);
    } else {
      fragColor += lines * lineMask * uLineGain;
    }

    gl_FragColor = fragColor;
  }
`;

/** @typedef {{ line: [number, number, number]; bg1: [number, number, number]; bg2: [number, number, number]; lineGain?: number; lightMode?: number }} PlasmaPalette */

/** @type {Record<'light' | 'dark', PlasmaPalette>} */
export const ISAK_PLASMA_PALETTES = {
  light: {
    line: [0.0, 0.870588, 0.317647],
    lineGain: 2.35,
    lightMode: 1,
    bg1: [0.922, 0.922, 0.922],
    bg2: [0.922, 0.922, 0.922],
  },
  dark: {
    line: [0.0, 0.870588, 0.317647],
    lineGain: 1.0,
    lightMode: 0,
    bg1: [0.039, 0.055, 0.051],
    bg2: [0.039, 0.055, 0.051],
  },
};

export function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader program link error:', gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}
