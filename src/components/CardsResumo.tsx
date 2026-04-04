import { formatarMoeda } from '../utils/formatters'
import { Totais } from '../types'

interface CardsResumoProps {
  totais: Totais
}

export function CardsResumo({ totais }: CardsResumoProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white dark:bg-slate-800 border border-red-600 rounded-xl shadow-sm p-5 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-500 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Saídas</span>
        </div>
        <p className="text-xs text-red-800 dark:text-red-400 mb-1">Total de Pagamentos</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-500">{formatarMoeda(totais.total_pagar)}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-green-600 rounded-xl shadow-sm p-5 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-500 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Entradas</span>
        </div>
        <p className="text-xs text-green-800 dark:text-green-400 mb-1">Total de Recebimentos</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-500">{formatarMoeda(totais.total_receber)}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-blue-600 rounded-xl shadow-sm p-5 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-500 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Diferença</span>
        </div>
        <p className="text-xs text-blue-800 dark:text-blue-400 mb-1">Cálculo da Diferença</p>
        <p className={`text-2xl font-bold ${totais.diferenca > 0 ? 'text-green-500' : totais.diferenca < 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-500'}`}>
          {totais.diferenca > 0 ? '+' : totais.diferenca < 0 ? '-' : ''}{formatarMoeda(Math.abs(totais.diferenca))}
        </p>
      </div>
    </div>
  )
}
