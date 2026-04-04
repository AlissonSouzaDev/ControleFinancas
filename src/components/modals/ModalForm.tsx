import { useState } from 'react'
import { Registro } from '../../types'
import { Overlay } from '../ui/Overlay'
import { Campo } from '../ui/Campo'

interface ModalFormProps {
  titulo: string
  periodo: string
  inicial?: Registro
  onConfirmar: (dados: { tipo: string; descricao: string; data: string; valor: number }) => Promise<void>
  onCancelar: () => void
}

export function ModalForm({ titulo, periodo, inicial, onConfirmar, onCancelar }: ModalFormProps) {
  const [tipo, setTipo] = useState<'a_pagar' | 'a_receber'>(inicial?.tipo ?? 'a_pagar')
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '')
  const [data, setData] = useState(inicial?.data ?? `${periodo}-01`)
  const [valor, setValor] = useState(inicial ? String(inicial.valor) : '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirmar({ tipo, descricao, data, valor: parseFloat(valor) })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-[#1C2B3A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1C2B3A] dark:focus:ring-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white">{titulo}</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Campo label="Período">
            <input
              type="month"
              value={periodo}
              readOnly
              className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 cursor-not-allowed"
            />
          </Campo>
          <Campo label="Tipo de Registro">
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value as 'a_pagar' | 'a_receber')}
              className={inputClass}
            >
              <option value="a_pagar">A Pagar</option>
              <option value="a_receber">A Receber</option>
            </select>
          </Campo>
          <Campo label="Descrição">
            <input
              type="text"
              placeholder="Ex: Assinatura de software"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
              className={inputClass}
            />
          </Campo>
          <Campo label="Data do Registro">
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
              className={inputClass}
            />
          </Campo>
          <Campo label="Valor (R$)">
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
              className={inputClass}
            />
          </Campo>
          <div className="flex gap-3 pt-1">
            {inicial && (
              <button type="button" onClick={onCancelar} className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1C2B3A] dark:bg-slate-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-[#2a3f57] dark:hover:bg-slate-500 transition-colors disabled:opacity-60"
            >
              {inicial ? 'Salvar Alterações' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  )
}
