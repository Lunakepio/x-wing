import { useRef } from "react";
import { RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";

export const Particles = () => {
  const emitterRef = useRef(null);

  return (
    <>
      <VFXParticles
        name="galaxy"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [1, 0],
          intensity: 1,
          nbParticles: 100000,
          renderMode: RenderMode.StretchBillboard,
          stretchScale: 8,
          gravity: [0,0,0],
          frustumCulled: false,
          easeFunction: "easeOutPower3",
        }}
      />
      <VFXEmitter
        ref={emitterRef}
        emitter="galaxy"
        localDirection={true}
        settings={{
          duration: 1,
          delay: 0,
          nbParticles: 1000,
          spawnMode: "time",
          loop: true,
          startPositionMin: [-50, -50, -50],
          startPositionMax: [50, 50, 50],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [1,  7],
          speed: [1, 7],
          colorStart: ["#ffffff"],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, -1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          size: [0.01, 0.2],
        }}
      />
    </>
  );
};
