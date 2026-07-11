import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';

// Oneko "falling asleep" sprite sheet (BSD License)
// https://commons.wikimedia.org/wiki/File:Neko_animation_steps_-_falling_asleep.png
const FRAME_SIZE = 32;
const SHEET_WIDTH = 128;
const SHEET_HEIGHT = 96;
const DISPLAY_SCALE = 4;
const DISPLAY_SIZE = FRAME_SIZE * DISPLAY_SCALE;

const CAT_POS_KEY = 'zpc-home-cat-drag';

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
};

interface HandDrawnSleepingCatProps {
  isHidden?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Enable mouse/touch drag within this container (homepage scene). */
  dragConstraintsRef?: RefObject<HTMLElement | null>;
}

function readSavedOffset(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(CAT_POS_KEY);
    if (!raw) return { x: 0, y: 0 };
    const parsed = JSON.parse(raw) as { x?: unknown; y?: unknown };
    const x = typeof parsed.x === 'number' && Number.isFinite(parsed.x) ? parsed.x : 0;
    const y = typeof parsed.y === 'number' && Number.isFinite(parsed.y) ? parsed.y : 0;
    return { x, y };
  } catch {
    return { x: 0, y: 0 };
  }
}

function writeSavedOffset(x: number, y: number) {
  try {
    localStorage.setItem(CAT_POS_KEY, JSON.stringify({ x, y }));
  } catch {
    // Ignore quota / private-mode failures.
  }
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
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        backgroundImage: 'url(/oneko-sleeping.png)',
        backgroundPosition: `${-x * DISPLAY_SIZE}px ${-y * DISPLAY_SIZE}px`,
        backgroundSize: `${SHEET_WIDTH * DISPLAY_SCALE}px ${SHEET_HEIGHT * DISPLAY_SCALE}px`,
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
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [offsetReady, setOffsetReady] = useState(false);

  // Restore last drag offset after mount so View Transitions / remounts keep the spot.
  useEffect(() => {
    const saved = readSavedOffset();
    dragX.set(saved.x);
    dragY.set(saved.y);
    setOffsetReady(true);
  }, [dragX, dragY]);

  return (
    <motion.div
      className={className}
      style={{
        ...(style ?? (className ? undefined : DEFAULT_STYLE)),
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        opacity: isHidden ? 0 : offsetReady ? 0.95 : 0,
        cursor: canDrag ? 'grab' : undefined,
        touchAction: canDrag ? 'none' : undefined,
        pointerEvents: canDrag ? 'auto' : 'none',
        userSelect: 'none',
        x: dragX,
        y: dragY,
      }}
      drag={canDrag}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      dragElastic={0.08}
      dragPropagation={false}
      onDragEnd={() => {
        writeSavedOffset(dragX.get(), dragY.get());
      }}
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
