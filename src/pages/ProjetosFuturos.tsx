import { useState, useEffect, useCallback } from 'react'
import { ProjetoFuturo, ModalProjetos } from '../types'
import { ModalConfirmar } from '../components/modals/global/ModalConfirmar'
import { ListaProjetos } from '../components/ui/projetosFuturos/ListaProjetos'
import { ModalForm } from '../components/modals/projetosFuturos/ModalForm'
import { ModalAlterarPrioridade } from '../components/modals/projetosFuturos/ModalAlterarPrioridade'
import { invoke } from '@tauri-apps/api/core'

export function ProjetosFuturos() {
  const [projetos, setProjetos] = useState<ProjetoFuturo[]>([])
  const [selecionado, setSelecionado] = useState<ProjetoFuturo | null>(null)
  const [modal, setModal] = useState<ModalProjetos>(null)

  const carregar = useCallback(async () => {
    const lista = await invoke<ProjetoFuturo[]>('listar_projetos')
    setProjetos(lista)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  function fecharModal() { setModal(null) }

  return (
    <main className="flex-1 px-8 py-6 flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Desenvolvimento de Ideias</p>
        <h1 className="text-2xl font-bold text-[#1C2B3A] dark:text-white">Projetos Futuros</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { setSelecionado(null); setModal('criar') }}
          className="flex items-center gap-2 bg-[#00355f] dark:bg-[#0f2d7e] border border-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <img src="/icons/plus.svg" className="w-[15px] h-[15px]" /> Criar registro
        </button>
        <button
          disabled={!selecionado}
          onClick={() => selecionado && setModal('alterar')}
          className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src="/icons/pencil_blue.svg" className="w-[15px] h-[15px] dark:hidden" />
          <img src="/icons/pencil_gray.svg" className="w-[15px] h-[15px] hidden dark:block" /> Alterar registro
        </button>
        <button
          disabled={!selecionado}
          onClick={() => selecionado && setModal('alterar_prioridade')}
          className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src="/icons/star_blue.svg" className="w-[15px] h-[15px] dark:hidden" />
          <img src="/icons/star_gray.svg" className="w-[15px] h-[15px] hidden dark:block" /> Alterar Prioridade
        </button>
        <button
          disabled={!selecionado}
          onClick={() => selecionado && setModal('apagar')}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src="/icons/trash.svg" className="w-[15px] h-[15px]" /> Apagar registro
        </button>
      </div>

      <ListaProjetos
        projetos={projetos}
        selecionado={selecionado?.id ?? null}
        onSelecionar={(p) => setSelecionado(selecionado?.id === p?.id ? null : p)}
      />

      {modal === 'criar' && (
        <ModalForm
          titulo="Criar Projeto"
          onConfirmar={async (dados) => {
            try {
              await invoke('criar_projeto', {
                descricao: dados.descricao,
                status: dados.status,
                periodo: dados.periodo,
                duracaoValor: dados.duracao_valor,
                duracaoUnidade: dados.duracao_unidade,
                valor: dados.valor,
                observacao: dados.observacao,
              })
              await carregar()
              fecharModal()
            } catch (e) {
              console.error('criar_projeto:', e)
            }
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'alterar' && selecionado && (
        <ModalForm
          titulo="Alterar Projeto"
          inicial={selecionado}
          onConfirmar={async (dados) => {
            try {
              await invoke('alterar_projeto', {
                id: selecionado.id,
                descricao: dados.descricao,
                status: dados.status,
                periodo: dados.periodo,
                duracaoValor: dados.duracao_valor,
                duracaoUnidade: dados.duracao_unidade,
                valor: dados.valor,
                observacao: dados.observacao,
              })
              await carregar()
              setSelecionado(null)
              fecharModal()
            } catch (e) {
              console.error('alterar_projeto:', e)
            }
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'alterar_prioridade' && selecionado && (
        <ModalAlterarPrioridade
          projeto={selecionado}
          onConfirmar={async (prioridade) => {
            await invoke('alterar_prioridade_projeto', { id: selecionado.id, prioridade })
            await carregar()
            setSelecionado(null)
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'apagar' && selecionado && (
        <ModalConfirmar
          titulo="Apagar Projeto"
          mensagem="Deseja mesmo apagar este projeto? Esta ação é permanente e não poderá ser desfeita."
          onConfirmar={async () => {
            await invoke('apagar_projeto', { id: selecionado.id })
            await carregar()
            setSelecionado(null)
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}
    </main>
  )
}
