import { useState } from 'react'
import { usePeerConnection } from '../hooks/usePeerConnection'
import { useP2PGame } from '../hooks/useP2PGame'
import P2PLobby from './P2PLobby'
import Game from './Game'

export default function P2PGame() {
    const [gameStarted, setGameStarted] = useState(false)
    const [isHost, setIsHost] = useState(false)
    const peerConnection = usePeerConnection()
    const p2pGame = useP2PGame(peerConnection, isHost)

    const handleGameStart = (hostStatus: boolean) => {
        setIsHost(hostStatus)
        setGameStarted(true)
    }

    const handleDisconnect = () => {
        peerConnection.disconnect()
        setGameStarted(false)
        window.location.reload()
    }

    if (!gameStarted || peerConnection.status !== 'connected') {
        return <P2PLobby peerConnection={peerConnection} onGameStart={handleGameStart} />
    }

    return (
        <Game
            mode="p2p"
            p2pState={{
                board: p2pGame.board,
                isXNext: p2pGame.isXNext,
                mySymbol: p2pGame.mySymbol,
                isMyTurn: p2pGame.isMyTurn,
                opponentReady: p2pGame.opponentReady,
                connectionStatus: peerConnection.status,
                onMove: p2pGame.makeMove,
                onReset: p2pGame.resetGame,
                onDisconnect: handleDisconnect
            }}
        />
    )
}
