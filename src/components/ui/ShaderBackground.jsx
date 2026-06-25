import { useEffect, useRef, useState } from 'react';
import {
  FRAGMENT_SHADER,
  ISAK_PLASMA_PALETTES,
  VERTEX_SHADER,
  initShaderProgram,
} from '../../shaders/isakPlasmaShader.js';
import { getScrollY, subscribeScroll } from '../../animations/scrollRuntime.js';

/**
 * WebGL plasma-line background. Adapted for GoodWork (plain JSX, no Tailwind).
 * @param {{
 *   className?: string;
 *   theme?: 'light' | 'dark';
 *   scrollTriggered?: boolean;
 *   fallbackClassName?: string;
 * }} props
 */
export default function ShaderBackground({
  className = '',
  theme = 'dark',
  scrollTriggered = false,
  fallbackClassName = '',
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(!scrollTriggered);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!scrollTriggered) {
      setActive(true);
      return undefined;
    }

    let hasScrolled = false;
    const startY = getScrollY();
    let observer;

    const tryActivate = () => {
      if (!hasScrolled) return;
      setActive(true);
      observer?.disconnect();
    };

    const unsubScroll = subscribeScroll((scrollY) => {
      if (Math.abs(scrollY - startY) > 12) {
        hasScrolled = true;
        tryActivate();
      }
    });

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryActivate();
      },
      { threshold: 0.12 },
    );

    const root = rootRef.current;
    if (root) observer.observe(root);

    return () => {
      unsubScroll();
      observer?.disconnect();
    };
  }, [scrollTriggered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || !active || webglFailed) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setWebglFailed(true);
      return undefined;
    }

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) {
      setWebglFailed(true);
      return undefined;
    }

    gl.disable(gl.BLEND);

    const program = initShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) {
      setWebglFailed(true);
      return undefined;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const attribVertex = gl.getAttribLocation(program, 'aVertexPosition');
    const uniformResolution = gl.getUniformLocation(program, 'iResolution');
    const uniformTime = gl.getUniformLocation(program, 'iTime');
    const uniformLineColor = gl.getUniformLocation(program, 'uLineColor');
    const uniformBg1 = gl.getUniformLocation(program, 'uBgColor1');
    const uniformBg2 = gl.getUniformLocation(program, 'uBgColor2');
    const uniformLineGain = gl.getUniformLocation(program, 'uLineGain');
    const uniformLightMode = gl.getUniformLocation(program, 'uLightMode');
    const uniformEdgeInset = gl.getUniformLocation(program, 'uEdgeInset');
    const uniformSideVignette = gl.getUniformLocation(program, 'uSideVignette');

    const applyLayout = () => {
      const isMobileLayout = root.getBoundingClientRect().width < 992;
      gl.uniform1f(uniformEdgeInset, isMobileLayout ? 0.02 : 0.12);
      gl.uniform1f(uniformSideVignette, isMobileLayout ? 0.3 : 1.0);
    };

    const applyPalette = () => {
      const palette = ISAK_PLASMA_PALETTES[theme] || ISAK_PLASMA_PALETTES.dark;
      gl.uniform3fv(uniformLineColor, palette.line);
      gl.uniform3fv(uniformBg1, palette.bg1);
      gl.uniform3fv(uniformBg2, palette.bg2);
      gl.uniform1f(uniformLineGain, palette.lineGain ?? 1.0);
      gl.uniform1f(uniformLightMode, palette.lightMode ?? 0);
    };

    const resizeCanvas = () => {
      const { width, height } = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(width * dpr));
      const h = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      applyLayout();
    };

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(root);
    resizeCanvas();

    const startTime = performance.now();
    let rafId = 0;
    let running = true;

    const render = (now) => {
      if (!running) return;

      const elapsed = (now - startTime) / 1000;
      const palette = ISAK_PLASMA_PALETTES[theme] || ISAK_PLASMA_PALETTES.dark;
      gl.clearColor(palette.bg1[0], palette.bg1[1], palette.bg1[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      applyPalette();
      applyLayout();
      gl.uniform2f(uniformResolution, canvas.width, canvas.height);
      gl.uniform1f(uniformTime, elapsed);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(attribVertex, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribVertex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    };
  }, [active, theme, webglFailed]);

  const rootClass = [
    'shader-background',
    active ? 'shader-background--active' : '',
    webglFailed ? 'shader-background--fallback' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClass} aria-hidden="true">
      {webglFailed ? (
        <div className={`shader-background__fallback ${fallbackClassName}`.trim()} />
      ) : (
        <canvas ref={canvasRef} className="shader-background__canvas" />
      )}
    </div>
  );
}
