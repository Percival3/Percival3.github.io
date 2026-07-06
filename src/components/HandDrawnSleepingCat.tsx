import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Oneko "falling asleep" sprite sheet (BSD License)
// https://commons.wikimedia.org/wiki/File:Neko_animation_steps_-_falling_asleep.png
const FRAME_SIZE = 32;
const SHEET_WIDTH = 128;
const SHEET_HEIGHT = 96;

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

interface HandDrawnSleepingCatProps {
  isHidden?: boolean;
}

export default function HandDrawnSleepingCat({ isHidden = false }: HandDrawnSleepingCatProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (isHidden) return;

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
  }, [isHidden]);

  const { x, y } = ANIMATION_FRAMES[frame];

  return (
    <motion.div
      className="absolute bottom-6 right-6 md:bottom-10 md:right-12 pointer-events-none z-0"
      initial={false}
      animate={{ opacity: isHidden ? 0 : 0.95 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="origin-bottom-right scale-[3] md:scale-[4]">
        <div
          className="h-8 w-8"
          style={{
            backgroundImage: 'url(/oneko-sleeping.png)',
            backgroundPosition: `${-x * FRAME_SIZE}px ${-y * FRAME_SIZE}px`,
            backgroundSize: `${SHEET_WIDTH}px ${SHEET_HEIGHT}px`,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
