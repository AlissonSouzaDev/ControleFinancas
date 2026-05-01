export interface PlanoFuturo {
  id: number
  descricao: string
  periodo: string | null
  duracao_valor: string | null
  duracao_unidade: 'dias' | 'semanas' | 'meses' | 'anos' | null
  valor: number | null
  status: 'ideia' | 'planejando' | 'em andamento' | 'concluído'
  criado_em: string
  alterado_em: string
}

export interface DadosPlano {
  descricao: string
  status: PlanoFuturo['status']
  periodo: string | null
  duracao_valor: string | null
  duracao_unidade: PlanoFuturo['duracao_unidade']
  valor: number | null
}

export type ModalPlanos = 'criar' | 'alterar' | 'apagar' | null

export interface ListaPlanosProps {
  planos: PlanoFuturo[]
  selecionado: number | null
  onSelecionar: (p: PlanoFuturo | null) => void
}

export interface ModalFormPlanoProps {
  titulo: string
  inicial?: PlanoFuturo
  onConfirmar: (dados: DadosPlano) => Promise<void>
  onCancelar: () => void
}
