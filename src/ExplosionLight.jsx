import { useEffect, useRef } from "react"
import { eventBus } from "./EventBus"
import gsap from "gsap"

export const ExplosionLight = () => {

    const lightRef = useRef(null)

    useEffect(() => {
        eventBus.on("explosion", (pos) => {
            lightRef.current.intensity = 99;

            lightRef.current.position.set(pos.x, pos.y, pos.z + 1)
            gsap.to(lightRef.current, {
                duration: 2,
                intensity: 0,

            })
        })
    })
    return (
        <pointLight castShadow ref={lightRef} color={"#ff7d03"} intensity={0} position={[0, 0, -1]} />
    )
}