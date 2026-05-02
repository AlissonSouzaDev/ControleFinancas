import { HeaderProps } from '../types'

export function Header({ darkMode, onToggleDark, onToggleMenu }: HeaderProps) {
  return (
    <header className="bg-[#1C2B3A] dark:bg-slate-950 px-8 py-3 flex items-center justify-between transition-colors z-40 relative">
      <div className="flex items-center gap-3">
        <p className="text-white font-bold text-sm tracking-wide">Controle Financeiro</p>
        <button
          onClick={onToggleMenu}
          className="transition-colors p-1"
        >
          <img src="/icons/menu.svg" className="w-[18px] h-[18px]" />
        </button>
      </div>
      <button
        onClick={onToggleDark}
        className="text-white transition-colors p-2 border border-white rounded-xl"
      >
        {darkMode ? <img src="/icons/sun.svg" className="w-[18px] h-[18px]" /> : <img src="/icons/moon.svg" className="w-[18px] h-[18px]" />}
      </button>
    </header>
  )
}
