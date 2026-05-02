export interface Pagamento {
  id: number
  periodo: string
  tipo: 'a_pagar' | 'a_receber'
  descricao: string
  data_vencimento: string
  valor_total: number
  valor_realizado: number
  prioridade: boolean
  status_pagamento: 'pendente' | 'parcial' | 'quitado'
  observacao: string | null
  criado_em: string
  alterado_em: string
}

export interface Totais {
  total_pagar: number
  total_receber: number
  diferenca: number
}

export type ModalOrcamentoMensal = 'criar' | 'alterar' | 'alterar_status' | 'alterar_prioridade' | 'apagar' | 'apagar_todos' | null

export interface PeriodoNavProps {
  periodo: string
  onAnterior: () => void
  onProximo: () => void
}

export interface CardsResumoProps {
  totais: Totais
}

export interface AcoesBarProps {
  selecionado: Pagamento | null
  onCriar: () => void
  onAlterar: () => void
  onAlterarStatus: () => void
  onAlterarPrioridade: () => void
  onApagar: () => void
  onApagarTodos: () => void
}

export interface ModalAlterarStatusProps {
  registro: Pagamento
  onConfirmar: (dados: {
    status_pagamento: 'pendente' | 'parcial' | 'quitado'
    valor_realizado: number | null
    observacao: string | null
  }) => Promise<void>
  onCancelar: () => void
}

export interface ListaPagarProps {
  pagamentos: Pagamento[]
  selecionado: number | null
  onSelecionar: (r: Pagamento | null) => void
}

export interface ListaReceberProps {
  recebimentos: Pagamento[]
  selecionado: number | null
  onSelecionar: (r: Pagamento | null) => void
}

export interface ModalConfirmarProps {
  titulo: string
  mensagem: string
  variante?: 'danger' | 'warning'
  textoBotao?: string
  onConfirmar: () => Promise<void>
  onCancelar: () => void
}

export interface ModalFormProps {
  titulo: string
  periodo: string
  inicial?: Pagamento
  onConfirmar: (dados: {
    tipo: string
    descricao: string
    data_vencimento: string
    valor_total: number
    valor_realizado: number | null
  }) => Promise<void>
  onCancelar: () => void
}
