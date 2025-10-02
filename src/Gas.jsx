import { useState } from "react";
export const Gas = ({ speed }) => {
  {

    const lineCount = 55;
    const size = 300;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    const startAngle = -120;
    const endAngle = -60;
    const angleRange = endAngle - startAngle;

    const polarToCartesian = (angle) => {
      const rad = (angle * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
      };
    };

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);

    const topStart = polarToCartesian(-70);
    const topEnd = polarToCartesian(-60);

    const backgroundPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
  `;

  const topPath = `
    M ${topStart.x} ${topStart.y}
    A ${radius} ${radius} 0 0 1 ${topEnd.x} ${topEnd.y}
    `

    const valueAngle = startAngle + (angleRange * speed) / 80;
    const valueEnd = polarToCartesian(valueAngle);

    const valuePath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 1 ${valueEnd.x} ${valueEnd.y}
  `;



    return (
      <svg
        width={size}
        height={size * 0.7}
        viewBox={`0 0 ${size} ${size * 0.7}`}
        style={{ transform: `rotate(90deg) rotateY(180deg)`, }}
      >
        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke="#5771f699"
          strokeWidth={strokeWidth}
        //   strokeLinecap="round"
        />



        <path
          d={valuePath}
          fill="none"
          stroke="#ffffffc0"
          strokeWidth={strokeWidth}
        //   strokeLinecap="round"
        />
        <path
          d={topPath}
          fill="none"
          stroke="#fe3535ff"
          strokeWidth={strokeWidth}
        //   strokeLinecap="round"
        />

    
        {Array.from({ length: lineCount }).map((_, i) => {
          const angle = startAngle + (angleRange * i) / (lineCount - 1);
          const outerRadius = radius + strokeWidth / 2;
          const innerRadius = radius - strokeWidth / 2 - 6;
          const outerPoint = {
            x: cx + outerRadius * Math.cos((angle * Math.PI) / 180),
            y: cy + outerRadius * Math.sin((angle * Math.PI) / 180),
          };
          const innerPoint = {
            x: cx + innerRadius * Math.cos((angle * Math.PI) / 180),
            y: cy + innerRadius * Math.sin((angle * Math.PI) / 180),
          };

          return (
            <line
              key={i}
              x1={innerPoint.x}
              y1={innerPoint.y}
              x2={outerPoint.x}
              y2={outerPoint.y}
              stroke="#47474764"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  }
};
