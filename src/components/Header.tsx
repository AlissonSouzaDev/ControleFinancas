import { Sun, Moon } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  onToggleDark: () => void
}

export function Header({ darkMode, onToggleDark }: HeaderProps) {
  return (
    <header className="bg-[#1C2B3A] dark:bg-slate-950 px-8 py-3 flex items-center justify-between transition-colors">
      <div>
        <p className="text-white font-bold text-sm tracking-wide">Controle Financeiro</p>
        <p className="text-gray-400 text-xs">WEALTH MANAGEMENT</p>
      </div>
      <button
        onClick={onToggleDark}
        className="text-white transition-colors p-2 border border-white rounded-xl"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
