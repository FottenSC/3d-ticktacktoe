import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Board from './Board'
import WinningLine from './WinningLine'
import type { PlayerSymbol, ConnectionStatus } from '../hooks/usePeerConnection'

interface P2PState {
    board: (string | null)[]
    isXNext: boolean
    mySymbol: PlayerSymbol | null
    isMyTurn: boolean
    opponentReady: boolean
    connectionStatus: ConnectionStatus
    onMove: (position: number) => void
    onReset: () => void
    onDisconnect: () => void
}

interface GameProps {
    mode?: 'local' | 'p2p'
    p2pState?: P2PState
}

export default function Game({ mode = 'local', p2pState }: GameProps) {
    // Local game state
    const [localBoard, setLocalBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [localIsXNext, setLocalIsXNext] = useState(true)

    // Use P2P state if in P2P mode, otherwise use local state
    const board = mode === 'p2p' && p2pState ? p2pState.board : localBoard
    const isXNext = mode === 'p2p' && p2pState ? p2pState.isXNext : localIsXNext

    const winInfo = calculateWinner(board)
    const winner = winInfo?.winner

    const handleClick = (i: number) => {
        if (mode === 'p2p' && p2pState) {
            // P2P mode: use P2P game logic
            if (!p2pState.isMyTurn || board[i] || winner) return
            p2pState.onMove(i)
        } else {
            // Local mode: original logic
            if (board[i] || winner) return
            const newBoard = [...board]
            newBoard[i] = isXNext ? 'X' : 'O'
            setLocalBoard(newBoard)
            setLocalIsXNext(!isXNext)
        }
    }

    const handleReset = () => {
        if (mode === 'p2p' && p2pState) {
            p2pState.onReset()
        } else {
            setLocalBoard(Array(9).fill(null))
            setLocalIsXNext(true)
        }
    }

    const getStatusMessage = () => {
        if (mode === 'p2p' && p2pState) {
            if (winner) {
                return winner === p2pState.mySymbol
                    ? '🎉 You Win!'
                    : '😢 You Lose!'
            }
            if (!p2pState.opponentReady) {
                return 'Waiting for opponent to be ready...'
            }
            return p2pState.isMyTurn
                ? `Your Turn (${p2pState.mySymbol})`
                : `Opponent's Turn (${isXNext ? 'X' : 'O'})`
        } else {
            if (winner) {
                return `Winner: ${winner}`
            }
            return `Next Player: ${isXNext ? 'X' : 'O'}`
        }
    }

    const getStatusColor = () => {
        if (winner) return 'text-green-400'
        if (mode === 'p2p' && p2pState) {
            return p2pState.isMyTurn ? 'text-blue-400' : 'text-yellow-400'
        }
        return isXNext ? 'text-blue-400' : 'text-red-400'
    }

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative">
            <div className="absolute top-4 left-4 z-10 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-2">3D Tic-Tac-Toe</h1>

                {mode === 'p2p' && (
                    <div className="text-sm text-gray-300 mb-2">
                        {p2pState?.connectionStatus === 'connected' ? '🟢' : '🔴'} P2P Mode
                    </div>
                )}

                <div className={`text-xl mb-4 ${getStatusColor()}`}>
                    {getStatusMessage()}
                </div>

                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors cursor-pointer"
                        onClick={handleReset}
                    >
                        Reset Game
                    </button>

                    {mode === 'p2p' && p2pState && (
                        <button
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition-colors cursor-pointer"
                            onClick={p2pState.onDisconnect}
                        >
                            Disconnect
                        </button>
                    )}
                </div>
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

