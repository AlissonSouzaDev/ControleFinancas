import type { ReactNode } from 'react'

export * from './visao-geral'
export * from './planos-futuros'

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
