import { KeyboardControls, OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Model } from "./X-wing"
import { Lighting } from "./Lighting"
import { Effect } from "./Effect"
import { Particles } from "./Particles"
import { Lasers } from "./Lasers"
import { Light } from "./Light"
import { Flare } from "./Flare"
import { Tie } from "./Tie"
import { Hit } from "./Hit"
import { Explosion } from "./Explosion"
import { ExplosionLight } from "./ExplosionLight"
import { Explosion2 } from "./Explosion2"
import { PlayerController } from "./PlayerController"
import { Destroyer } from "./Star_destroyer"


function App() {

    const controls = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "firing", keys: ["KeyX", "Space"] },
    { name: "aiming", keys: ["Control", "Shift"] },
    { name: "skill1", keys:["Digit1"] },
  ];

  return (
    <>
    <div className="canvas-container">
      <Canvas shadows dpr={[1]}>
        <color attach="background" args={["#050a0e"]} />

        <KeyboardControls map={controls}>
          <PlayerController/>
        </KeyboardControls>
        <Lasers/>
        <Stats/>
        <Tie/>
        <Destroyer/>
        <Explosion/>
        <ExplosionLight/>
        <Explosion2/>
        <Light/>
        {/* <Flare/> */}
        <Lighting/>
        {/* <Particles/> */}
        <Hit/>
        <Effect/>
      </Canvas>
    </div>
    </>
  )
}

export default App
