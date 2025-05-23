"use client";

import Lottie from "lottie-react";
import rocketAnimation from "@/public/lottie/Animation - 1748023657672.json";

export function RocketAnimation() {
  return (
    <div className="relative w-58 h-58">
      <Lottie
        animationData={rocketAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
}
