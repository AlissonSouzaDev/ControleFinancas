import { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { periodoAtual, navegarPeriodo, periodoLabel } from './utils/formatters'
import { Registro, Totais } from './types'
import { ModalConfirmar } from './components/modals/ModalConfirmar'
import { ListaReceber } from './components/ListaReceber'
import { CardsResumo } from './components/CardsResumo'
import { PeriodoNav } from './components/PeriodoNav'
import { ListaPagar } from './components/ListaPagar'
import { ModalForm } from './components/modals/ModalForm'
import { AcoesBar } from './components/AcoesBar'
import { invoke } from '@tauri-apps/api/core'
import { Header } from './components/Header'

type Modal = 'criar' | 'alterar' | 'apagar' | 'apagar_todos' | null

function App() {
  const [periodo, setPeriodo] = useState(periodoAtual)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [totais, setTotais] = useState<Totais>({ total_pagar: 0, total_receber: 0, diferenca: 0 })
  const [selecionado, setSelecionado] = useState<Registro | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tema') === 'dark')

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const carregar = useCallback(async () => {
    const [regs, tots] = await Promise.all([
      invoke<Registro[]>('listar_registros', { periodo }),
      invoke<Totais>('buscar_totais', { periodo }),
    ])
    setRegistros(regs)
    setTotais(tots)
  }, [periodo])

  useEffect(() => { carregar() }, [carregar])

  function fecharModal() { setModal(null) }

  const aPagar = registros.filter(r => r.tipo === 'a_pagar')
  const aReceber = registros.filter(r => r.tipo === 'a_receber')

  return (
    <div className="min-h-screen bg-[#F4F2EC] dark:bg-slate-900 flex flex-col transition-colors">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />

      <main className="flex-1 px-8 py-6 flex flex-col gap-6">
        <PeriodoNav
          periodo={periodo}
          onAnterior={() => setPeriodo(p => navegarPeriodo(p, -1))}
          onProximo={() => setPeriodo(p => navegarPeriodo(p, 1))}
        />

        <CardsResumo totais={totais} />

        <AcoesBar
          selecionado={selecionado}
          onCriar={() => { setSelecionado(null); setModal('criar') }}
          onAlterar={() => selecionado && setModal('alterar')}
          onApagar={() => selecionado && setModal('apagar')}
          onApagarTodos={() => setModal('apagar_todos')}
        />

        <div className="grid grid-cols-2 gap-6 flex-1">
          <ListaPagar
            registros={aPagar}
            selecionado={selecionado?.id ?? null}
            onSelecionar={(r: Registro | null) => setSelecionado(selecionado?.id === r?.id ? null : r)}
          />
          <ListaReceber
            registros={aReceber}
            selecionado={selecionado?.id ?? null}
            onSelecionar={(r: Registro | null) => setSelecionado(selecionado?.id === r?.id ? null : r)}
          />
        </div>
      </main>

      {modal === 'criar' && (
        <ModalForm
          titulo="Criar registro"
          periodo={periodo}
          onConfirmar={async (dados) => {
            await invoke('criar_registro', { ...dados, periodo })
            await carregar()
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'alterar' && selecionado && (
        <ModalForm
          titulo="Alterar registro"
          periodo={periodo}
          inicial={selecionado}
          onConfirmar={async (dados) => {
            await invoke('alterar_registro', { id: selecionado.id, ...dados })
            await carregar()
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'apagar' && selecionado && (
        <ModalConfirmar
          titulo="Apagar Registro"
          mensagem="Deseja mesmo apagar este registro? Esta ação é permanente e não poderá ser desfeita em seu ledger financeiro."
          onConfirmar={async () => {
            await invoke('apagar_registro', { id: selecionado.id })
            setSelecionado(null)
            await carregar()
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'apagar_todos' && (
        <ModalConfirmar
          titulo="Apagar todos do mês"
          mensagem={`Deseja apagar todos os registros de ${periodoLabel(periodo)}? Esta ação é permanente.`}
          onConfirmar={async () => {
            await invoke('apagar_todos_mes', { periodo })
            setSelecionado(null)
            await carregar()
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}
    </div>
  )
}

export default App
