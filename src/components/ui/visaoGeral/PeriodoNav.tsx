import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PeriodoNavProps } from '../../../types'
import { periodoLabel } from '../../../utils/formatters'

export function PeriodoNav({ periodo, onAnterior, onProximo }: PeriodoNavProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Resumo Financeiro</p>
        <h1 className="text-2xl font-bold text-[#1C2B3A] dark:text-white">Visão Geral</h1>
      </div>
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm transition-colors">
        <button onClick={onAnterior} className="text-gray-500 dark:text-slate-400 hover:text-[#1C2B3A] dark:hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-[#1C2B3A] dark:text-white w-36 text-center">{periodoLabel(periodo)}</span>
        <button onClick={onProximo} className="text-gray-500 dark:text-slate-400 hover:text-[#1C2B3A] dark:hover:text-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
