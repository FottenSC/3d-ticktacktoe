import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FFFFFF']

interface ConfettiLayerProps {
    count: number
    size: number
    speed: number
    spread: number
    colorSet?: string[]
}

function ConfettiLayer({ count, size, speed, spread, colorSet = COLORS }: ConfettiLayerProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const color = new THREE.Color(colorSet[Math.floor(Math.random() * colorSet.length)])
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * spread,
                    Math.random() * 10 + 5, // Start high
                    (Math.random() - 0.5) * spread
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * speed,
                    Math.random() * -speed - 2, // Fall down
                    (Math.random() - 0.5) * speed
                ),
                rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
                rotationSpeed: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ),
                color: color,
                scale: Math.random() * 0.5 + 0.5
            })
        }
        return temp
    }, [count, speed, spread, colorSet])

    useFrame((_, delta) => {
        if (!meshRef.current) return

        particles.forEach((particle, i) => {
            // Physics
            particle.position.addScaledVector(particle.velocity, delta)

            // Rotation
            particle.rotation.x += particle.rotationSpeed.x * delta * 5
            particle.rotation.y += particle.rotationSpeed.y * delta * 5
            particle.rotation.z += particle.rotationSpeed.z * delta * 5

            // Reset if too low
            if (particle.position.y < -10) {
                particle.position.y = 15
                particle.velocity.x = (Math.random() - 0.5) * speed
                particle.velocity.z = (Math.random() - 0.5) * speed
            }

            dummy.position.copy(particle.position)
            dummy.rotation.copy(particle.rotation)
            dummy.scale.setScalar(size * particle.scale)
            dummy.updateMatrix()

            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    useMemo(() => {
        if (!meshRef.current) return
        particles.forEach((particle, i) => {
            meshRef.current!.setColorAt(i, particle.color)
        })
        if (meshRef.current) meshRef.current.instanceColor!.needsUpdate = true
    }, [particles])

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <planeGeometry args={[1, 0.4]} />
            <meshStandardMaterial side={THREE.DoubleSide} />
        </instancedMesh>
    )
}

export default function Confetti() {
    return (
        <group>
            {/* Layer 1: Background, small, slow, many */}
            <ConfettiLayer count={150} size={0.2} speed={2} spread={20} />

            {/* Layer 2: Midground, medium, normal speed */}
            <ConfettiLayer count={100} size={0.4} speed={4} spread={15} />

            {/* Layer 3: Foreground, large, fast, few, gold/bright */}
            <ConfettiLayer
                count={50}
                size={0.6}
                speed={6}
                spread={10}
                colorSet={['#FFD700', '#FFFFFF', '#FFA500']}
            />
        </group>
    )
}
