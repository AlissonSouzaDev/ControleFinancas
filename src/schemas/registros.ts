import { z } from 'zod'

export const schemaRegistroForm = z.object({
  tipo: z.enum(['a_pagar', 'a_receber']),
  descricao: z.string().min(1, 'Campo Descrição é obrigatório'),
  data_vencimento: z.string().min(1, 'Campo Data de Vencimento é obrigatório'),
  valor_total: z
    .number({ error: 'Informe um valor' })
    .positive('O valor deve ser maior que zero'),
  valor_realizado: z.number().min(0, 'Não pode ser negativo'),
}).refine(
  data => data.valor_realizado <= data.valor_total,
  { message: 'Não pode ser maior que o Valor Total', path: ['valor_realizado'] }
)

export type RegistroFormData = z.infer<typeof schemaRegistroForm>

const _baseAlterarStatus = z.object({
  status_pagamento: z.enum(['pendente', 'parcial', 'quitado']),
  valor_realizado: z.number().min(0, 'Não pode ser negativo'),
  observacao: z.string().optional(),
})

export type AlterarStatusFormData = z.infer<typeof _baseAlterarStatus>

export const schemaAlterarStatus = (valorTotal: number) =>
  _baseAlterarStatus.refine(
    data => {
      if (isNaN(data.valor_realizado)) return true
      return data.valor_realizado <= valorTotal
    },
    { message: 'Não pode ser maior que o Valor Total', path: ['valor_realizado'] }
  )
