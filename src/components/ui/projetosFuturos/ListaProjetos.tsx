import { ProjetoFuturo, ListaProjetosProps } from '../../../types'
import { formatarMoeda } from '../../../utils/formatters'
import { Fragment } from 'react'

const faseCor: Record<ProjetoFuturo['status'], string> = {
  'ideia':        'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  'planejando':   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'em andamento': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'concluído':    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const prioridadeLabel: Record<number, string> = {
  1: '1 — Mínima',
  2: '2 — Baixa',
  3: '3 — Média',
  4: '4 — Alta',
  5: '5 — Máxima',
}

const prioridadeCor: Record<number, string> = {
  1: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  2: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  4: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  5: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function duracaoLabel(p: ProjetoFuturo) {
  if (!p.duracao_valor || !p.duracao_unidade) return null
  return `${p.duracao_valor} ${p.duracao_unidade}`
}

export function ListaProjetos({ projetos, selecionado, onSelecionar }: ListaProjetosProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 shadow-sm flex flex-col transition-colors overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="w-[4.5px] h-5 bg-blue-500 rounded-full" />
          <h2 className="font-bold text-[#1C2B3A] dark:text-white">Lista de projetos</h2>
        </div>
        <span className="text-xs text-gray-800 dark:text-slate-300">
          {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {projetos.length === 0 ? (
          <p className="text-sm text-gray-800 dark:text-slate-300 text-center py-10">Nenhum projeto registrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 text-xs text-gray-500 dark:text-slate-100 uppercase tracking-wide">
                <th className="px-4 py-2 text-left font-medium">Descrição</th>
                <th className="px-4 py-2 text-left font-medium">Fase</th>
                <th className="px-4 py-2 text-left font-medium">Período</th>
                <th className="px-4 py-2 text-left font-medium">Duração</th>
                <th className="px-4 py-2 text-left font-medium w-px whitespace-nowrap">Prioridade</th>
                <th className="px-4 py-2 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {projetos.map(p => (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => onSelecionar(selecionado === p.id ? null : p)}
                    className={`cursor-pointer transition-colors ${selecionado === p.id ? 'bg-blue-100 dark:bg-slate-700' : 'hover:bg-blue-50 dark:hover:bg-slate-700/60'}`}
                  >
                    <td className="px-4 py-3 text-[#1C2B3A] dark:text-slate-100 font-medium max-w-[200px] truncate">{p.descricao}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${faseCor[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-100">{p.periodo ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-100">{duracaoLabel(p) ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${prioridadeCor[p.prioridade]}`}>
                        {prioridadeLabel[p.prioridade]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1C2B3A] dark:text-slate-100">
                      {p.valor != null ? formatarMoeda(p.valor) : '—'}
                    </td>
                  </tr>
                  {selecionado === p.id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 bg-blue-50 dark:bg-slate-700/40 border-t border-blue-100 dark:border-slate-600">
                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-100 mb-1">Observação</p>
                        <textarea
                          readOnly
                          value={p.observacao ?? ''}
                          placeholder="Nenhuma observação registrada."
                          rows={2}
                          className="w-full text-sm text-gray-700 dark:text-slate-100 bg-transparent resize-none outline-none placeholder:text-gray-400 dark:placeholder:text-slate-300"
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
