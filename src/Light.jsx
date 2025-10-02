import { useEffect, useRef } from "react"
import { eventBus } from "./EventBus"
import gsap from "gsap"

export const Light = () => {

    const lightRef = useRef(null)

    useEffect(() => {
        eventBus.on("laser-shot", (pos) => {
            lightRef.current.intensity = 5;

            lightRef.current.position.set(pos.x, pos.y, pos.z + 1)
            gsap.to(lightRef.current, {
                duration: 0.15,
                intensity: 0,

            })
        })
    })
    return (
        <pointLight castShadow ref={lightRef} color={"#ff036c"} intensity={0} position={[0, 0, -1]} />
    )
}