export const WantsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    className={className}
    fill="none"
  >
    {/* Base Potli Shape */}
    <path
      d="M10 20C8 28 12 34 20 34C28 34 32 28 30 20C28 12 24 10 20 10C16 10 12 12 10 20Z"
      fill="#F5A623"
      stroke="#8B5A00"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Potli Tie/Knot */}
    <path
      d="M16 12C16 12 14 8 12 6M24 12C24 12 26 8 28 6M16 12L24 12"
      stroke="#8B5A00"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Sparkle/Star Shape */}
    <path
      d="M20 16L21.5 19.5L25 21L21.5 22.5L20 26L18.5 22.5L15 21L18.5 19.5Z"
      fill="#FFE066"
      stroke="#8B5A00"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Subtle ₹ symbol */}
    <text
      x="20"
      y="32"
      fontFamily="sans-serif"
      fontSize="7"
      fontWeight="bold"
      fill="#8B5A00"
      textAnchor="middle"
      opacity="0.7"
    >
      ₹
    </text>
  </svg>
);
