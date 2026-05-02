import { z } from 'zod'

export const schemaPlanoForm = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  status: z.enum(['ideia', 'planejando', 'em andamento', 'concluído']),
  periodo: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, 'Formato inválido — use mm/aaaa')
    .optional()
    .or(z.literal('')),
  duracao_valor: z
    .string()
    .regex(/^\d+$/, 'Informe apenas números inteiros')
    .optional()
    .or(z.literal('')),
  duracao_unidade: z.enum(['dias', 'semanas', 'meses', 'anos']).optional().or(z.literal('')),
  valor: z
    .string()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Informe um valor válido')
    .optional()
    .or(z.literal('')),
}).refine(
  data => !!data.duracao_valor === !!data.duracao_unidade,
  { message: 'Preencha tanto a duração quanto a unidade', path: ['duracao_unidade'] }
)

export type PlanoFormData = z.infer<typeof schemaPlanoForm>
