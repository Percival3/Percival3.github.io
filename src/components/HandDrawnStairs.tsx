import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';
import { navigate } from 'astro:transitions/client';
import HandDrawnSleepingCat from './HandDrawnSleepingCat';

const STAIR_DEPTH_X = -44;
const STAIR_DEPTH_Y = -22;
const DOOR_DEPTH_X = -12;
const DOOR_DEPTH_Y = -7;

type Point = [number, number];
const withDepth = ([x, y]: Point): Point => [x + STAIR_DEPTH_X, y + STAIR_DEPTH_Y];

interface Step {
  x1: number;
  x2: number;
  y: number;
  riserTop: number | null;
}

const STEPS: Step[] = [
  { x1: 50, x2: 250, y: 500, riserTop: 380 },
  { x1: 250, x2: 450, y: 380, riserTop: 260 },
  { x1: 450, x2: 660, y: 260, riserTop: null },
];

interface DoorProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  href: string;
  rotationDeg: number;
  isOpening: boolean;
  onClick: (href: string, x: number, y: number, w: number, h: number) => void;
}

function Door({ x, y, width, height, label, href, rotationDeg, isOpening, onClick }: DoorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);
    svgRef.current.innerHTML = '';
    const options = { 
      roughness: 2, 
      bowing: 1.5, 
      stroke: '#2A2A2A', 
      strokeWidth: 2.5, 
      fill: 'none', 
      fillStyle: 'solid', 
      hachureAngle: 60, 
      hachureGap: 5 
    };
    const inset = 2;
    const w = width - inset * 2;
    const h = height - inset * 2;

    // Front face
    svgRef.current.appendChild(rc.rectangle(inset, inset, w, h, options));

    // Depth edges (up-left, matching stair perspective)
    const backX = inset + DOOR_DEPTH_X;
    const backY = inset + DOOR_DEPTH_Y;
    const depthOpts = { ...options, fill: 'none' };

    svgRef.current.appendChild(rc.line(inset, inset, backX, backY, depthOpts));
    svgRef.current.appendChild(rc.line(inset + w, inset, inset + w + DOOR_DEPTH_X, backY, depthOpts));
    svgRef.current.appendChild(rc.line(backX, backY, inset + w + DOOR_DEPTH_X, backY, depthOpts));
    svgRef.current.appendChild(rc.line(inset + w, inset + h, inset + w + DOOR_DEPTH_X, inset + h + DOOR_DEPTH_Y, depthOpts));
    svgRef.current.appendChild(rc.line(inset + w + DOOR_DEPTH_X, backY, inset + w + DOOR_DEPTH_X, inset + h + DOOR_DEPTH_Y, depthOpts));

    // Frame hint on front face
    const frameOpts = { ...depthOpts, strokeWidth: 1.5, roughness: 1.5 };
    svgRef.current.appendChild(rc.rectangle(inset + 8, inset + 8, w - 16, h - 16, frameOpts));
  }, [width, height]);

  return (
    <div 
      className="absolute z-10"
      style={{ 
        left: `${(x / 900) * 100}%`, 
        top: `${(y / 600) * 100}%`, 
        width: `${(width / 900) * 100}%`, 
        height: `${(height / 600) * 100}%`,
        perspective: '1000px'
      }}
    >
      <motion.a 
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onClick(href, x, y, width, height);
        }}
        initial="initial"
        animate={isOpening ? "opening" : "initial"}
        whileHover={!isOpening ? "hover" : "initial"}
        variants={{
          initial: { rotateY: 0, opacity: 1, scale: 1 },
          hover: { rotateY: 0, opacity: 1, scale: 1.05 },
          opening: { rotateY: -90, opacity: 0.2, scale: 1 }
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full h-full block relative cursor-pointer group"
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
      >
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full drop-shadow-sm pointer-events-none" />
        
        <div 
          className="absolute z-20 pointer-events-none"
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <motion.div 
            className="font-[Caveat] text-3xl text-ink-main transition-colors duration-300 group-hover:text-ink-muted"
            variants={{
              initial: { rotate: rotationDeg },
              hover: { rotate: 0 },
              opening: { rotate: 0 }
            }}
            transition={{ duration: 0.2 }}
            style={{ width: 'max-content' }}
          >
            {label}
          </motion.div>
        </div>
      </motion.a>
    </div>
  );
}

export default function HandDrawnStairs() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [openingDoor, setOpeningDoor] = useState<string | null>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [sceneKey, setSceneKey] = useState(0);

  // Reset door zoom / cat visibility after View Transitions or bfcache restore
  useEffect(() => {
    const handleRestore = () => {
      if (window.location.pathname !== '/') return;
      setOpeningDoor(null);
      setOrigin({ x: 50, y: 50 });
      setSceneKey((k) => k + 1);
    };

    document.addEventListener('astro:page-load', handleRestore);
    document.addEventListener('astro:after-swap', handleRestore);
    window.addEventListener('pageshow', handleRestore);
    return () => {
      document.removeEventListener('astro:page-load', handleRestore);
      document.removeEventListener('astro:after-swap', handleRestore);
      window.removeEventListener('pageshow', handleRestore);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);
    svgRef.current.innerHTML = '';

    const lineOpts = { roughness: 2, bowing: 1.5, stroke: '#2A2A2A', strokeWidth: 2.5 };
    const faintOpts = { ...lineOpts, stroke: '#3A3A3A', strokeWidth: 1.5, roughness: 1.8 };

    const drawLine = (from: Point, to: Point, opts = lineOpts) => {
      svgRef.current!.appendChild(rc.line(from[0], from[1], to[0], to[1], opts));
    };

    // Ambient space: floor extending back from the first step
    const floorFront: Point = [20, 500];
    const floorBack = withDepth(floorFront);
    drawLine([50, 500], floorFront, faintOpts);
    drawLine(floorFront, floorBack, faintOpts);
    drawLine(floorBack, withDepth([50, 500]), faintOpts);

    // Draw steps back-to-front so nearer treads overlap farther ones
    [...STEPS].reverse().forEach((step) => {
      const frontLeft: Point = [step.x1, step.y];
      const frontRight: Point = [step.x2, step.y];
      const backLeft = withDepth(frontLeft);
      const backRight = withDepth(frontRight);

      if (step.riserTop === null) {
        drawLine(frontLeft, frontRight);
        drawLine(frontLeft, backLeft);
        return;
      }

      // Tread surfaces
      drawLine(backLeft, backRight);
      drawLine(frontLeft, backLeft);
      drawLine(frontRight, backRight);
      drawLine(frontLeft, frontRight);

      // Stair nosing lip
      if (step.x1 > 50) {
        drawLine(frontLeft, [frontLeft[0], frontLeft[1] + 6], lineOpts);
      }

      if (step.riserTop !== null) {
        const riserTop: Point = [step.x2, step.riserTop];
        const riserTopBack = withDepth(riserTop);

        // Riser front face
        drawLine(frontRight, riserTop);
        // Riser side depth
        drawLine(backRight, riserTopBack);
        drawLine(riserTop, riserTopBack);
      }
    });
  }, []);

  const handleDoorClick = (href: string, x: number, y: number, w: number, h: number) => {
    if (openingDoor) return;
    
    setOrigin({
      x: ((x + w / 2) / 900) * 100,
      y: ((y + h / 2) / 600) * 100
    });
    setOpeningDoor(href);

    setTimeout(() => {
      void navigate(href);
    }, 750);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[3/2] mt-12 md:mt-24">
      <motion.div
        key={sceneKey}
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={openingDoor ? { scale: 5, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      >
        <svg ref={svgRef} viewBox="0 0 900 600" className="w-full h-full drop-shadow-sm" />

        <Door
          x={110}
          y={350}
          width={100}
          height={150}
          label="Blog"
          href="/blog"
          rotationDeg={-5}
          onClick={handleDoorClick}
          isOpening={openingDoor === '/blog'}
        />
        <Door
          x={310}
          y={230}
          width={100}
          height={150}
          label="Research"
          href="/research"
          rotationDeg={3}
          onClick={handleDoorClick}
          isOpening={openingDoor === '/research'}
        />
        <Door
          x={510}
          y={110}
          width={100}
          height={150}
          label="About"
          href="/about"
          rotationDeg={-2}
          onClick={handleDoorClick}
          isOpening={openingDoor === '/about'}
        />

        <motion.div
          className="absolute top-10 left-10 md:left-20 font-[Caveat] text-4xl text-ink-muted opacity-60 transform -rotate-2"
          initial={false}
          animate={openingDoor ? { opacity: 0 } : { opacity: 0.6 }}
        >
          Step into the void...
        </motion.div>
      </motion.div>

      <HandDrawnSleepingCat key={sceneKey} isHidden={!!openingDoor} />
    </div>
  );
}
