import Cell from './Cell'

interface BoardProps {
    squares: (string | null)[]
    onClick: (i: number) => void
}

export default function Board({ squares, onClick }: BoardProps) {
    return (
        <group>
            {squares.map((square, i) => {
                const x = (i % 3) - 1
                const z = Math.floor(i / 3) - 1
                return (
                    <Cell
                        key={i}
                        position={[x * 1.1, 0, z * 1.1]}
                        value={square}
                        onClick={() => onClick(i)}
                    />
                )
            })}
        </group>
    )
}
