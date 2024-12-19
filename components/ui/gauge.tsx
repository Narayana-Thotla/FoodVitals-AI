"use client";
import React from "react";

const MeterGauge = ({ value }:any) => {
  // Clamp the value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Calculate the rotation angle for the needle
  const needleRotation = (clampedValue / 100) * 180 - 90; // -90° to 90° for correct rotation

  return (
    <div className="relative w-20 h-20">
      {/* SVG Gauge */}
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Arc */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke="#e5e7eb" /* Gray-300 for background */
          strokeWidth="8"
        />
        {/* Dynamic Arc */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gradientColors)"
          strokeWidth="8"
          strokeDasharray={`${(clampedValue / 100) * 126} 126`}
          strokeLinecap="round"
        />
        {/* Gradient Colors */}
        <defs>
          <linearGradient id="gradientColors" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e"  /> {/* Green */}
            <stop offset="50%" stopColor="#facc15" /> {/* Yellow */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
          </linearGradient>
        </defs>
      </svg>

      {/* Needle */}
      <div
        className="absolute w-1 h-7 bg-black origin-bottom transform"
        style={{
          top: "42%", // Move the needle upwards
          left: "50%",
          transformOrigin: "bottom",
          transform: `rotate(${needleRotation}deg) translateX(-50%)`,
        }}
      ></div>
    </div>
  );
};

export default MeterGauge;
