import { Fragment } from 'react'
import { ListaPagarProps } from '../../../types'
import { formatarMoeda } from '../../../utils/formatters'
import { StatusPagamento } from '../global/StatusPagamento'

export function ListaPagar({ registros, selecionado, onSelecionar }: ListaPagarProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 shadow-sm flex flex-col transition-colors overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="w-[4.5px] h-5 bg-red-500 rounded-full" />
          <h2 className="font-bold text-[#1C2B3A] dark:text-white">A Pagar</h2>
        </div>
        <span className="text-xs text-gray-800 dark:text-slate-300">
          {registros.length} {registros.length === 1 ? 'Registro' : 'Registros'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {registros.length === 0 ? (
          <p className="text-sm text-gray-800 dark:text-slate-300 text-center py-10">Nenhum registro neste período.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 text-xs text-gray-500 dark:text-slate-100 uppercase tracking-wide">
                <th className="px-4 py-2 text-left font-medium">Descrição</th>
                <th className="px-4 py-2 text-left font-medium">Data de Vencimento</th>
                <th className="px-4 py-2 text-center font-medium w-px whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-right font-medium whitespace-nowrap">Valor Pago</th>
                <th className="px-4 py-2 text-right font-medium whitespace-nowrap">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {registros.map(r => (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => onSelecionar(selecionado === r.id ? null : r)}
                    className={`cursor-pointer transition-colors ${selecionado === r.id ? 'bg-blue-100 dark:bg-slate-700' : 'hover:bg-red-50 dark:hover:bg-slate-700/60'}`}
                  >
                    <td className="px-4 py-3 text-[#1C2B3A] dark:text-slate-100 font-medium max-w-[160px] truncate">{r.descricao}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-100">{r.data_vencimento.split('-').reverse().join('/')}</td>
                    <td className="px-4 py-3">
                      <StatusPagamento status={r.status_pagamento} tipo="a_pagar" />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 dark:text-slate-100">{formatarMoeda(r.valor_realizado)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${r.prioridade ? 'text-red-500' : 'text-[#1C2B3A] dark:text-slate-100'}`}>
                      {formatarMoeda(r.valor_total)}
                    </td>
                  </tr>
                  {selecionado === r.id && (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 bg-blue-50 dark:bg-slate-700/40 border-t border-blue-100 dark:border-slate-600">
                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-100 mb-1">Observação</p>
                        <textarea
                          readOnly
                          value={r.observacao ?? ''}
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
