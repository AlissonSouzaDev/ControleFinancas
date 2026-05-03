import { ProjetoFuturo, ListaProjetosProps } from '../../../types'
import { formatarMoeda } from '../../../utils/formatters'

const statusCor: Record<ProjetoFuturo['status'], string> = {
  'ideia': 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  'planejando': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'em andamento': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'concluído': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

function duracaoLabel(p: ProjetoFuturo) {
  if (!p.duracao_valor || !p.duracao_unidade) return null
  return `${p.duracao_valor} ${p.duracao_unidade}`
}

export function ListaProjetos({ projetos, selecionado, onSelecionar }: ListaProjetosProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="w-[4.5px] h-5 bg-blue-500 rounded-full" />
          <h2 className="font-bold text-[#1C2B3A] dark:text-white">Lista de projetos</h2>
        </div>
        <span className="text-xs text-gray-800 dark:text-slate-300">
          {projetos.length} {projetos.length === 1 ? 'Projeto' : 'projetos'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700">
        {projetos.length === 0 && (
          <p className="text-sm text-gray-800 dark:text-slate-300 text-center py-10">Nenhum projeto registrado.</p>
        )}
        {projetos.map(p => (
          <div
            key={p.id}
            onClick={() => onSelecionar(selecionado === p.id ? null : p)}
            className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors
              ${selecionado === p.id
                ? 'bg-blue-100 dark:bg-slate-700'
                : 'hover:bg-blue-50 dark:hover:bg-slate-700/60'
              }`}
          >
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full flex-shrink-0">
              <img src="/icons/lightbulb.svg" className="w-[18px] h-[18px]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C2B3A] dark:text-slate-100 truncate">{p.descricao}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {p.periodo && (
                  <span className="text-xs text-gray-500 dark:text-slate-400">{p.periodo}</span>
                )}
                {duracaoLabel(p) && (
                  <span className="text-xs text-gray-500 dark:text-slate-400">{duracaoLabel(p)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {p.valor != null && (
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {formatarMoeda(p.valor)}
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCor[p.status]}`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
