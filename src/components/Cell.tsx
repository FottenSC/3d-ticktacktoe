import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

interface CellProps {
    position: [number, number, number]
    value: string | null
    onClick: () => void
}

export default function Cell({ position, value, onClick }: CellProps) {
    const [hovered, setHover] = useState(false)
    const ref = useRef<THREE.Group>(null)

    // Simple animation for the marker
    useFrame((state) => {
        if (ref.current && value) {
            ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
        }
    })

    return (
        <group position={position}>
            {/* The clickable cell base */}
            <Box
                args={[0.9, 0.1, 0.9]}
                onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                receiveShadow
                castShadow
            >
                <meshStandardMaterial
                    color={hovered ? 'hotpink' : 'orange'}
                    transparent
                    opacity={0.8}
                />
            </Box>

            {/* The Marker (X or O) */}
            {value && (
                <group position={[0, 0.5, 0]} ref={ref}>
                    {value === 'X' ? (
                        <XMarker />
                    ) : (
                        <OMarker />
                    )}
                </group>
            )}
        </group>
    )
}

function XMarker() {
    return (
        <group>
            <Box args={[0.8, 0.2, 0.2]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="blue" />
            </Box>
            <Box args={[0.8, 0.2, 0.2]} rotation={[0, -Math.PI / 4, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="blue" />
            </Box>
        </group>
    )
}

function OMarker() {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial color="red" />
        </mesh>
    )
}
