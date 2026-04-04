import { ArrowDownCircle } from 'lucide-react'
import { formatarMoeda } from '../utils/formatters'
import { Registro } from '../types'

interface ListaPagarProps {
  registros: Registro[]
  selecionado: number | null
  onSelecionar: (r: Registro | null) => void
}

export function ListaPagar({ registros, selecionado, onSelecionar }: ListaPagarProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
      <div className="flex items-center justify-between px-5 py-4 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="w-[4.5px] h-5 bg-red-500 rounded-full" />
          <h2 className="font-bold text-[#1C2B3A] dark:text-white">A Pagar</h2>
        </div>
        <span className="text-xs text-gray-800 dark:text-slate-300">
          {registros.length} {registros.length === 1 ? 'Registro' : 'Registros'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700">
        {registros.length === 0 && (
          <p className="text-sm text-gray-800 dark:text-slate-300 text-center py-10">Nenhum registro neste período.</p>
        )}
        {registros.map(r => (
          <div
            key={r.id}
            onClick={() => onSelecionar(selecionado === r.id ? null : r)}
            className={`flex items-center border border-gray-200 dark:border-slate-700 gap-4 px-5 py-3 cursor-pointer transition-colors ${selecionado === r.id ? 'bg-blue-100 dark:bg-slate-700' : 'hover:bg-red-50 dark:hover:bg-slate-700/60'}`}
          >
            <div className="bg-[#FDECEA] dark:bg-red-900/30 p-2 rounded-full flex-shrink-0">
              <ArrowDownCircle size={18} className="text-red-500" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C2B3A] dark:text-slate-100 truncate">{r.descricao}</p>
              <p className="text-xs text-gray-800 dark:text-slate-300">{r.data.split('-').reverse().join('/')}</p>
            </div>
            <p className="text-sm font-semibold text-red-500 flex-shrink-0">{formatarMoeda(r.valor)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
