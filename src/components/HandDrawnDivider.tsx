import { useEffect, useRef } from 'react';
import rough from 'roughjs';

export default function HandDrawnDivider() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);
    svgRef.current.innerHTML = '';
    
    // Draw a slightly wavy line
    svgRef.current.appendChild(
      rc.line(10, 10, 290, 10, {
        roughness: 2.5,
        bowing: 2,
        stroke: '#2A2A2A',
        strokeWidth: 1.5
      })
    );
  }, []);

  return (
    <div className="w-full flex justify-center my-12">
      <svg ref={svgRef} viewBox="0 0 300 20" className="w-64 h-6 opacity-70" />
    </div>
  );
}
