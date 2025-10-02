import { useEffect, useRef, useState } from "react";
import { Model } from "./X-wing";
import { useFrame } from "@react-three/fiber";
import { Vector3, Matrix4, Quaternion as TQuaternion } from "three";
import { damp, lerp } from "three/src/math/MathUtils.js";
import {
  Html,
  PerspectiveCamera,
  useKeyboardControls,
} from "@react-three/drei";
import { useStore } from "./useStore";
import { Crosshair } from "./Crosshair";
import { Gas } from "./Gas";
import { Health } from "./Health";
import gsap from "gsap";

export const PlayerController = () => {
  const playerRef = useRef();
  const cameraPositionRef = useRef();
  const cameraLookAtRef = useRef();
  const modelRef = useRef();
  const cameraRef = useRef();

  const cursorSpeedRef = useRef(0);
  const lastInputRef = useRef({ x: 0, y: 0 });
  const inputRef = useRef({ x: 0, y: 0 });
  const overshootRef = useRef(0);
  const q = new TQuaternion();
  const v = new Vector3();

  const [speedGas, setSpeed] = useState(50);
  const [health, setHealth] = useState(100);

  const [, get] = useKeyboardControls();

  const maxRotationSpeed = 2;
  const rotationSpeed = useRef(0);
  const speed = useRef(50);

  const animationSpeed = 5;
  const maxSpeed = 80;
  const minSpeed = 30;

  const isAnimating = useRef(false);
  const setPlayerPosition = useStore((state) => state.setPlayerPosition);

  const getInput = (pointer, delta) => {

      inputRef.current.x = pointer.x;
      inputRef.current.y = pointer.y;

  };
  const getPointerSpeed = (pointer, delta) => {
    const dx = inputRef.current.x - lastInputRef.current.x;
    const dy = inputRef.current.y - lastInputRef.current.y;

    cursorSpeedRef.current = Math.sqrt(dx * dx + dy * dy) / delta;

    overshootRef.current = damp(overshootRef.current, dx * 4, 3, delta);

    lastInputRef.current.x = inputRef.current.x;
    lastInputRef.current.y = inputRef.current.y;
  };

  const cameraShake = (delta, time) => {
    if (!cameraRef.current) return;

    const intensity = (speed.current - minSpeed) / (maxSpeed - minSpeed);
    const shakeStrength = intensity * 0.06;

    const offsetX =
      (Math.sin(time * 13.7) + Math.cos(time * 7.3)) * 0.5 * shakeStrength;
    const offsetY =
      (Math.sin(time * 17.1) + Math.cos(time * 11.5)) * 0.5 * shakeStrength;

    //   cameraPositionRef.current.position.x = lerp(cameraPositionRef.current.position.x, offsetX, 8 * delta);
    //   cameraPositionRef.current.position.y = lerp(cameraPositionRef.current.position.y, 1.2 + offsetY, 8 * delta);
    //   cameraPositionRef.current.position.z = Math.sin(time * 0.1) * 0.05;
    cameraPositionRef.current.rotation.x = lerp(
      cameraPositionRef.current.rotation.x,
      offsetX,
      8 * delta
    );
    cameraPositionRef.current.rotation.y = lerp(
      cameraPositionRef.current.rotation.y,
      Math.PI + offsetY,
      8 * delta
    );
  };

  const updateCamera = (camera, delta, aiming) => {
    // camera.position.z = lerp(camera.position.z, -5 - speed.current / maxSpeed, 2 * delta);

    camera.fov = lerp(camera.fov, aiming ? 20 : 50, 4 * delta);
    camera.updateProjectionMatrix();
    cameraRef.current.position.lerp(
      cameraPositionRef.current.getWorldPosition(new Vector3()),
      12 * delta
    );
    cameraRef.current.quaternion.slerp(
      cameraPositionRef.current.getWorldQuaternion(new TQuaternion()),
      12 * delta
    );
  };

  const yaw = (pointer, delta, playerRotation) => {
    const { x } = inputRef.current;

    v.set(0, 1, 0);
    v.applyQuaternion(playerRotation);
    q.setFromAxisAngle(v, -x * 0.02);
    playerRotation.premultiply(q);

    // modelRef.current.rotation.z = lerp(modelRef.current.rotation.z, x * 0.02, );
    modelRef.current.rotation.z = damp(
      modelRef.current.rotation.z,
      (x * Math.PI) / 4 +
        rotationSpeed.current * 0.4 +
        overshootRef.current * 2,
      animationSpeed,
      delta
    );
    modelRef.current.position.x = damp(
      modelRef.current.position.x,
      (x + rotationSpeed.current * 0.4 + overshootRef.current * 10) * 2,
      animationSpeed / 2,
      delta
    );
  };

  const pitch = (pointer, delta, playerRotation) => {
    const { y } = inputRef.current;

    v.set(1, 0, 0);
    v.applyQuaternion(playerRotation);
    q.setFromAxisAngle(v, -y * 0.02);
    playerRotation.premultiply(q);

    modelRef.current.position.y = damp(
      modelRef.current.position.y,
      -y * 1,
      animationSpeed,
      delta
    );
  };

  const roll = (left, right, delta, playerRotation) => {
    const input =
      Number(right) - Number(left);

    rotationSpeed.current = damp(
      rotationSpeed.current,
      input * maxRotationSpeed,
      2,
      delta
    );

    v.set(0, 0, 1);
    v.applyQuaternion(playerRotation);
    q.setFromAxisAngle(v, rotationSpeed.current * delta);
    playerRotation.premultiply(q);
  };

  const thrust = (delta) => {
    const direction = playerRef.current
      .getWorldDirection(new Vector3())
      .clone()
      .normalize();

    playerRef.current.position.addScaledVector(
      direction,
      speed.current * delta
    );
  };

  const gasControl = (forward, backward, delta) => {
    const input =
      Number(forward) -
      Number(backward) 
    let targetSpeed = speed.current;

    if (input > 0) {
      targetSpeed = maxSpeed;
    } else if (input < 0) {
      targetSpeed = minSpeed;
    } else if (input === 0 && speed.current > maxSpeed - 20) {
      targetSpeed = maxSpeed - 20;
    }

    speed.current = damp(speed.current, targetSpeed, 0.4, delta);
  };


//   useEffect(() => {
//     window.addEventListener("keydown", (e) => {
//       if(e.code === "Digit1"){
//         isAnimating.current = true;
//         const playerInvertDirection = playerRef.current
//       .getWorldDirection(new Vector3())
//       .clone()
//       .normalize()
//       .negate();

//       playerRef.current.quaternion.slerp(new TQuaternion().setFromAxisAngle(playerInvertDirection, Math.PI), 0.5);
//       }
//   })
// }, []);

  useFrame(({ camera, pointer, clock }, delta) => {
    if (!playerRef.current) return;
    const playerRotation = playerRef.current.quaternion;

    const { forward, backward, left, right, aiming, } = get();
    const time = clock.getElapsedTime();

    if (!isAnimating.current) {
      getInput(pointer, delta);
      getPointerSpeed(pointer, delta);
      updateCamera(camera, delta, aiming);
      cameraShake(delta, time * 7);
      yaw(pointer, delta, playerRotation);
      pitch(pointer, delta, playerRotation);
      roll(left, right, delta, playerRotation);
      thrust(delta);
      gasControl(forward, backward, delta);
    }
    setPlayerPosition(playerRef.current.getWorldPosition(new Vector3()));
    setSpeed(speed.current);
  });
  return (
    <>
      <group ref={playerRef}>
        <group
          ref={cameraPositionRef}
          position={[0, 1.2, -1]}
          rotation={[0, Math.PI, 0]}
        ></group>
        <group ref={modelRef}>
          <Model />
        </group>
        <group ref={cameraLookAtRef} position={[0, 0, 30]}>
          <Html
            transform
            className="hud"
            pointerEvents="none"
            style={{ pointerEvents: "none" }}
            prepend
          >
            <Crosshair />
          </Html>
          <group position={[5, 0, 0]}>
            <Html
              transform
              className="hud"
              pointerEvents="none"
              style={{ pointerEvents: "none" }}
              prepend
            >
              <Gas speed={speedGas} />
            </Html>
          </group>
          <group position={[-5, 0, 0]}>
            <Html
              transform
              className="hud"
              pointerEvents="none"
              style={{ pointerEvents: "none" }}
              prepend
            >
              <Health health={health} />
            </Html>
          </group>
        </group>
      </group>
      <PerspectiveCamera
        ref={cameraRef}
        fov={50}
        makeDefault={true}
        position={[0, 1.2, -5]}
        // rotation={[0, Math.PI, 0]}
      />
    </>
  );
};
