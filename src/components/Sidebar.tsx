import { SidebarProps } from '../types'
import { NavLink } from 'react-router-dom'

const itens = [
  { to: '/', label: 'Orçamento Mensal', icon: '/icons/dashboard.svg' },
  { to: '/projetos-futuros', label: 'Projetos Futuros', icon: '/icons/calendar_clock.svg' },
]

export function Sidebar({ aberta, onFechar }: SidebarProps) {
  return (
    <>
      {aberta && (
        <div
          className="fixed inset-0 z-20"
          onClick={onFechar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30
          w-56 bg-[#1C2B3A] dark:bg-slate-950
          flex flex-col pt-14
          transition-transform duration-200
          ${aberta ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="flex flex-col gap-1 px-3 mt-4">
          {itens.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onFechar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <img src={icon} className="w-[17px] h-[17px]" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
