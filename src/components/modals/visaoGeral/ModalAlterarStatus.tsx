import { useMemo } from 'react'
import { ModalAlterarStatusProps } from '../../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Overlay } from '../../ui/global/Overlay'
import { useForm } from 'react-hook-form'
import { Campo } from '../../ui/global/Campo'
import { z } from 'zod'

const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-[#1C2B3A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1C2B3A] dark:focus:ring-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"
const errorClass = "text-xs text-red-500 mt-0.5"

export function ModalAlterarStatus({ registro, onConfirmar, onCancelar }: ModalAlterarStatusProps) {
  const isPagar = registro.tipo === 'a_pagar'
  const labelRealizado = isPagar ? 'Valor Pago (R$)' : 'Valor Recebido (R$)'

  const schema = useMemo(() => z.object({
    status_pagamento: z.enum(['pendente', 'parcial', 'quitado']),
    valor_realizado: z.number().min(0, 'Não pode ser negativo').optional(),
    observacao: z.string().optional(),
  }).refine(
    data => {
      if (data.valor_realizado === undefined || isNaN(data.valor_realizado)) return true
      return data.valor_realizado <= registro.valor_total
    },
    { message: 'Não pode ser maior que o Valor Total', path: ['valor_realizado'] }
  ), [registro.valor_total])

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status_pagamento: registro.status_pagamento,
      valor_realizado: registro.valor_realizado > 0 ? registro.valor_realizado : ('' as unknown as number),
      observacao: registro.observacao ?? '',
    },
  })

  async function onSubmit(data: FormData) {
    await onConfirmar({
      status_pagamento: data.status_pagamento,
      valor_realizado: data.valor_realizado !== undefined && !isNaN(data.valor_realizado) ? data.valor_realizado : null,
      observacao: data.observacao?.trim() || null,
    })
  }

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white">Alterar Status</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Campo label="Status de Pagamento">
            <select {...register('status_pagamento')} className={inputClass}>
              <option value="pendente">{isPagar ? 'Não Pago' : 'Não Recebido'}</option>
              <option value="parcial">{isPagar ? 'Pago Parcialmente' : 'Recebido Parcialmente'}</option>
              <option value="quitado">{isPagar ? 'Pago Integralmente' : 'Recebido Integralmente'}</option>
            </select>
          </Campo>

          <Campo label={labelRealizado}>
            <input
              {...register('valor_realizado', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className={inputClass}
            />
            {errors.valor_realizado && <p className={errorClass}>{errors.valor_realizado.message}</p>}
          </Campo>

          <Campo label="Observação">
            <textarea
              {...register('observacao')}
              rows={3}
              placeholder="Digite uma observação..."
              className={inputClass + ' resize-none'}
            />
          </Campo>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#1C2B3A] dark:bg-slate-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-[#2a3f57] dark:hover:bg-slate-500 transition-colors disabled:opacity-60"
            >
              Alterar Venda
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  )
}
