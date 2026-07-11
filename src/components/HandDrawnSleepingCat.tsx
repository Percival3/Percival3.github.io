import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Oneko "falling asleep" sprite sheet (BSD License)
// https://commons.wikimedia.org/wiki/File:Neko_animation_steps_-_falling_asleep.png
const FRAME_SIZE = 32;
const SHEET_WIDTH = 128;
const SHEET_HEIGHT = 96;
const DESKTOP_SCALE = 4;
const MOBILE_SCALE = 3;

// Row-major order: sit → groom/blink → curl up → sleep (+ zzz) → breathe → sit (loop)
// Sheet is 4x3; bottom-right cell is empty and must never be selected.
const ANIMATION_FRAMES = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
] as const;

const FRAME_DURATIONS_MS = [
  700, 450, 450, 450,
  450, 700, 550, 1600,
  1000, 1800, 900,
] as const;

interface HandDrawnSleepingCatProps {
  isHidden?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Enable mouse/touch drag within this container (homepage scene). */
  dragConstraintsRef?: RefObject<HTMLElement | null>;
}

function useCatScale() {
  const [scale, setScale] = useState(DESKTOP_SCALE);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setScale(mq.matches ? MOBILE_SCALE : DESKTOP_SCALE);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return scale;
}

/** Sprite sheet animation — kept separate so frame ticks do not reset drag transform. */
function CatSprite({
  paused,
  scale,
}: {
  paused: boolean;
  scale: number;
}) {
  const [frame, setFrame] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const size = FRAME_SIZE * scale;

  useEffect(() => {
    if (paused) return;

    if (shouldReduceMotion) {
      setFrame(8);
      return;
    }

    setFrame(0);
    let timeoutId = 0;
    let index = 0;
    let cancelled = false;

    const scheduleNext = (frameIndex: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        index = (frameIndex + 1) % ANIMATION_FRAMES.length;
        setFrame(index);
        scheduleNext(index);
      }, FRAME_DURATIONS_MS[frameIndex]);
    };

    scheduleNext(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [paused, shouldReduceMotion]);

  const { x, y } = ANIMATION_FRAMES[frame];

  // Pixel offsets only — no transform:scale / percentage sprite math (both break on mobile).
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundImage: 'url(/oneko-sleeping.png)',
        backgroundPosition: `${-x * size}px ${-y * size}px`,
        backgroundSize: `${SHEET_WIDTH * scale}px ${SHEET_HEIGHT * scale}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function HandDrawnSleepingCat({
  isHidden = false,
  className,
  style,
  dragConstraintsRef,
}: HandDrawnSleepingCatProps) {
  const canDrag = Boolean(dragConstraintsRef) && !isHidden;
  const scale = useCatScale();
  const size = FRAME_SIZE * scale;
  const sizedByClass = Boolean(className);

  return (
    <motion.div
      className={className}
      style={{
        ...(style ??
          (sizedByClass
            ? undefined
            : {
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 0,
              })),
        width: size,
        height: size,
        opacity: isHidden ? 0 : 0.95,
        cursor: canDrag ? 'grab' : undefined,
        touchAction: canDrag ? 'none' : undefined,
        pointerEvents: canDrag ? 'auto' : 'none',
        userSelect: 'none',
      }}
      drag={canDrag}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      dragElastic={0.08}
      dragPropagation={false}
      whileDrag={
        canDrag
          ? { cursor: 'grabbing', scale: 1.08, zIndex: 40 }
          : undefined
      }
      aria-label={canDrag ? '拖动小猫' : undefined}
      role={canDrag ? 'img' : undefined}
      title={canDrag ? '按住拖动' : undefined}
    >
      <CatSprite paused={isHidden} scale={scale} />
    </motion.div>
  );
}
