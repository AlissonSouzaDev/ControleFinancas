import { schemaRegistroForm, RegistroFormData as FormData } from '../../../schemas/registros'
import { useForm, useWatch } from 'react-hook-form'
import { ModalFormProps } from '../../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Overlay } from '../../ui/global/Overlay'
import { Campo } from '../../ui/global/Campo'

const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-[#1C2B3A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1C2B3A] dark:focus:ring-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"
const errorClass = "text-xs text-red-500 mt-0.5"

export function ModalForm({ titulo, periodo, inicial, onConfirmar, onCancelar }: ModalFormProps) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schemaRegistroForm),
    defaultValues: {
      tipo: inicial?.tipo ?? 'a_pagar',
      descricao: inicial?.descricao ?? '',
      data_vencimento: inicial?.data_vencimento ?? `${periodo}-01`,
      valor_total: inicial?.valor_total ?? ('' as unknown as number),
      valor_realizado: inicial?.valor_realizado ?? 0,
    },
  })

  const tipo = useWatch({ control, name: 'tipo' })
  const labelRealizado = tipo === 'a_pagar' ? 'Valor Pago (R$)' : 'Valor Recebido (R$)'

  async function onSubmit(data: FormData) {
    await onConfirmar({
      tipo: data.tipo,
      descricao: data.descricao,
      data_vencimento: data.data_vencimento,
      valor_total: data.valor_total,
      valor_realizado: data.valor_realizado > 0 ? data.valor_realizado : null,
    })
  }

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white">{titulo}</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Campo label="Período">
            <input
              type="month"
              value={periodo}
              readOnly
              className="w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 cursor-not-allowed"
            />
          </Campo>
          <Campo label="Tipo de Registro">
            <select {...register('tipo')} className={inputClass}>
              <option value="a_pagar">A Pagar</option>
              <option value="a_receber">A Receber</option>
            </select>
          </Campo>
          <Campo label="Descrição *">
            <input
              {...register('descricao')}
              type="text"
              placeholder="Ex: Assinatura de software"
              className={inputClass}
            />
            {errors.descricao && <p className={errorClass}>{errors.descricao.message}</p>}
          </Campo>
          <Campo label="Data de Vencimento *">
            <input
              {...register('data_vencimento')}
              type="date"
              className={inputClass}
            />
            {errors.data_vencimento && <p className={errorClass}>{errors.data_vencimento.message}</p>}
          </Campo>
          <Campo label="Valor Total (R$) *">
            <input
              {...register('valor_total', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              className={inputClass}
            />
            {errors.valor_total && <p className={errorClass}>{errors.valor_total.message}</p>}
          </Campo>
          <Campo label={labelRealizado}>
            <input
              {...register('valor_realizado', { setValueAs: v => v === '' || isNaN(Number(v)) ? 0 : Number(v) })}
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className={inputClass}
            />
            {errors.valor_realizado && <p className={errorClass}>{errors.valor_realizado.message}</p>}
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
              {inicial ? 'Salvar Alterações' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  )
}
