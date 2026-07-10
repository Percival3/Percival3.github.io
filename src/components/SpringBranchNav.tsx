import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { motion, useReducedMotion } from 'framer-motion';
import { navigate } from 'astro:transitions/client';
import HandDrawnSleepingCat from './HandDrawnSleepingCat';

const LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
] as const;

const DOOR_W = 110;
const DOOR_H = 170;
const DOOR_DEPTH_X = -12;
const DOOR_DEPTH_Y = -7;

/** SVG feDisplacementMap keeps the plum tips moving while the trunk stays anchored. */
function PlumBranch({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div className="plum-branch pointer-events-none select-none" aria-hidden="true">
      {motionEnabled && (
        <svg aria-hidden="true" className="plum-branch-defs">
          <defs>
            <filter
              id="plum-wind"
              x="-12%"
              y="-12%"
              width="124%"
              height="124%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.018"
                numOctaves="2"
                seed="3"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="11s"
                  values="0.010 0.016;0.014 0.022;0.011 0.015;0.013 0.020;0.010 0.016"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5.5"
                xChannelSelector="R"
                yChannelSelector="G"
              >
                <animate
                  attributeName="scale"
                  dur="9s"
                  values="3.5;7;4.5;6.5;3.5"
                  repeatCount="indefinite"
                />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>
      )}

      <div className="plum-branch-frame">
        <img
          src="/plum-branch.png"
          alt=""
          width={1254}
          height={1254}
          className="plum-branch-base"
          draggable={false}
          decoding="async"
        />
        {motionEnabled && (
          <img
            src="/plum-branch.png"
            alt=""
            width={1254}
            height={1254}
            className="plum-branch-wind"
            draggable={false}
            decoding="async"
          />
        )}
      </div>
    </div>
  );
}

function CenterDoor({
  isOpening,
  onOpen,
  reduceMotion,
}: {
  isOpening: boolean;
  onOpen: () => void;
  reduceMotion: boolean;
}) {
  const frameRef = useRef<SVGSVGElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!frameRef.current || !leafRef.current) return;
    const frameRc = rough.svg(frameRef.current);
    const leafRc = rough.svg(leafRef.current);
    frameRef.current.innerHTML = '';
    leafRef.current.innerHTML = '';

    const ink = '#2A2A2A';
    const options = {
      roughness: 2,
      bowing: 1.5,
      stroke: ink,
      strokeWidth: 2.5,
      fill: 'none' as const,
      fillStyle: 'solid' as const,
      seed: 11,
      disableMultiStroke: true,
    };

    // --- Static outer frame (does not rotate) ---
    const fx = 3;
    const fy = 3;
    const fw = DOOR_W - 6;
    const fh = DOOR_H - 6;
    frameRef.current.appendChild(frameRc.rectangle(fx, fy, fw, fh, options));

    const backX = fx + DOOR_DEPTH_X;
    const backY = fy + DOOR_DEPTH_Y;
    const depthOpts = { ...options, fill: 'none' as const };
    frameRef.current.appendChild(frameRc.line(fx, fy, backX, backY, depthOpts));
    frameRef.current.appendChild(
      frameRc.line(fx + fw, fy, fx + fw + DOOR_DEPTH_X, backY, depthOpts),
    );
    frameRef.current.appendChild(
      frameRc.line(backX, backY, fx + fw + DOOR_DEPTH_X, backY, depthOpts),
    );
    frameRef.current.appendChild(
      frameRc.line(fx + fw, fy + fh, fx + fw + DOOR_DEPTH_X, fy + fh + DOOR_DEPTH_Y, depthOpts),
    );
    frameRef.current.appendChild(
      frameRc.line(
        fx + fw + DOOR_DEPTH_X,
        backY,
        fx + fw + DOOR_DEPTH_X,
        fy + fh + DOOR_DEPTH_Y,
        depthOpts,
      ),
    );

    // --- Inner leaf with knob (rotates around left hinge) ---
    const lx = 2;
    const ly = 2;
    const lw = DOOR_W - 24;
    const lh = DOOR_H - 24;
    leafRef.current.appendChild(
      leafRc.rectangle(lx, ly, lw, lh, {
        ...options,
        strokeWidth: 2,
        seed: 21,
      }),
    );
    leafRef.current.appendChild(
      leafRc.rectangle(lx + 8, ly + 8, lw - 16, lh - 16, {
        ...options,
        strokeWidth: 1.4,
        roughness: 1.5,
        seed: 22,
      }),
    );
    leafRef.current.appendChild(
      leafRc.circle(lx + lw - 16, ly + lh * 0.52, 7, {
        ...options,
        strokeWidth: 1.8,
        fill: ink,
        fillStyle: 'solid',
        seed: 23,
      }),
    );
  }, []);

  return (
    <div className="door-slot">
      <a
        href="/about"
        aria-label="Enter About"
        onClick={(e) => {
          e.preventDefault();
          if (isOpening) return;
          onOpen();
        }}
        className="relative block h-full w-full cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        {/* Outer frame — stays put */}
        <svg
          ref={frameRef}
          viewBox={`0 0 ${DOOR_W} ${DOOR_H}`}
          className="pointer-events-none drop-shadow-sm"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '22.5%',
            top: 0,
            width: '55%',
            height: '74%',
          }}
        />

        {/* Inner leaf — only this rotates around the left hinge */}
        <motion.div
          style={{
            position: 'absolute',
            top: '6%',
            left: 'calc(22.5% + 8px)',
            width: '42%',
            height: '62%',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          initial={false}
          animate={{ rotateY: isOpening ? -92 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: 'easeInOut' }}
        >
          <svg
            ref={leafRef}
            viewBox={`0 0 ${DOOR_W - 20} ${DOOR_H - 20}`}
            className="pointer-events-none"
            aria-hidden="true"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </motion.div>

      </a>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        void navigate(href);
      }}
      className="font-[Caveat] text-3xl md:text-4xl text-ink-main w-fit -rotate-1 transition-[color,transform] duration-200 hover:text-ink-muted hover:rotate-0 hover:translate-x-1"
    >
      {label}
    </a>
  );
}

export default function SpringBranchNav() {
  const [openingDoor, setOpeningDoor] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // A bfcache restore can bring the already-open door back; reset only for that case.
  useEffect(() => {
    const resetAfterHistoryRestore = () => {
      if (window.location.pathname !== '/') return;
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
      setOpeningDoor(false);
    };

    window.addEventListener('pageshow', resetAfterHistoryRestore);
    return () => {
      window.removeEventListener('pageshow', resetAfterHistoryRestore);
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  const handleOpen = () => {
    if (openingDoor) return;
    setOpeningDoor(true);

    if (shouldReduceMotion) {
      void navigate('/about');
      return;
    }

    navigationTimerRef.current = window.setTimeout(() => {
      navigationTimerRef.current = null;
      void navigate('/about');
    }, 720);
  };

  return (
    <div className="home-scene">
      <div className="plum-branch-slot">
        <PlumBranch motionEnabled={!shouldReduceMotion} />
      </div>

      <nav className="plum-nav" aria-label="Primary">
        {LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      <CenterDoor
        isOpening={openingDoor}
        onOpen={handleOpen}
        reduceMotion={Boolean(shouldReduceMotion)}
      />

      <HandDrawnSleepingCat className="sleeping-cat-slot" />
    </div>
  );
}
