import { useRef, useEffect } from "react";
import { eventBus } from "./EventBus";
import gsap from "gsap";

export const Crosshair = () => {
  const armsRef = useRef([]);

  const spread = -10;

  useEffect(() => {
    eventBus.on("laser-fire", () => {
      gsap.to(armsRef.current, {
        duration: 0.1,
        ease: "power1.inOut",
        x: (i) =>
          i === 2 ? spread : i === 3 ? -spread : 0,
        y: (i) =>
          i === 0 ? -spread : i === 1 ? spread : 0,
        onComplete: () => {
            gsap.set(armsRef.current, { x: 0, y: 0 });
        }

      });
    });
  }, []);

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible", scale: 0.3, opacity: 0.7, rotate: "45deg", transform: "translate(-40px, 0)" }}
    >
      <g fill="#fff">
        {/* Top Arm (wide outside, narrow inside) */}
        <polygon
          ref={(el) => (armsRef.current[0] = el)}
          points="45,0 55,0 52,25 48,25"
        />
        {/* Bottom Arm */}
        <polygon
          ref={(el) => (armsRef.current[1] = el)}
          points="48,75 52,75 55,100 45,100"
        />
        {/* Right Arm */}
        <polygon
          ref={(el) => (armsRef.current[2] = el)}
          points="75,48 100,45 100,55 75,52"
        />
        {/* Left Arm */}
        <polygon
          ref={(el) => (armsRef.current[3] = el)}
          points="0,45 25,48 25,52 0,55"
        />
      </g>
      {/* Optional center dot */}
      {/* <circle cx="50" cy="50" r="2" fill="#fff" /> */}
    </svg>
  );
};