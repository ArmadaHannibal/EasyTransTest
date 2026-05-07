import React from "react";

type PathAnimationProps = {
  title: string;
  className?: string;
  fontSize?: string;
};

const PathAnimation = ({ title, className, fontSize }: PathAnimationProps) => {
  return (
    <div className="flex justify-start items-start">
      <svg
        width="1000"
        height="175"
        viewBox="0 0 800 160"
        className={`absolute ${className} max-w-full`}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke="url(#pathGradient)"
          strokeWidth="2"
          // fontSize="88"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className={`text-4xl md:text-6xl opacity-20`}
        >
          {title}
          <animate
            attributeName="stroke-dashoffset"
            values="1000;0"
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

export default PathAnimation;
