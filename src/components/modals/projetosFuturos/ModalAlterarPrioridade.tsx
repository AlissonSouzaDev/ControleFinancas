import { schemaAlterarPrioridadeProjeto, AlterarPrioridadeProjetoFormData as FormData } from '../../../schemas/projetos'
import { ModalAlterarPrioridadeProjetoProps } from '../../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Overlay } from '../../ui/global/Overlay'
import { useForm } from 'react-hook-form'
import { Campo } from '../../ui/global/Campo'

const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-[#1C2B3A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1C2B3A] dark:focus:ring-slate-400"

export function ModalAlterarPrioridade({ projeto, onConfirmar, onCancelar }: ModalAlterarPrioridadeProjetoProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schemaAlterarPrioridadeProjeto),
    defaultValues: { prioridade: projeto.prioridade },
  })

  async function onSubmit(data: FormData) {
    await onConfirmar(data.prioridade)
  }

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white">Alterar Prioridade</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Campo label="Prioridade">
            <select {...register('prioridade', { setValueAs: v => Number(v) })} className={inputClass}>
              <option value={1}>1 — Mínima</option>
              <option value={2}>2 — Baixa</option>
              <option value={3}>3 — Média</option>
              <option value={4}>4 — Alta</option>
              <option value={5}>5 — Máxima</option>
            </select>
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
              Alterar Prioridade
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  )
}
