import { useState, useLayoutEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { VisaoGeral } from './pages/VisaoGeral'
import { PlanosFuturos } from './pages/PlanosFuturos'

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tema') === 'dark')
  const [menuAberto, setMenuAberto] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#F4F2EC] dark:bg-slate-900 flex flex-col transition-colors">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
          onToggleMenu={() => setMenuAberto(v => !v)}
        />

        <Sidebar aberta={menuAberto} onFechar={() => setMenuAberto(false)} />

        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/planos-futuros" element={<PlanosFuturos />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
