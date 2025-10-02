import { Lasers } from "./Lasers";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { BackSide, ShaderMaterial, Color, Vector3, Euler, Quaternion } from "three";
import { eventBus } from "./EventBus";
import { Particles } from "./Particles";
import { Flare } from "./Flare";

export function Model(props) {
  const { nodes, materials } = useGLTF("./x-wing.glb");
  const meshRef = useRef();
  const groupRefs = [...Array(4)].map(() => useRef());

  const positions = [
    [-1.4, 0.45, 2.5],
    [1.4, 0.45, 2.5],
    [1.4, -0.6, 2.5],
    [-1.4, -0.6, 2.5],
    // [9, 3, 4.9],
    // [9, 9.2, 4.9],
    // [-9, 3, 4.9],
  ];

  const fireDelay = 0.1;

  const canon = useRef(0);
  const lastShotTime = useRef(0);
  const fire = () => {
    if (lastShotTime.current < fireDelay) return;
    lastShotTime.current = 0;
    eventBus.emit("laser-fire", {
      ref: groupRefs[canon.current],
      direction: groupRefs[canon.current].current
        .getWorldDirection(new Vector3())
        .clone()
        .normalize(),
    });

    canon.current = (canon.current + 1) % 4;
  };

  const convergenceDistance = 60; // D

  const setupConvergeRotations = () => {
    const target = new Vector3(0, 0, convergenceDistance);

    positions.forEach((posArr, i) => {
      const pos = new Vector3(...posArr);
      const dir = target.clone().sub(pos);


      let pitch = Math.atan2(dir.y, dir.z);

     
      const yaw = Math.atan2(dir.x, dir.z);

      const e = new Euler(-pitch, yaw, 0, "YXZ");
      const q = new Quaternion().setFromEuler(e);

      const g = groupRefs[i].current;
      if (g) {
        g.quaternion.copy(q);
      }
    });
  };


  useEffect(() => {

    setupConvergeRotations();
  }, []);
  const [, get] = useKeyboardControls();
  useFrame((_, delta) => {
    const { firing } = get();
    if (firing) {
      fire();
    }
    lastShotTime.current += delta;
  });

  return (
    <>
      <group {...props} dispose={null}>
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          geometry={nodes.polySurface149_lambert1_0.geometry}
          material={materials.lambert1}
          scale={0.015}
        ></mesh>
        {positions.map((pos, i) => (
          <>
            <group key={i} ref={groupRefs[i]} position={pos} />
          </>
        ))}
        {/* <Flare /> */}
        <Particles />
      </group>
    </>
  );
}

useGLTF.preload("./x-wing.glb");
