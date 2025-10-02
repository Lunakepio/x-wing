
    import { useEffect, useRef } from "react";
    import { RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";
import { eventBus } from "./EventBus";
import { Billboard, useTexture } from "@react-three/drei";
    
    export const Flare = () => {
      const emitterRef = useRef(null);
    
      const texture = useTexture("./flare-2.jpg");
      useEffect(() => {

      })
      return (
        <>
        <Billboard>
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} transparent={true} opacity={0.5} />
          </mesh>
        </Billboard>
        </>
      );
    };
    
