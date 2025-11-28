import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WinningLineProps {
    line: number[]
}

export default function WinningLine({ line }: WinningLineProps) {
    const meshRef = useRef<THREE.Mesh>(null)

    const points = useMemo(() => {
        const startIdx = line[0]
        const endIdx = line[2]

        const startX = (startIdx % 3) - 1
        const startZ = Math.floor(startIdx / 3) - 1

        const endX = (endIdx % 3) - 1
        const endZ = Math.floor(endIdx / 3) - 1

        // Scale by 1.1 to match board spacing
        // Raised Y to 1.2 to avoid intersection
        const start = new THREE.Vector3(startX * 1.1, 1.2, startZ * 1.1)
        const end = new THREE.Vector3(endX * 1.1, 1.2, endZ * 1.1)

        return [start, end]
    }, [line])

    // Calculate center and length for the cylinder
    const { position, rotation, height } = useMemo(() => {
        const start = points[0]
        const end = points[1]

        const direction = new THREE.Vector3().subVectors(end, start)
        const height = direction.length()

        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

        // Calculate rotation to align cylinder with direction
        // Default cylinder is along Y axis
        const quaternion = new THREE.Quaternion()
        const up = new THREE.Vector3(0, 1, 0)
        quaternion.setFromUnitVectors(up, direction.normalize())
        const rotation = new THREE.Euler().setFromQuaternion(quaternion)

        return { position: center, rotation, height }
    }, [points])

    useFrame((state) => {
        if (!meshRef.current) return

        // Animate growth
        const targetScaleY = 1
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 0.1)

        // Pulse effect
        const pulse = (Math.sin(state.clock.elapsedTime * 5) * 0.1) + 1
        meshRef.current.scale.x = pulse
        meshRef.current.scale.z = pulse
    })

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            scale={[0, 0, 0]} // Start at 0 scale
        >
            {/* Add extra length to cover the centers of the end cells */}
            <cylinderGeometry args={[0.08, 0.08, height + 0.4, 32]} />
            <meshStandardMaterial
                color="#00ff00"
                emissive="#00ff00"
                emissiveIntensity={2}
                toneMapped={false}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}
