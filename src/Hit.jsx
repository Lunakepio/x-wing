import { useEffect, useRef } from "react";
import { RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";
import { eventBus } from "./EventBus";

export const Hit = () => {
  const emitterRef = useRef(null);

  useEffect(() => {
    eventBus.on("laser-hit", (pos) => {
      emitterRef.current.emitAtPos(pos);
    });
  })

  return (
    <>
      <VFXParticles
        name="hit"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [1, 0],
          intensity: 3,
          nbParticles: 100000,
          renderMode: RenderMode.StretchBillboard,
          stretchScale: 2,
          gravity: [0, 0, 0],
          frustumCulled: false,
          easeFunction: "easeOutPower4",
        }}
      />
      <VFXEmitter
        ref={emitterRef}
        emitter="hit"
        autoStart={false}
        settings={{
          duration: 1,
          delay: 0,
          nbParticles: 25,
          spawnMode: "burst",
          loop: true,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [0.5, 1],
          speed: [2, 5],
          colorStart: ["#ffc250"],
          directionMin: [-0.3, -0.3, -1],
          directionMax: [0.3, 0.3, -1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          size: [0.01, 0.2],
        }}
      />
    </>
  );
};
