import { PeriodoNavProps } from '../../../types'
import { periodoLabel } from '../../../utils/formatters'

export function PeriodoNav({ periodo, onAnterior, onProximo }: PeriodoNavProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Resumo Financeiro</p>
        <h1 className="text-2xl font-bold text-[#1C2B3A] dark:text-white">Orçamento Mensal</h1>
      </div>
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm transition-colors">
        <button onClick={onAnterior} className="transition-colors">
          <img src="/icons/chevron_left_gray.svg" className="w-[18px] h-[18px]" />
        </button>
        <span className="font-semibold text-[#1C2B3A] dark:text-white w-36 text-center">{periodoLabel(periodo)}</span>
        <button onClick={onProximo} className="transition-colors">
          <img src="/icons/chevron_right_gray.svg" className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  )
}
