import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

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
      fill: '#FAFAFA', 
      fillStyle: 'solid', 
      hachureAngle: 60, 
      hachureGap: 5 
    };
    // Draw the door slightly inset so the rough strokes aren't clipped by the viewBox
    svgRef.current.appendChild(rc.rectangle(2, 2, width - 4, height - 4, options));
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

  // Handle restoring state when navigating back via View Transitions or bfcache
  useEffect(() => {
    const handleRestore = () => {
      setOpeningDoor(null);
    };
    window.addEventListener('pageshow', handleRestore);
    document.addEventListener('astro:page-load', handleRestore);
    return () => {
      window.removeEventListener('pageshow', handleRestore);
      document.removeEventListener('astro:page-load', handleRestore);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);
    svgRef.current.innerHTML = '';

    const options = { roughness: 2, bowing: 1.5, stroke: '#2A2A2A', strokeWidth: 2.5 };
    
    // Draw stairs
    svgRef.current.appendChild(rc.line(50, 500, 250, 500, options));
    svgRef.current.appendChild(rc.line(250, 500, 250, 380, options));
    
    svgRef.current.appendChild(rc.line(250, 380, 450, 380, options));
    svgRef.current.appendChild(rc.line(450, 380, 450, 260, options));
    
    svgRef.current.appendChild(rc.line(450, 260, 650, 260, options));
    svgRef.current.appendChild(rc.line(650, 260, 650, 140, options));
    
    svgRef.current.appendChild(rc.line(650, 140, 850, 140, options));
  }, []);

  const handleDoorClick = (href: string, x: number, y: number, w: number, h: number) => {
    if (openingDoor) return;
    
    setOrigin({
      x: ((x + w / 2) / 900) * 100,
      y: ((y + h / 2) / 600) * 100
    });
    setOpeningDoor(href);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = href;
      document.body.appendChild(link);
      link.click();
    }, 750);
  };

  return (
    <motion.div 
      className="relative w-full max-w-5xl mx-auto aspect-[3/2] flex items-center justify-center mt-12 md:mt-24"
      initial={false}
      animate={openingDoor ? { scale: 5, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        transformOrigin: `${origin.x}% ${origin.y}%`
      }}
    >
      <svg ref={svgRef} viewBox="0 0 900 600" className="w-full h-full drop-shadow-sm" />
      
      <Door 
        x={110} y={350} width={100} height={150} 
        label="Blog" href="/blog" rotationDeg={-5}
        onClick={handleDoorClick} isOpening={openingDoor === "/blog"} 
      />
      <Door 
        x={310} y={230} width={100} height={150} 
        label="Research" href="/research" rotationDeg={3}
        onClick={handleDoorClick} isOpening={openingDoor === "/research"} 
      />
      <Door 
        x={510} y={110} width={100} height={150} 
        label="About" href="/about" rotationDeg={-2}
        onClick={handleDoorClick} isOpening={openingDoor === "/about"} 
      />
      
      <motion.div 
        className="absolute top-10 left-10 md:left-20 font-[Caveat] text-4xl text-ink-muted opacity-60 transform -rotate-2"
        initial={false}
        animate={openingDoor ? { opacity: 0 } : { opacity: 0.6 }}
      >
        Step into the void...
      </motion.div>
    </motion.div>
  );
}
