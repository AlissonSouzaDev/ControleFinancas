import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Registro } from '../types'

interface AcoesBarProps {
  selecionado: Registro | null
  onCriar: () => void
  onAlterar: () => void
  onApagar: () => void
  onApagarTodos: () => void
}

export function AcoesBar({ selecionado, onCriar, onAlterar, onApagar, onApagarTodos }: AcoesBarProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onCriar}
        className="flex items-center gap-2 bg-[#00355f] dark:bg-[#0f2d7e] border border-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        <Plus size={15} /> Criar registro
      </button>
      <button
        onClick={onAlterar}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Pencil size={15} /> Alterar registro
      </button>
      <button
        onClick={onApagar}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Trash2 size={15} /> Apagar registro
      </button>
      <div className="flex-1" />
      <button
        onClick={onApagarTodos}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 transition-colors rounded-lg"
      >
        <Trash2 size={15} /> Apagar todos do mês
      </button>
    </div>
  )
}
