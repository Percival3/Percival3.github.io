import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { navigate } from 'astro:transitions/client';
import HandDrawnSleepingCat from './HandDrawnSleepingCat';

const LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
] as const;

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="home-scene" ref={sceneRef}>
      <div className="plum-branch-slot">
        <PlumBranch motionEnabled={!shouldReduceMotion} />
      </div>

      <nav className="plum-nav" aria-label="Primary">
        {LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      <HandDrawnSleepingCat
        className="sleeping-cat-slot"
        dragConstraintsRef={sceneRef}
      />
    </div>
  );
}
