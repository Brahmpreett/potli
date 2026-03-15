import React, { useMemo } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

const COIN_COUNT = 14;

export const CoinBackground = () => {
  const { x, y } = useMousePosition();

  // Generate background coins data once
  const coins = useMemo(() => {
    return Array.from({ length: COIN_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage for positioning natively
      top: Math.random() * 100,
      size: 16 + Math.random() * 16, // 16px to 32px
      opacity: 0.06 + Math.random() * 0.04, // 0.06 to 0.10
      parallaxMultiplier: 0.01 + Math.random() * 0.03, // 0.01 to 0.04 (closer = more movement)
      animationDuration: 6 + Math.random() * 6, // 6s to 12s
      animationDelay: Math.random() * -10, // negative delay to start spread out
    }));
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  // Render nothing on mobile/touch interfaces to save hardware juice
  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      
      {/* Dynamic Radial Golden Spotlight following the mouse cursor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(280px circle at ${x}px ${y}px, rgba(245, 166, 35, 0.12), transparent)`,
        }}
      />
      
      {/* Array of floating CSS Parallax Coins */}
      {coins.map((coin) => {
        // Calculate offset driven by the global smoothed mouse coords
        const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
        const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 500;
        const offsetX = (x - centerX) * coin.parallaxMultiplier;
        const offsetY = (y - centerY) * coin.parallaxMultiplier;

        return (
          <div
            key={coin.id}
            className="absolute flex items-center justify-center rounded-full font-bold text-[#F5A623] animate-coin-drift"
            style={{
              left: `${coin.left}%`,
              top: `${coin.top}%`,
              width: `${coin.size}px`,
              height: `${coin.size}px`,
              opacity: coin.opacity,
              fontSize: `${coin.size * 0.55}px`, // Icon scales relative to the randomized coin container size
              border: `1.5px solid rgba(245, 166, 35, ${coin.opacity + 0.2})`, // Soft outer coin physical rim
              backgroundColor: `rgba(245, 166, 35, ${coin.opacity - 0.02})`, // Soft filled physical body
              boxShadow: `inset 0 0 4px rgba(245, 166, 35, ${coin.opacity + 0.1})`, // Inner physical reflection
              transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
              animationDuration: `${coin.animationDuration}s`,
              animationDelay: `${coin.animationDelay}s`,
            }}
          >
            ₹
          </div>
        );
      })}
    </div>
  );
};
