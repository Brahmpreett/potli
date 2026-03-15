import { useState, useEffect, useRef } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Ref to hold the target position (raw mouse coordinates)
  const targetPosition = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  
  // Ref to hold the current smoothed position
  const currentPosition = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  
  const requestRef = useRef<number>();
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  // To handle every 2nd frame for coins if needed, though lerping all frames is smoother. We'll lerp all frames for `x` `y`, but components can throttle.

  const updatePosition = () => {
    if (!isScrolling.current) {
      // Lerp logic - factor 0.08
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.08;
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.08;
      
      // Update state with smoothed position
      setPosition({
        x: currentPosition.current.x,
        y: currentPosition.current.y
      });
    }
    
    // Continue loop
    requestRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only enable if device supports hover
    const mediaQuery = window.matchMedia('(hover: none)');
    if (mediaQuery.matches) return;

    // Initial center setup
    targetPosition.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentPosition.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      isScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        // Optionally update target to match a sudden scroll jump if we wanted to
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return position;
};
