export interface ProjetoFuturo {
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

export interface DadosProjeto {
  descricao: string
  status: ProjetoFuturo['status']
  periodo: string | null
  duracao_valor: string | null
  duracao_unidade: ProjetoFuturo['duracao_unidade']
  valor: number | null
}

export type ModalProjetos = 'criar' | 'alterar' | 'apagar' | null

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
