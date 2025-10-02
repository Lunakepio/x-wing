import { Environment, Helper } from "@react-three/drei";
import { CameraHelper } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "./useStore";

export const Lighting = () => {
  const directionalLight = useRef(null)

  useFrame(() => {
        const playerPosition = useStore.getState().playerPosition;
        if (!playerPosition && !directionalLight.current) return;
    
        if(playerPosition){
        directionalLight.current.position.x = playerPosition.x + 2;
        directionalLight.current.target.position.x = playerPosition.x;
    
        directionalLight.current.position.y = playerPosition.y + 5;
        directionalLight.current.target.position.y = playerPosition.y;
    
        directionalLight.current.position.z = playerPosition.z + 2 ;
        directionalLight.current.target.position.z = playerPosition.z;
    
        directionalLight.current.target.updateMatrixWorld();
        }
  })
  
  return (
    <>
      <directionalLight
            castShadow
            ref={directionalLight}
            position={[2, 3, 3]}
            intensity={3}
            color={"#f2fafdff"}
            shadow-bias={-0.0001}
            shadow-mapSize={[4096, 4096]}
            
          >
            <orthographicCamera
              attach="shadow-camera"
              near={1}
              far={20}
              top={5}
              left={-5}
              right={5}
              bottom={-5}
            >
              {/* <Helper type={CameraHelper} /> */}
            </orthographicCamera>
          </directionalLight>
          <Environment files={"./hdr.hdr"} background environmentIntensity={1}/>
            
    </>
  );
};