import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Board from './Board'
import WinningLine from './WinningLine'

export default function Game() {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const winInfo = calculateWinner(board)
    const winner = winInfo?.winner

    const handleClick = (i: number) => {
        if (board[i] || winner) return
        const newBoard = [...board]
        newBoard[i] = isXNext ? 'X' : 'O'
        setBoard(newBoard)
        setIsXNext(!isXNext)
    }

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative">
            <div className="absolute top-4 left-4 z-10 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-2">3D Tic-Tac-Toe</h1>
                <div className="text-xl mb-4">
                    {winner ? (
                        <span className="text-green-400">Winner: {winner}</span>
                    ) : (
                        <span>Next Player: <span className={isXNext ? "text-blue-400" : "text-red-400"}>{isXNext ? 'X' : 'O'}</span></span>
                    )}
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors cursor-pointer"
                    onClick={() => {
                        setBoard(Array(9).fill(null))
                        setIsXNext(true)
                    }}
                >
                    Reset Game
                </button>
            </div>
            <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <Environment preset="city" />
                <OrbitControls />
                <Board squares={board} onClick={handleClick} />
                {winInfo && <WinningLine line={winInfo.line} />}
                <gridHelper args={[10, 10]} />
            </Canvas>
        </div>
    )
}

function calculateWinner(squares: (string | null)[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] }
        }
    }
    return null
}
