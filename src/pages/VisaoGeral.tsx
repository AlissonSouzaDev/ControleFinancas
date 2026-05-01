import { periodoAtual, navegarPeriodo, periodoLabel } from '../utils/formatters'
import { Registro, Totais, ModalVisaoGeral } from '../types'
import { useState, useEffect, useCallback } from 'react'
import { ModalAlterarStatus } from '../components/modals/visaoGeral/ModalAlterarStatus'
import { ModalConfirmar } from '../components/modals/global/ModalConfirmar'
import { ListaReceber } from '../components/ui/visaoGeral/ListaReceber'
import { CardsResumo } from '../components/ui/visaoGeral/CardsResumo'
import { PeriodoNav } from '../components/ui/visaoGeral/PeriodoNav'
import { ListaPagar } from '../components/ui/visaoGeral/ListaPagar'
import { ModalForm } from '../components/modals/visaoGeral/ModalForm'
import { AcoesBar } from '../components/ui/visaoGeral/AcoesBar'
import { invoke } from '@tauri-apps/api/core'

export function VisaoGeral() {
  const [periodo, setPeriodo] = useState(periodoAtual)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [totais, setTotais] = useState<Totais>({ total_pagar: 0, total_receber: 0, diferenca: 0 })
  const [selecionado, setSelecionado] = useState<Registro | null>(null)
  const [modal, setModal] = useState<ModalVisaoGeral>(null)

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
    <main className="flex-1 px-8 py-6 flex flex-col gap-6 overflow-auto">
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
        onAlterarStatus={() => selecionado && setModal('alterar_status')}
        onAlterarPrioridade={() => selecionado && setModal('alterar_prioridade')}
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

      {modal === 'criar' && (
        <ModalForm
          titulo="Criar registro"
          periodo={periodo}
          onConfirmar={async (dados) => {
            await invoke('criar_registro', {
              periodo,
              tipo: dados.tipo,
              descricao: dados.descricao,
              dataVencimento: dados.data_vencimento,
              valorTotal: dados.valor_total,
              valorRealizado: dados.valor_realizado,
            })
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
            await invoke('alterar_registro', {
              id: selecionado.id,
              tipo: dados.tipo,
              descricao: dados.descricao,
              dataVencimento: dados.data_vencimento,
              valorTotal: dados.valor_total,
              valorRealizado: dados.valor_realizado,
            })
            await carregar()
            fecharModal()
          }}
          onCancelar={fecharModal}
        />
      )}

      {modal === 'alterar_status' && selecionado && (
        <ModalAlterarStatus
          registro={selecionado}
          onConfirmar={async (dados) => {
            await invoke('alterar_status', {
              id: selecionado.id,
              statusPagamento: dados.status_pagamento,
              valorRealizado: dados.valor_realizado,
              observacao: dados.observacao,
            })
            await carregar()
            setSelecionado(null)
            fecharModal()
          }}
          onCancelar={() => { setSelecionado(null); fecharModal() }}
        />
      )}

      {modal === 'alterar_prioridade' && selecionado && (
        <ModalConfirmar
          titulo="Alterar Prioridade"
          mensagem="Deseja mesmo alterar a prioridade desse pagamento?"
          variante="warning"
          textoBotao="Alterar"
          onConfirmar={async () => {
            await invoke('alterar_prioridade', {
              id: selecionado.id,
              prioridade: !selecionado.prioridade,
            })
            await carregar()
            setSelecionado(null)
            fecharModal()
          }}
          onCancelar={() => { setSelecionado(null); fecharModal() }}
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
    </main>
  )
}
