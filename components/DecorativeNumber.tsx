import React from "react";

type DecorativeNumberProps = {
  number: string;
  className?: string;
};

const DecorativeNumber = ({ number, className }: DecorativeNumberProps) => {
  return (
    <div
      className={`absolute top-10 right-10 hidden lg:block select-none pointer-events-none ${className}`}
      style={{ width: "22rem", height: "18rem" }}
    >
      {/* Texte fantôme de base (quasi invisible) */}
      {/* <span
        className="absolute inset-0 flex items-center justify-center text-[11rem] font-black leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {number}
      </span> */}

      {/* Animation SVG par-dessus */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 350 280"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="numGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D3D3D3" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
        </defs>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke="url(#numGradient)"
          strokeWidth="1.5"
          fontSize="180"
          fontWeight="900"
          fontFamily="'DM Sans', Arial, sans-serif"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          opacity="0.2"
        >
          {number}
          <animate
            attributeName="stroke-dashoffset"
            values="2000;0"
            dur="8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.25 0.1 0.25 1"
          />
        </text>
      </svg>
    </div>
  );
};

export default DecorativeNumber;
