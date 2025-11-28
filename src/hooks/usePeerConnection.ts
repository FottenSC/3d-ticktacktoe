import { useState, useEffect, useRef, useCallback } from 'react'
import Peer from 'peerjs'

// Type definition for PeerJS DataConnection
type DataConnection = any

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type PlayerSymbol = 'X' | 'O'

export interface PeerConnectionState {
    peerId: string | null
    connection: DataConnection | null
    status: ConnectionStatus
    error: string | null
}

export interface UsePeerConnectionReturn extends PeerConnectionState {
    createPeer: () => void
    connectToPeer: (remotePeerId: string) => void
    sendData: (data: any) => void
    disconnect: () => void
    onDataReceived: (callback: (data: any) => void) => void
}

export function usePeerConnection(): UsePeerConnectionReturn {
    const [peerId, setPeerId] = useState<string | null>(null)
    const [connection, setConnection] = useState<DataConnection | null>(null)
    const [status, setStatus] = useState<ConnectionStatus>('disconnected')
    const [error, setError] = useState<string | null>(null)

    const peerRef = useRef<Peer | null>(null)
    const dataCallbackRef = useRef<((data: any) => void) | null>(null)

    const createPeer = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.destroy()
        }

        setStatus('connecting')
        setError(null)

        // Create peer with PeerJS cloud server
        const peer = new Peer({
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ]
            }
        })

        peer.on('open', (id) => {
            console.log('My peer ID is:', id)
            setPeerId(id)
            setStatus('disconnected')
        })

        peer.on('connection', (conn) => {
            console.log('Incoming connection from:', conn.peer)
            setupConnection(conn)
        })

        peer.on('error', (err) => {
            console.error('Peer error:', err)
            setError(err.message)
            setStatus('error')
        })

        peerRef.current = peer
    }, [])

    const setupConnection = useCallback((conn: DataConnection) => {
        setConnection(conn)
        setStatus('connecting')

        conn.on('open', () => {
            console.log('Connection established')
            setStatus('connected')
            setError(null)
        })

        conn.on('data', (data: any) => {
            console.log('Received data:', data)
            if (dataCallbackRef.current) {
                dataCallbackRef.current(data)
            }
        })

        conn.on('close', () => {
            console.log('Connection closed')
            setStatus('disconnected')
            setConnection(null)
        })

        conn.on('error', (err: any) => {
            console.error('Connection error:', err)
            setError(err.message)
            setStatus('error')
        })
    }, [])

    const connectToPeer = useCallback((remotePeerId: string) => {
        if (!peerRef.current) {
            setError('Peer not initialized. Call createPeer() first.')
            return
        }

        if (connection) {
            connection.close()
        }

        setStatus('connecting')
        setError(null)

        const conn = peerRef.current.connect(remotePeerId, {
            reliable: true
        })

        setupConnection(conn)
    }, [connection, setupConnection])

    const sendData = useCallback((data: any) => {
        if (!connection || status !== 'connected') {
            console.warn('Cannot send data: not connected')
            return
        }

        try {
            connection.send(data)
        } catch (err) {
            console.error('Error sending data:', err)
            setError('Failed to send data')
        }
    }, [connection, status])

    const disconnect = useCallback(() => {
        if (connection) {
            connection.close()
            setConnection(null)
        }
        setStatus('disconnected')
    }, [connection])

    const onDataReceived = useCallback((callback: (data: any) => void) => {
        dataCallbackRef.current = callback
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy()
            }
        }
    }, [])

    // Cleanup connection when it changes
    useEffect(() => {
        return () => {
            if (connection) {
                connection.close()
            }
        }
    }, [connection])

    return {
        peerId,
        connection,
        status,
        error,
        createPeer,
        connectToPeer,
        sendData,
        disconnect,
        onDataReceived
    }
}
