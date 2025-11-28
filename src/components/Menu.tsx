export default function Menu() {
    return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-3">
                        3D Tic-Tac-Toe
                    </h1>
                    <p className="text-gray-300">Choose your game mode</p>
                </div>

                <div className="space-y-4">
                    <a
                        href="#local"
                        className="block w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg text-center"
                    >
                        <div className="text-3xl mb-2">🎮</div>
                        <div className="text-xl">Local Play</div>
                        <div className="text-sm text-blue-100 mt-1">Play on this device</div>
                    </a>

                    <a
                        href="#p2p"
                        className="block w-full py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg text-center"
                    >
                        <div className="text-3xl mb-2">🌐</div>
                        <div className="text-xl">Online Multiplayer</div>
                        <div className="text-sm text-purple-100 mt-1">Play with a friend over the internet</div>
                    </a>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400 text-sm">
                        Powered by WebRTC P2P Technology
                    </p>
                </div>
            </div>
        </div>
    )
}
