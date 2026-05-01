import { Sun, Moon, Menu } from 'lucide-react'
import { HeaderProps } from '../types'

export function Header({ darkMode, onToggleDark, onToggleMenu }: HeaderProps) {
  return (
    <header className="bg-[#1C2B3A] dark:bg-slate-950 px-8 py-3 flex items-center justify-between transition-colors z-40 relative">
      <div className="flex items-center gap-3">
        <p className="text-white font-bold text-sm tracking-wide">Controle Financeiro</p>
        <button
          onClick={onToggleMenu}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <Menu size={18} />
        </button>
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
