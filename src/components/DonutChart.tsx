import React, { useMemo } from 'react';
import { NeedsIcon } from './icons/NeedsIcon';

interface Potli {
  id: string;
  name: string;
  color: string;
  percentage: number;
  balance: number;
  icon: string;
}

interface DonutChartProps {
  potlis: Potli[];
  totalBalance: number;
  hoveredPotliId: string | null;
  onHover: (id: string | null) => void;
}

const colorValueMap: Record<string, string> = {
  "royal-blue": "hsl(var(--royal-blue))",
  "emerald": "hsl(var(--emerald))",
  "turmeric": "hsl(var(--turmeric))",
  "maroon": "hsl(var(--maroon))",
  "coral": "hsl(var(--coral))",
  "saffron": "hsl(var(--saffron))",
};

export const DonutChart: React.FC<DonutChartProps> = ({ potlis, totalBalance, hoveredPotliId, onHover }) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHoveringDonutContainer, setIsHoveringDonutContainer] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const LAYERS = 15;
  const RADIUS = 80;
  const STROKE_WIDTH = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Calculate slice data independently
  const slices = useMemo(() => {
    let currentOffset = 0;
    return potlis.map((potli) => {
      // Calculate arc length
      const strokeDasharray = `${(potli.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
      const strokeDashoffset = -currentOffset;
      
      // Calculate middle angle for extrusion effect
      const startAngle = (currentOffset / CIRCUMFERENCE) * 360;
      const arcAngle = (potli.percentage / 100) * 360;
      const middleAngle = startAngle + (arcAngle / 2);
      // We no longer need X/Y extrusion, but we keep the math structure simple.
      
      currentOffset += (potli.percentage / 100) * CIRCUMFERENCE;

      return {
        ...potli,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [potlis, CIRCUMFERENCE]);

  // Generate the 3D stacking layers grouped by slice
  const renderSlices = () => {
    return slices.map((slice) => {
      const isHovered = hoveredPotliId === slice.id;
      // Extract the entire block upward on the local Z axis
      const hoverZ = isHovered ? 14 : 0; 
      
      return (
        <div 
          key={`slice-group-${slice.id}`}
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `translateZ(${hoverZ}px)` 
          }}
        >
          {Array.from({ length: LAYERS }).map((_, i) => {
            const isTopLayer = i === LAYERS - 1;
            return (
              <svg
                key={`layer-${i}-${slice.id}`}
                viewBox="0 0 240 240"
                className="absolute inset-0 w-full h-full drop-shadow-sm pointer-events-none"
                style={{ 
                  transform: `translateZ(${i}px) rotate(-90deg)`,
                  // Enable pointer events ONLY on the top visible face layer
                  pointerEvents: isTopLayer ? 'auto' : 'none' 
                }}
              >
                <circle
                  cx="120"
                  cy="120"
                  r={RADIUS}
                  fill="none"
                  stroke={colorValueMap[slice.color] || "hsl(var(--turmeric))"}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="outline-none"
                  style={{
                    cursor: isTopLayer ? 'pointer' : 'default',
                    opacity: slice.percentage > 0 ? 1 : 0,
                    filter: isTopLayer ? 'none' : 'brightness(var(--donut-side-darken))',
                  }}
                  onMouseEnter={() => { if(isTopLayer) onHover(slice.id) }}
                  onMouseLeave={() => { if(isTopLayer) onHover(null) }}
                />
              </svg>
            );
          })}
        </div>
      );
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Max 8 degrees tilt, clamp roughly bounding the box dimensions
    const maxTilt = 8;
    const tiltX = Math.max(-maxTilt, Math.min(maxTilt, ((e.clientY - centerY) / (rect.height / 2)) * -maxTilt));
    const tiltY = Math.max(-maxTilt, Math.min(maxTilt, ((e.clientX - centerX) / (rect.width / 2)) * maxTilt));
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHoveringDonutContainer(false);
    setTilt({ x: 0, y: 0 }); // Reset tilt to flat
  };

  const handleMouseEnter = () => {
    const mediaQuery = window.matchMedia('(hover: none)');
    if (!mediaQuery.matches) {
      setIsHoveringDonutContainer(true);
    }
  };

  return (
    <div 
      className="relative w-full max-w-[400px] mx-auto h-[420px] pt-8 flex items-center justify-center flex-col animate-donut-intro mb-4 overflow-visible"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      
      {/* Container orchestrating the 3D projection and floating animation */}
      <div 
        className="relative w-[240px] h-[240px] animate-donut-float"
        style={{ 
          transformStyle: 'preserve-3d',
          animationPlayState: hoveredPotliId ? 'paused' : 'running'
        }}
      >
        {/* Dynamic tracking tilt inner wrapper */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isHoveringDonutContainer ? 'transform 150ms ease-out' : 'transform 400ms ease'
          }}
        >
          {renderSlices()}
        </div>
      </div>


      {/* Absolutely positioned static text below the donut (Static, does not rotate or bounce) */}
      <div className="mt-8 mb-4 flex flex-col items-center justify-center pointer-events-none z-10">
        <p className="text-[13px] text-muted-foreground font-bold uppercase tracking-[0.08em] mb-1">Liquid Money</p>
        <p className="text-[22px] font-bold text-[#F5A623]">
          ₹{totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* Floating Under-Shadow */}
      <div className="absolute bottom-[80px] w-[180px] h-[14px] rounded-[100%] bg-black/15 blur-[12px] animate-donut-shadow pointer-events-none" 
           style={{ boxShadow: 'var(--shadow-donut)' }} />

      {/* Tooltip implementation for active slice */}
      {hoveredPotliId && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[100] bg-white text-center px-4 py-2 rounded-xl border border-[#F5A623]/30 shadow-lg pointer-events-none animate-in fade-in zoom-in duration-200">
          <p className="font-bold text-[#8B5A00]">
            {potlis.find(p => p.id === hoveredPotliId)?.name}
          </p>
          <p className="text-sm font-semibold opacity-80">
            {potlis.find(p => p.id === hoveredPotliId)?.percentage}% <span className="mx-1">•</span> 
            ₹{potlis.find(p => p.id === hoveredPotliId)?.balance.toFixed(2)}
          </p>
        </div>
      )}

    </div>
  );
};
