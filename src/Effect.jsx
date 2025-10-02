import { EffectComposer, Bloom} from "@react-three/postprocessing"

export const Effect = () => {
    return (
          <EffectComposer >
            <Bloom  intensity={2} mipmapBlur luminanceThreshold={0} />
          </EffectComposer>
          )
}