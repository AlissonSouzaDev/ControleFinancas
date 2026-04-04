export interface Registro {
  id: number
  periodo: string
  tipo: 'a_pagar' | 'a_receber'
  descricao: string
  data: string
  valor: number
  criado_em: string
  alterado_em: string
}

export interface Totais {
  total_pagar: number
  total_receber: number
  diferenca: number
}
