import { extend, useFrame, useThree } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { useEffect, useRef } from "react";
import { IcosahedronGeometry, MeshPhongMaterial, Vector3 } from "three";
import { eventBus } from "./EventBus";
import { AppearanceMode, VFXParticles } from "wawa-vfx";
import { VFXEmitter, RenderMode } from "wawa-vfx";
extend({ InstancedMesh2 });

export const Explosion2 = ({ refs }) => {
  const instanceRef = useRef(null);
  const emitterRef = useRef(null);
  const geometry = new IcosahedronGeometry(0.2, 1);
  const material = new MeshPhongMaterial({
    emissive: 0xffd9b5,
    emissiveIntensity: 20,
  });

  const gravity = -0.05;
  useEffect(() => {
    eventBus.on("explosion", (pos) => {
      instanceRef.current.addInstances(24, (obj) => {
        obj.position.set(pos.x, pos.y, pos.z);
        obj.opacity = 1;
        obj.direction = new Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        );
        obj.speed = Math.random() * 20;
        obj.fadingSpeed = 5 + Math.random() * 3;
        obj.lifetime = 0;
      });
    });
  });
  useFrame((_, delta) => {
    if (!instanceRef.current) return;

    instanceRef.current.updateInstances((obj) => {
      obj.position.addScaledVector(obj.direction, obj.speed * delta);
      obj.direction.y += gravity * delta;
      obj.opacity = 0;
      obj.lifetime += delta;
      obj.scale.lerp(new Vector3(0, 0, 0), delta * obj.fadingSpeed);
      emitterRef.current.emitAtPos(obj.position);
      if (obj.scale.z < 0.001) {
        obj.remove();
      }
    });
  });
  return (
    <>
      <instancedMesh2
        ref={instanceRef}
        args={[geometry, material, { createEntities: true }]}
        frustumCulled={false}
      />
      <VFXParticles
        name="sparks"
        settings={{
          fadeAlpha: [0, 0],
          fadeSize: [0, 0],
          intensity: 1,
          nbParticles: 10000,
          renderMode: RenderMode.Billboard,
          appearance: AppearanceMode.Circular,
          gravity: [0, 0, -2],
          frustumCulled: false,
          easeFunction: "easeOutPower3",
        }}
      />
      <VFXEmitter
        ref={emitterRef}
        emitter="sparks"
        autoStart={false}
        settings={{
          duration: 0.0001,
          delay: 0,
          nbParticles: 1,
          spawnMode: "burst",
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [0.7, 1.5],
          speed: [0, 0],
          colorStart: ["#ffd9b5"],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          size: [0.3, 0.3],
        }}
      />
    </>
  );
};
