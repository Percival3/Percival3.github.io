import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Oneko "falling asleep" sprite sheet (BSD License)
// https://commons.wikimedia.org/wiki/File:Neko_animation_steps_-_falling_asleep.png
const FRAME_SIZE = 32;
const SHEET_WIDTH = 128;
const SHEET_HEIGHT = 96;
const DISPLAY_SCALE = 4;
const DISPLAY_SIZE = FRAME_SIZE * DISPLAY_SCALE;
const SHEET_COLS = SHEET_WIDTH / FRAME_SIZE;
const SHEET_ROWS = SHEET_HEIGHT / FRAME_SIZE;

// Row-major order: sit → groom/blink → curl up → sleep (+ zzz) → breathe → sit (loop)
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

const DEFAULT_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: '1.5rem',
  right: '1.5rem',
  zIndex: 0,
  width: DISPLAY_SIZE,
  height: DISPLAY_SIZE,
};

interface HandDrawnSleepingCatProps {
  isHidden?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Enable mouse/touch drag within this container (homepage scene). */
  dragConstraintsRef?: RefObject<HTMLElement | null>;
}

/** Sprite sheet animation — kept separate so frame ticks do not reset drag transform. */
function CatSprite({ paused }: { paused: boolean }) {
  const [frame, setFrame] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused) return;

    if (shouldReduceMotion) {
      setFrame(8);
      return;
    }

    setFrame(0);
    let timeoutId = 0;
    let index = 0;

    const scheduleNext = (frameIndex: number) => {
      timeoutId = window.setTimeout(() => {
        index = (frameIndex + 1) % ANIMATION_FRAMES.length;
        setFrame(index);
        scheduleNext(index);
      }, FRAME_DURATIONS_MS[frameIndex]);
    };

    scheduleNext(0);
    return () => window.clearTimeout(timeoutId);
  }, [paused, shouldReduceMotion]);

  const { x, y } = ANIMATION_FRAMES[frame];

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/oneko-sleeping.png)',
        backgroundPosition: `calc(${-x} * 100%) calc(${-y} * 100%)`,
        backgroundSize: `${SHEET_COLS * 100}% ${SHEET_ROWS * 100}%`,
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
  // When className provides layout (e.g. .sleeping-cat-slot), size comes from CSS vars.
  const sizedByClass = Boolean(className);

  return (
    <motion.div
      className={className}
      style={{
        ...(style ?? (sizedByClass ? undefined : DEFAULT_STYLE)),
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
      <CatSprite paused={isHidden} />
    </motion.div>
  );
}
