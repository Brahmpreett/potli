import { Home, TrendingUp, ShoppingBag, AlertCircle, Heart, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PotliCardProps {
  name: string;
  color: string;
  percentage: number;
  balance: number;
  icon: string;
  onClick: () => void;
}

const iconMap: Record<string, any> = {
  Home,
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  Heart,
  Gift,
};

const colorMap: Record<string, string> = {
  "royal-blue": "hsl(var(--royal-blue))",
  "emerald": "hsl(var(--emerald))",
  "turmeric": "hsl(var(--turmeric))",
  "maroon": "hsl(var(--maroon))",
  "coral": "hsl(var(--coral))",
  "saffron": "hsl(var(--saffron))",
};

const PotliCard = ({ name, color, percentage, balance, icon, onClick }: PotliCardProps) => {
  const IconComponent = iconMap[icon] || Home;
  const bgColor = colorMap[color] || "hsl(var(--primary))";

  return (
    <Card
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg p-6 texture-fabric"
      style={{
        background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
        color: "#000000",
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <IconComponent className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-sm opacity-90">
            {percentage}% of income
          </div>
          <div className="font-handwriting text-4xl font-bold">
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