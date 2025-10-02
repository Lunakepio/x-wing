import { extend, useFrame } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { useEffect, useRef } from "react";
import {
  IcosahedronGeometry,
  MeshPhongMaterial,
  Quaternion,
  Vector3,
} from "three";
import { eventBus } from "./EventBus";

extend({ InstancedMesh2 });

export const Lasers = () => {
  const instanceRef = useRef(null);
  const geometry = new IcosahedronGeometry(0.01, 1);
  const material = new MeshPhongMaterial({
    emissive: 0xff036c,
    emissiveIntensity: 80,
  });

  const speed = 150;

  // subscribe to external fire events
  useEffect(() => {
    const handleFire = ({ref, direction}) => {
      if (!instanceRef.current) return;

      instanceRef.current.addInstances(1, (obj) => {
        let pos = new Vector3();
        let quat = new Quaternion();

        if (ref?.current) {
          ref.current.getWorldPosition(pos);
          ref.current.getWorldQuaternion(quat);
        }

        obj.position.copy(pos);
        obj.direction = direction;
        obj.quaternion.copy(quat);
        obj.lifetime = 0;
        obj.scale.z = 240;

        eventBus.emit("laser-shot", pos.clone());
      });
    };

    eventBus.on("laser-fire", handleFire);
    return () => {
      eventBus.off("laser-fire", handleFire);
    };
  }, []);

  // update movement + lifetime
  useFrame((_, delta) => {
    if (!instanceRef.current) return;

    instanceRef.current.updateInstances((obj) => {
      obj.position.addScaledVector(obj.direction, speed * delta);
      obj.lifetime += delta;

      if (obj.lifetime > 2) {
        eventBus.emit("explosion", obj.position);
        obj.remove();
      }
    });
  });

  return (
    <instancedMesh2
      ref={instanceRef}
      args={[geometry, material, { createEntities: true }]}
      frustumCulled={false}
    />
  );
};