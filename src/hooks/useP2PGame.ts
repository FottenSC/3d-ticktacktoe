import { useState, useEffect, useCallback } from 'react'
import type { UsePeerConnectionReturn, PlayerSymbol } from './usePeerConnection'

export interface GameMessage {
    type: 'move' | 'reset' | 'ready'
    position?: number
    board?: (string | null)[]
}

export interface UseP2PGameReturn {
    board: (string | null)[]
    isXNext: boolean
    mySymbol: PlayerSymbol | null
    isMyTurn: boolean
    opponentReady: boolean
    makeMove: (position: number) => void
    resetGame: () => void
}

export function useP2PGame(
    peerConnection: UsePeerConnectionReturn,
    isHost: boolean
): UseP2PGameReturn {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [opponentReady, setOpponentReady] = useState(false)

    // Host is always X, guest is always O
    const mySymbol: PlayerSymbol | null = peerConnection.status === 'connected'
        ? (isHost ? 'X' : 'O')
        : null

    const isMyTurn = mySymbol === (isXNext ? 'X' : 'O')

    // Send ready signal when connected
    useEffect(() => {
        if (peerConnection.status === 'connected') {
            peerConnection.sendData({ type: 'ready' })
        }
    }, [peerConnection.status, peerConnection])

    // Handle incoming messages
    useEffect(() => {
        peerConnection.onDataReceived((data: GameMessage) => {
            console.log('Received game message:', data)

            switch (data.type) {
                case 'ready':
                    setOpponentReady(true)
                    break

                case 'move':
                    if (data.position !== undefined) {
                        // Apply opponent's move
                        setBoard(prevBoard => {
                            const newBoard = [...prevBoard]
                            newBoard[data.position!] = isXNext ? 'X' : 'O'
                            return newBoard
                        })
                        setIsXNext(prev => !prev)
                    }
                    break

                case 'reset':
                    setBoard(Array(9).fill(null))
                    setIsXNext(true)
                    break
            }
        })
    }, [peerConnection, isXNext])

    const makeMove = useCallback((position: number) => {
        // Validate move
        if (!isMyTurn || board[position] || peerConnection.status !== 'connected') {
            return
        }

        // Update local board
        const newBoard = [...board]
        newBoard[position] = mySymbol
        setBoard(newBoard)
        setIsXNext(!isXNext)

        // Send move to opponent
        peerConnection.sendData({
            type: 'move',
            position
        })
    }, [isMyTurn, board, mySymbol, isXNext, peerConnection])

    const resetGame = useCallback(() => {
        setBoard(Array(9).fill(null))
        setIsXNext(true)

        if (peerConnection.status === 'connected') {
            peerConnection.sendData({ type: 'reset' })
        }
    }, [peerConnection])

    // Reset game when connection is established
    useEffect(() => {
        if (peerConnection.status === 'connected') {
            setBoard(Array(9).fill(null))
            setIsXNext(true)
            setOpponentReady(false)
        }
    }, [peerConnection.status])

    return {
        board,
        isXNext,
        mySymbol,
        isMyTurn,
        opponentReady,
        makeMove,
        resetGame
    }
}
