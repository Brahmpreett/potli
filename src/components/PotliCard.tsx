import React, { useRef, useState } from "react";
import { NeedsIcon } from "./icons/NeedsIcon";
import { InvestIcon } from "./icons/InvestIcon";
import { WantsIcon } from "./icons/WantsIcon";
import { EmergencyIcon } from "./icons/EmergencyIcon";
import { ParentsIcon } from "./icons/ParentsIcon";
import { DonationsIcon } from "./icons/DonationsIcon";
import { Card } from "@/components/ui/card";

interface PotliCardProps {
  name: string;
  color: string;
  percentage: number;
  balance: number;
  icon: string;
  onClick: () => void;
  isHovered?: boolean;
}

const iconMap: Record<string, any> = {
  Home: NeedsIcon,
  TrendingUp: InvestIcon,
  ShoppingBag: WantsIcon,
  AlertCircle: EmergencyIcon,
  Heart: ParentsIcon,
  Gift: DonationsIcon,
};

const colorMap: Record<string, string> = {
  "royal-blue": "hsl(var(--royal-blue))",
  "emerald": "hsl(var(--emerald))",
  "turmeric": "hsl(var(--turmeric))",
  "maroon": "hsl(var(--maroon))",
  "coral": "hsl(var(--coral))",
  "saffron": "hsl(var(--saffron))",
};

const PotliCard = ({ name, color, percentage, balance, icon, onClick, isHovered }: PotliCardProps) => {
  const IconComponent = iconMap[icon] || NeedsIcon;
  const bgColor = colorMap[color] || "hsl(var(--primary))";

  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isMouseOver, setIsMouseOver] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    const mediaQuery = window.matchMedia('(hover: none)');
    if (!mediaQuery.matches) {
      setIsMouseOver(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  // Base classes that are always present
  const baseClasses = "relative overflow-hidden cursor-pointer transition-all duration-300 transform border-l-4 border-l-[#F5A623] shadow-md p-6 texture-fabric active:scale-[0.97] transition-transform duration-150";
  
  // Hover effect classes applied either by real hover, OR by the explicit `isHovered` prop
  const hoverClasses = isHovered 
    ? "-translate-y-1 shadow-[0_8px_30px_rgba(245,166,35,0.2)] border-[#F5A623]/50" 
    : "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(245,166,35,0.2)] hover:border-[#F5A623]/50";

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses}`}
      style={{
        background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
      }}
    >
      {/* Interactive Spotlight Hover Effect Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          opacity: isMouseOver ? 1 : 0,
          background: `radial-gradient(120px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(245, 166, 35, 0.08), transparent 100%)`,
        }}
      />

      {/* Subtle Coin Scatter Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 25a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-3-8h6m-3-3v6' stroke='%23000' fill='none' fill-rule='evenodd' opacity='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <IconComponent className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-block bg-[#F5A623]/20 text-[#a36700] dark:text-[#F5A623] px-2.5 py-0.5 rounded-full text-xs font-bold font-sans">
            {percentage}% of income
          </div>
          <div className="font-handwriting text-4xl font-bold mt-2 pt-1 border-t border-foreground/5">
            ₹{balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Decorative tassel */}
      <img 
        src="/favicon.png"
        alt="Tassel"
        className="absolute bottom-6 right-6 w-8 h-auto opacity-80"
      />
    </Card>
  );
};

export default PotliCard;