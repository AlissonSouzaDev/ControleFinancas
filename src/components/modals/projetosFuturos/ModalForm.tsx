import { schemaProjetoForm, ProjetoFormData as FormData } from '../../../schemas/projetos'
import { ProjetoFuturo, ModalFormProjetoProps } from '../../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Overlay } from '../../ui/global/Overlay'
import { useForm } from 'react-hook-form'
import { Campo } from '../../ui/global/Campo'

const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-[#1C2B3A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1C2B3A] dark:focus:ring-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"
const errorClass = "text-xs text-red-500 mt-0.5"

export function ModalForm({ titulo, inicial, onConfirmar, onCancelar }: ModalFormProjetoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schemaProjetoForm),
    defaultValues: {
      descricao: inicial?.descricao ?? '',
      status: inicial?.status ?? 'ideia',
      periodo: inicial?.periodo ?? '',
      duracao_valor: inicial?.duracao_valor ?? '',
      duracao_unidade: inicial?.duracao_unidade ?? '',
      valor: inicial?.valor != null ? String(inicial.valor) : '',
      observacao: inicial?.observacao ?? '',
    },
  })

  useEffect(() => {
    if (inicial) {
      reset({
        descricao: inicial.descricao,
        status: inicial.status,
        periodo: inicial.periodo ?? '',
        duracao_valor: inicial.duracao_valor ?? '',
        duracao_unidade: inicial.duracao_unidade ?? '',
        valor: inicial.valor != null ? String(inicial.valor) : '',
        observacao: inicial.observacao ?? '',
      })
    }
  }, [inicial, reset])

  async function onSubmit(data: FormData) {
    await onConfirmar({
      descricao: data.descricao,
      status: data.status,
      periodo: data.periodo || null,
      duracao_valor: data.duracao_valor || null,
      duracao_unidade: (data.duracao_unidade || null) as ProjetoFuturo['duracao_unidade'],
      valor: data.valor ? parseFloat(data.valor.replace(',', '.')) : null,
      observacao: data.observacao || null,
    })
  }

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white">{titulo}</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <Campo label="Descrição *">
            <input
              {...register('descricao')}
              type="text"
              placeholder="Descreva o projeto futuro"
              className={inputClass}
            />
            {errors.descricao && <p className={errorClass}>{errors.descricao.message}</p>}
          </Campo>

          <Campo label="Status *">
            <select {...register('status')} className={inputClass}>
              <option value="ideia">Ideia</option>
              <option value="planejando">Planejando</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluído">Concluído</option>
            </select>
            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
          </Campo>

          <Campo label="Período (opcional)">
            <input
              {...register('periodo')}
              type="text"
              placeholder="mm/aaaa"
              maxLength={7}
              className={inputClass}
            />
            {errors.periodo && <p className={errorClass}>{errors.periodo.message}</p>}
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Duração (opcional)">
              <input
                {...register('duracao_valor')}
                type="text"
                inputMode="numeric"
                placeholder="Ex: 3"
                className={inputClass}
              />
              {errors.duracao_valor && <p className={errorClass}>{errors.duracao_valor.message}</p>}
            </Campo>
            <Campo label="Unidade (opcional)">
              <select {...register('duracao_unidade')} className={inputClass}>
                <option value="">Selecione</option>
                <option value="dias">Dias</option>
                <option value="semanas">Semanas</option>
                <option value="meses">Meses</option>
                <option value="anos">Anos</option>
              </select>
              {errors.duracao_unidade && <p className={errorClass}>{errors.duracao_unidade.message}</p>}
            </Campo>
          </div>

          <Campo label="Valor do Investimento (opcional)">
            <input
              {...register('valor')}
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              className={inputClass}
            />
            {errors.valor && <p className={errorClass}>{errors.valor.message}</p>}
          </Campo>

          <Campo label="Observação (opcional)">
            <textarea
              {...register('observacao')}
              rows={3}
              placeholder="Alguma nota sobre este projeto..."
              className={`${inputClass} resize-none`}
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
              {inicial ? 'Salvar Alterações' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  )
}
