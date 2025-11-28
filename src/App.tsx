import { useState, useEffect } from 'react'
import Menu from './components/Menu'
import Game from './components/Game'
import P2PGame from './components/P2PGame'

function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || 'menu')

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || 'menu')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === 'local') {
    return <Game mode="local" />
  }

  if (route === 'p2p') {
    return <P2PGame />
  }

  return <Menu />
}

export default App
