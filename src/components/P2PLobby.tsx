import { useState, useEffect } from 'react'
import type { UsePeerConnectionReturn } from '../hooks/usePeerConnection'

interface P2PLobbyProps {
    peerConnection: UsePeerConnectionReturn
    onGameStart: (isHost: boolean) => void
}

export default function P2PLobby({ peerConnection, onGameStart }: P2PLobbyProps) {
    const [joinId, setJoinId] = useState('')
    const [isHost, setIsHost] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCreateGame = () => {
        setIsHost(true)
        peerConnection.createPeer()
    }

    const handleJoinGame = () => {
        if (!joinId.trim()) return
        setIsHost(false)
        peerConnection.createPeer()
    }

    // Effect to handle joining once peer is ready
    useEffect(() => {
        if (!isHost && peerConnection.peerId && joinId && peerConnection.status === 'disconnected') {
            peerConnection.connectToPeer(joinId.trim())
        }
    }, [isHost, peerConnection.peerId, joinId, peerConnection.status])

    const handleCopyId = async () => {
        if (peerConnection.peerId) {
            await navigator.clipboard.writeText(peerConnection.peerId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const getStatusColor = () => {
        switch (peerConnection.status) {
            case 'connected': return 'bg-green-500'
            case 'connecting': return 'bg-yellow-500'
            case 'error': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusText = () => {
        switch (peerConnection.status) {
            case 'connected': return 'Connected'
            case 'connecting': return 'Connecting...'
            case 'error': return 'Error'
            default: return 'Disconnected'
        }
    }

    // Auto-start game when connected
    if (peerConnection.status === 'connected') {
        setTimeout(() => onGameStart(isHost), 100)
    }

    return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
                <h1 className="text-4xl font-bold text-white mb-2 text-center">
                    3D Tic-Tac-Toe
                </h1>
                <p className="text-gray-300 text-center mb-8">Peer-to-Peer Multiplayer</p>

                {/* Connection Status */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                    <span className="text-white font-medium">{getStatusText()}</span>
                </div>

                {peerConnection.error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-200 text-sm">{peerConnection.error}</p>
                    </div>
                )}

                {!peerConnection.peerId ? (
                    /* Initial Options */
                    <div className="space-y-4">
                        <button
                            onClick={handleCreateGame}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                        >
                            🎮 Host Game
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-black/50 text-gray-400">or</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Enter friend's Peer ID"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleJoinGame}
                                disabled={!joinId.trim()}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                            >
                                🔗 Join Game
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Waiting Room */
                    <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20">
                            <p className="text-gray-300 text-sm mb-3 text-center">
                                {isHost ? 'Share this ID with your friend:' : 'Connecting to peer...'}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-4 py-3 bg-black/30 rounded-lg font-mono text-white text-center break-all">
                                    {peerConnection.peerId}
                                </div>
                                {isHost && (
                                    <button
                                        onClick={handleCopyId}
                                        className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? '✓' : '📋'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {peerConnection.status === 'connecting' && (
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                                <p className="text-gray-300">
                                    {isHost ? 'Waiting for opponent...' : 'Connecting...'}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                peerConnection.disconnect()
                                window.location.reload()
                            }}
                            className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl transition-colors border border-red-500/30"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={() => window.location.hash = ''}
                        className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>
        </div>
    )
}
