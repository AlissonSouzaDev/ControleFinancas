import { AcoesBarProps } from '../../../types'

export function AcoesBar({ selecionado, onCriar, onAlterar, onAlterarStatus, onAlterarPrioridade, onApagar, onApagarTodos }: AcoesBarProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onCriar}
        className="flex items-center gap-2 bg-[#00355f] dark:bg-[#0f2d7e] border border-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        <img src="/icons/plus.svg" className="w-[15px] h-[15px]" /> Criar registro
      </button>
      <button
        onClick={onAlterar}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <img src="/icons/pencil_blue.svg" className="w-[15px] h-[15px] dark:hidden" />
        <img src="/icons/pencil_gray.svg" className="w-[15px] h-[15px] hidden dark:block" /> Alterar registro
      </button>
      <button
        onClick={onAlterarStatus}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <img src="/icons/bar_chart_blue.svg" className="w-[15px] h-[15px] dark:hidden" />
        <img src="/icons/bar_chart_gray.svg" className="w-[15px] h-[15px] hidden dark:block" /> Alterar Status
      </button>
      <button
        onClick={onAlterarPrioridade}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <img src="/icons/star_blue.svg" className="w-[15px] h-[15px] dark:hidden" />
        <img src="/icons/star_gray.svg" className="w-[15px] h-[15px] hidden dark:block" /> Alterar Prioridade
      </button>
      <button
        onClick={onApagar}
        disabled={!selecionado}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <img src="/icons/trash.svg" className="w-[15px] h-[15px]" /> Apagar registro
      </button>
      <div className="flex-1" />
      <button
        onClick={onApagarTodos}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 transition-colors rounded-lg"
      >
        <img src="/icons/trash.svg" className="w-[15px] h-[15px]" /> Apagar todos do mês
      </button>
    </div>
  )
}
