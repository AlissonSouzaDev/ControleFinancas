export interface ProjetoFuturo {
  id: number
  descricao: string
  periodo: string | null
  duracao_valor: string | null
  duracao_unidade: 'dias' | 'semanas' | 'meses' | 'anos' | null
  valor: number | null
  status: 'ideia' | 'planejando' | 'em andamento' | 'concluído'
  prioridade: number
  observacao: string | null
  criado_em: string
  alterado_em: string
}

export interface DadosProjeto {
  descricao: string
  status: ProjetoFuturo['status']
  periodo: string | null
  duracao_valor: string | null
  duracao_unidade: ProjetoFuturo['duracao_unidade']
  valor: number | null
  observacao: string | null
}

export type ModalProjetos = 'criar' | 'alterar' | 'alterar_prioridade' | 'apagar' | null

export interface ListaProjetosProps {
  projetos: ProjetoFuturo[]
  selecionado: number | null
  onSelecionar: (p: ProjetoFuturo | null) => void
}

export interface ModalFormProjetoProps {
  titulo: string
  inicial?: ProjetoFuturo
  onConfirmar: (dados: DadosProjeto) => Promise<void>
  onCancelar: () => void
}

export interface ModalAlterarPrioridadeProjetoProps {
  projeto: ProjetoFuturo
  onConfirmar: (prioridade: number) => Promise<void>
  onCancelar: () => void
}
