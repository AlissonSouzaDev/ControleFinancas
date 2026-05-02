import type { ReactNode } from 'react'

export * from './orcamento-mensal'
export * from './projetos-futuros'

// --- Props globais de layout e UI ---

export interface HeaderProps {
  darkMode: boolean
  onToggleDark: () => void
  onToggleMenu: () => void
}

export interface SidebarProps {
  aberta: boolean
  onFechar: () => void
}

export interface CampoProps {
  label: string
  children: ReactNode
}

export interface OverlayProps {
  children: ReactNode
}
