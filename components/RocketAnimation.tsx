"use client";

import { useEffect, useState } from "react";

interface Star {
  left: string;
  top: string;
  animationDelay: string;
}

export function RocketAnimation() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 5 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="relative w-32 h-32">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Rocket Body */}
        <path
          d="M12 2L8 6V14L12 18L16 14V6L12 2Z"
          className="fill-primary"
        />
        {/* Rocket Window */}
        <circle
          cx="12"
          cy="10"
          r="2"
          className="fill-background"
        />
        {/* Rocket Fins */}
        <path
          d="M8 14L4 18V14L8 14Z M16 14L20 18V14L16 14Z"
          className="fill-primary"
        />
        {/* Animated Flame */}
        <path
          d="M10 18L12 22L14 18"
          className="fill-orange-500 animate-pulse"
          style={{ transformOrigin: "50% 0%" }}
        />
      </svg>

      {/* Animated Stars - rendered only on client */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
