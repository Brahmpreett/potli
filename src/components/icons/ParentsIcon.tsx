export const ParentsIcon = ({ className }: { className?: string }) => (
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

    {/* Heart Shape */}
    <path
      d="M20 25C20 25 15 21 15 18C15 16.5 16 15 17.5 15C19 15 20 16.5 20 16.5C20 16.5 21 15 22.5 15C24 15 25 16.5 25 18C25 21 20 25 20 25Z"
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
