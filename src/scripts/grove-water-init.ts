import { mountGroveRipples, type GroveRipplesHandle } from './grove-ripples';

/**
 * Light-rain drops: small impacts across the full viewport (the whole scene is water).
 * Coordinates are fractions of the viewport (0–1).
 */
const RAIN = {
  /** Horizontal span for random drops */
  xMin: 0.04,
  xMax: 0.96,
  /** Full vertical span */
  yMin: 0.04,
  yMax: 0.96,
  /** How often a new droplet falls (ms) — higher = slower rain */
  intervalMs: 280,
  /** Droplets per tick */
  dropsPerTick: 1,
  /** Pixel radius range */
  radiusMin: 6,
  radiusMax: 11,
  /** Wave strength range (keep low for drizzle) */
  strengthMin: 0.006,
  strengthMax: 0.014,
};

let handle: GroveRipplesHandle | null = null;
let dropTimer = 0;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isHome() {
  return document.body.classList.contains('is-home');
}

function clearDropTimer() {
  if (dropTimer) {
    window.clearInterval(dropTimer);
    dropTimer = 0;
  }
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function scheduleDrops() {
  clearDropTimer();
  if (!handle || handle.destroyed || prefersReducedMotion() || !isHome()) return;

  const dropRain = () => {
    if (!handle || handle.destroyed || !isHome()) return;
    const el = document.querySelector('.grove-water') as HTMLElement | null;
    if (!el) return;

    const { clientWidth: w, clientHeight: h } = el;
    for (let i = 0; i < RAIN.dropsPerTick; i++) {
      const x = w * rand(RAIN.xMin, RAIN.xMax);
      const y = h * rand(RAIN.yMin, RAIN.yMax);
      const radius = rand(RAIN.radiusMin, RAIN.radiusMax);
      const strength = rand(RAIN.strengthMin, RAIN.strengthMax);
      handle.drop(x, y, radius, strength);
    }
  };

  dropRain();
  dropTimer = window.setInterval(dropRain, RAIN.intervalMs);
}

function destroyRipples() {
  clearDropTimer();
  handle?.destroy();
  handle = null;
}

function mountIfNeeded() {
  const el = document.querySelector('.grove-water') as HTMLElement | null;
  if (!el) return;

  if (!isHome() || prefersReducedMotion()) {
    destroyRipples();
    return;
  }

  if (handle && !handle.destroyed) {
    handle.play();
    handle.updateSize();
    scheduleDrops();
    return;
  }

  destroyRipples();
  handle = mountGroveRipples(el, {
    imageUrl: '/ink-grove.png',
    resolution: 512,
    dropRadius: 10,
    // Softer refraction + slower wave travel for a quiet drizzle
    perturbance: 0.016,
    backgroundPositionY: 38,
    waveSpeed: 0.45,
    damping: 0.997,
  });

  if (!handle) {
    // WebGL unavailable — leave static body::before visible
    return;
  }

  scheduleDrops();
}

function sync() {
  if (isHome() && !prefersReducedMotion()) {
    mountIfNeeded();
  } else {
    destroyRipples();
  }
}

document.addEventListener('astro:page-load', sync);
document.addEventListener('astro:after-swap', sync);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sync, { once: true });
} else {
  sync();
}

window
  .matchMedia('(prefers-reduced-motion: reduce)')
  .addEventListener('change', sync);
