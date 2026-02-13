import React, { useEffect, useRef } from 'react';

type Mode = 'rain' | 'petal';

type Particle = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  drift: number;
  length: number;
  color: string;
};

const PETAL_COLORS = ['#ffd9bf', '#f7c6a8', '#ffe0b8', '#f5d5bd'];
const NEON_RAIN_COLORS = ['rgba(64,255,235,0.78)', 'rgba(82,214,255,0.72)', 'rgba(120,255,189,0.68)', 'rgba(199,88,255,0.5)'];

const EFFECT_PRESET = {
  performance: {
    lowPowerCpuThreads: 6,
    reducedMotionFrameInterval: 80,
    rainFrameIntervalLowPower: 45,
    rainFrameIntervalDefault: 34,
    petalFrameIntervalLowPower: 40,
    petalFrameIntervalDefault: 28,
  },
  petal: {
    countLowPower: 24,
    countDefault: 34,
    speedXMin: -0.2,
    speedXRange: 0.42,
    speedYMin: 0.35,
    speedYRange: 0.8,
    sizeMin: 2.6,
    sizeRange: 3.2,
    opacityMin: 0.32,
    opacityRange: 0.32,
    rotationSpeedMin: -0.6,
    rotationSpeedRange: 1.2,
    swayStrength: 0.35,
    boundary: 24,
  },
  rain: {
    countLowPower: 50,
    countDefault: 74,
    speedXBase: 0.85,
    speedXRange: 0.85,
    speedYMin: 8.8,
    speedYRange: 4.8,
    sizeMin: 0.8,
    sizeRange: 1.1,
    opacityMin: 0.29,
    opacityRange: 0.3,
    lengthMin: 9,
    lengthRange: 12,
    lineMultiplier: 2.1,
    lineWidthMultiplier: 1.2,
    respawnYBoundary: 30,
    respawnXBoundary: -110,
  },
} as const;

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice = (navigator.hardwareConcurrency ?? 8) <= EFFECT_PRESET.performance.lowPowerCpuThreads;

    let animationFrameId = 0;
    let lastFrameTime = 0;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    let mode: Mode = document.documentElement.classList.contains('dark') ? 'rain' : 'petal';

    const getFrameInterval = () => {
      if (prefersReducedMotion) return EFFECT_PRESET.performance.reducedMotionFrameInterval;
      if (mode === 'rain') {
        return lowPowerDevice
          ? EFFECT_PRESET.performance.rainFrameIntervalLowPower
          : EFFECT_PRESET.performance.rainFrameIntervalDefault;
      }
      return lowPowerDevice
        ? EFFECT_PRESET.performance.petalFrameIntervalLowPower
        : EFFECT_PRESET.performance.petalFrameIntervalDefault;
    };

    const createParticle = (randomY: boolean): Particle => {
      const x = Math.random() * (mode === 'rain' ? width + 200 : width) - (mode === 'rain' ? 100 : 0);
      const y = randomY ? Math.random() * height : -18;

      if (mode === 'petal') {
        const p = EFFECT_PRESET.petal;
        return {
          x,
          y,
          speedX: Math.random() * p.speedXRange + p.speedXMin,
          speedY: Math.random() * p.speedYRange + p.speedYMin,
          size: Math.random() * p.sizeRange + p.sizeMin,
          opacity: Math.random() * p.opacityRange + p.opacityMin,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * p.rotationSpeedRange + p.rotationSpeedMin,
          drift: Math.random() * Math.PI * 2,
          length: 0,
          color: randomFrom(PETAL_COLORS),
        };
      }

      const r = EFFECT_PRESET.rain;
      return {
        x,
        y,
        speedX: -(Math.random() * r.speedXRange + r.speedXBase),
        speedY: Math.random() * r.speedYRange + r.speedYMin,
        size: Math.random() * r.sizeRange + r.sizeMin,
        opacity: Math.random() * r.opacityRange + r.opacityMin,
        rotation: 0,
        rotationSpeed: 0,
        drift: 0,
        length: Math.random() * r.lengthRange + r.lengthMin,
        color: randomFrom(NEON_RAIN_COLORS),
      };
    };

    const initParticles = () => {
      const p = EFFECT_PRESET.petal;
      const r = EFFECT_PRESET.rain;
      const count = mode === 'petal'
        ? (lowPowerDevice ? p.countLowPower : p.countDefault)
        : (lowPowerDevice ? r.countLowPower : r.countDefault);
      particles = Array.from({ length: count }, () => createParticle(true));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.8);
      ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.35, p.size * 0.62, p.size * 0.75, 0, p.size * 0.9);
      ctx.bezierCurveTo(-p.size * 0.62, p.size * 0.75, -p.size * 0.85, -p.size * 0.35, 0, -p.size * 0.8);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.restore();
    };

    const drawNeonRain = (p: Particle) => {
      const r = EFFECT_PRESET.rain;
      const endX = p.x + p.speedX * r.lineMultiplier;
      const endY = p.y + p.length;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.7, p.size * r.lineWidthMultiplier);
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    };

    const render = (timestamp: number) => {
      const interval = getFrameInterval();
      if (timestamp - lastFrameTime < interval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]!;

        if (mode === 'petal') {
          const pConfig = EFFECT_PRESET.petal;
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y * 0.014 + p.drift) * pConfig.swayStrength;
          p.rotation += p.rotationSpeed;

          if (p.y > height + pConfig.boundary || p.x > width + pConfig.boundary || p.x < -pConfig.boundary) {
            particles[i] = createParticle(false);
            continue;
          }

          drawPetal(p);
        } else {
          const rConfig = EFFECT_PRESET.rain;
          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height + rConfig.respawnYBoundary || p.x < rConfig.respawnXBoundary) {
            particles[i] = createParticle(false);
            continue;
          }

          drawNeonRain(p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const nextMode: Mode = document.documentElement.classList.contains('dark') ? 'rain' : 'petal';
          if (nextMode !== mode) {
            mode = nextMode;
            initParticles();
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}
