import { extend, useFrame } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import {
  PlaneGeometry,
  ShaderMaterial,
  Color,
  DoubleSide,
  AdditiveBlending,
  Vector3,
} from "three";
import { useEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { eventBus } from "./EventBus";

extend({ InstancedMesh2 });

export const Explosion = () => {
  const ref = useRef(null);

  const explosionTexture1 = useTexture("./explosion1.png");
  const explosionTexture2 = useTexture("./explosion2.png");
  const geometry = new PlaneGeometry(1, 1);
  const material = new ShaderMaterial({
    vertexShader: `
            #ifdef USE_INSTANCING_INDIRECT
            #include <instanced_pars_vertex>
            #endif

            varying vec3 vPosition;
            varying vec2 vUv;

            void main() {
            vPosition = position;
            vUv = uv;
            
            #ifdef USE_INSTANCING_INDIRECT
                #include <instanced_vertex>
            #endif


            vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
uniform float uProgress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uWhichTexture;
varying vec2 vUv;

void main() {
    float framesPerRow = (uWhichTexture > 0.5) ? 6.0 : 5.0;
    float totalFrames  = (uWhichTexture > 0.5) ? 36.0 : 25.0;

    float frameIndex = mod(uProgress, totalFrames);
    float col = mod(frameIndex, framesPerRow);
    float row = floor(frameIndex / framesPerRow);

    vec2 uv = vUv / framesPerRow;
    uv.x += col / framesPerRow;
    uv.y += 1.0 - (row + 1.0) / framesPerRow;

    vec4 tex = (uWhichTexture > 0.5)
        ? texture2D(uTexture1, uv)
        : texture2D(uTexture2, uv);

    float alpha = 1.0 - (uProgress / totalFrames);

    gl_FragColor = vec4(tex.rgb, tex.a * alpha);
}
        `,
    side: DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    defines: {
      USE_INSTANCING_INDIRECT: true,
    },
    uniforms: {
      uProgress: { value: 0 },
      uWhichTexture: { value: 0 },
      uTexture1: { value: explosionTexture1 },
      uTexture2: { value: explosionTexture2 },
    },
  });
  const positionMultiplier = 2;

  useEffect(() => {
    const instancedMesh = ref.current;
    if (!instancedMesh) return;
    instancedMesh.initUniformsPerInstance({
      fragment: { uColor: "vec3", uProgress: "float", uWhichTexture: "float" },
    });

    eventBus.on("explosion", (pos) => {
      instancedMesh.addInstances(10, (obj) => {
        obj.position.set(pos.x, pos.y, pos.z)
        obj.position.x += (Math.random() - 0.5) * positionMultiplier;
        obj.position.y += ((Math.random() - 0.5) * positionMultiplier) - 1;
        obj.position.z += (Math.random() - 0.5) * positionMultiplier;

        obj.delta = 0;
        obj.scale.set(0, 0, 0);
        obj.delay = Math.random() * 0.5;
        obj.lifetime = 0;
        obj.uWhichTexture = Math.random();

        obj.setUniform("uColor", new Color(0xfbe4cb).multiplyScalar(1));
        obj.setUniform("uProgress", 0);
        obj.setUniform("uWhichTexture", obj.uWhichTexture);
      });
    });
  }, []);

  useFrame((_, delta) => {
    const instancedMesh = ref.current;
    if (!instancedMesh) return;
    instancedMesh.updateInstances((obj) => {
      obj.lifetime += delta;

      if (obj.lifetime > obj.delay) {
        obj.scale.set(3, 3, 3);
        obj.delta += 1;
      }
      obj.setUniform("uProgress", obj.delta);
      const isTexture1 = obj.uWhichTexture > 0.5;

      const totalFrames = isTexture1 ? 36 : 25;
      if (obj.delta > totalFrames) {
        obj.remove();
      }
    });
  });
  return (
    <instancedMesh2
      ref={ref}
      args={[geometry, material, { createEntities: true }]}
      frustumCulled={false}
    />
  );
};
