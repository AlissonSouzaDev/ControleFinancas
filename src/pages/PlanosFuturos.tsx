import { useState, useEffect, useCallback } from 'react'
import { PlanoFuturo, ModalPlanos } from '../types'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { ModalConfirmar } from '../components/modals/global/ModalConfirmar'
import { ListaPlanos } from '../components/ui/planosFuturos/ListaPlanos'
import { ModalForm } from '../components/modals/planosFuturos/ModalForm'
import { invoke } from '@tauri-apps/api/core'

export function PlanosFuturos() {
  const [planos, setPlanos] = useState<PlanoFuturo[]>([])
  const [selecionado, setSelecionado] = useState<PlanoFuturo | null>(null)
  const [modal, setModal] = useState<ModalPlanos>(null)

  const carregar = useCallback(async () => {
    const lista = await invoke<PlanoFuturo[]>('listar_planos')
    setPlanos(lista)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  function fecharModal() { setModal(null) }

  return (
    <main className="flex-1 px-8 py-6 flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest">Desenvolvimento de Ideias</p>
        <h1 className="text-2xl font-bold text-[#1C2B3A] dark:text-white">Planos Futuros</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { setSelecionado(null); setModal('criar') }}
          className="flex items-center gap-2 bg-[#00355f] dark:bg-[#0f2d7e] border border-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <Plus size={15} /> Criar registro
        </button>
        <button
          disabled={!selecionado}
          onClick={() => selecionado && setModal('alterar')}
          className="flex items-center gap-2 bg-[#dce9ff] dark:bg-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 text-[#00355f] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Pencil size={15} /> Alterar registro
        </button>
        <button
          disabled={!selecionado}
          onClick={() => selecionado && setModal('apagar')}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-red-400 text-red-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={15} /> Apagar registro
        </button>
      </div>

      <ListaPlanos
        planos={planos}
        selecionado={selecionado?.id ?? null}
        onSelecionar={(p) => setSelecionado(selecionado?.id === p?.id ? null : p)}
      />

      {modal === 'criar' && (
        <ModalForm
          titulo="Criar Plano"
          onConfirmar={async (dados) => {
            try {
              await invoke('criar_plano', {
                descricao: dados.descricao,
                status: dados.status,
                periodo: dados.periodo,
                duracaoValor: dados.duracao_valor,
                duracaoUnidade: dados.duracao_unidade,
                valor: dados.valor,
              })
              await carregar()
              fecharModal()
            } catch (e) {
              console.error('criar_plano:', e)
            }
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'alterar' && selecionado && (
        <ModalForm
          titulo="Alterar Plano"
          inicial={selecionado}
          onConfirmar={async (dados) => {
            try {
              await invoke('alterar_plano', {
                id: selecionado.id,
                descricao: dados.descricao,
                status: dados.status,
                periodo: dados.periodo,
                duracaoValor: dados.duracao_valor,
                duracaoUnidade: dados.duracao_unidade,
                valor: dados.valor,
              })
              await carregar()
              setSelecionado(null)
              fecharModal()
            } catch (e) {
              console.error('alterar_plano:', e)
            }
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'apagar' && selecionado && (
        <ModalConfirmar
          titulo="Apagar Plano"
          mensagem="Deseja mesmo apagar este plano? Esta ação é permanente e não poderá ser desfeita."
          onConfirmar={async () => {
            await invoke('apagar_plano', { id: selecionado.id })
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
