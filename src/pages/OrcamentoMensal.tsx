import { periodoAtual, navegarPeriodo, periodoLabel } from '../utils/formatters'
import { Pagamento, Totais, ModalOrcamentoMensal } from '../types'
import { useState, useEffect, useCallback } from 'react'
import { ModalAlterarStatus } from '../components/modals/orcamentoMensal/ModalAlterarStatus'
import { ModalConfirmar } from '../components/modals/global/ModalConfirmar'
import { ListaReceber } from '../components/ui/orcamentoMensal/ListaReceber'
import { CardsResumo } from '../components/ui/orcamentoMensal/CardsResumo'
import { PeriodoNav } from '../components/ui/orcamentoMensal/PeriodoNav'
import { ListaPagar } from '../components/ui/orcamentoMensal/ListaPagar'
import { ModalForm } from '../components/modals/orcamentoMensal/ModalForm'
import { AcoesBar } from '../components/ui/orcamentoMensal/AcoesBar'
import { invoke } from '@tauri-apps/api/core'

export function OrcamentoMensal() {
  const [periodo, setPeriodo] = useState(periodoAtual)
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [totais, setTotais] = useState<Totais>({ total_pagar: 0, total_receber: 0, diferenca: 0 })
  const [selecionado, setSelecionado] = useState<Pagamento | null>(null)
  const [modal, setModal] = useState<ModalOrcamentoMensal>(null)

  const carregar = useCallback(async () => {
    const [regs, tots] = await Promise.all([
      invoke<Pagamento[]>('listar_registros', { periodo }),
      invoke<Totais>('buscar_totais', { periodo }),
    ])
    setPagamentos(regs)
    setTotais(tots)
  }, [periodo])

  useEffect(() => { carregar() }, [carregar])

  function fecharModal() { setModal(null) }

  const aPagar = pagamentos.filter(r => r.tipo === 'a_pagar')
  const aReceber = pagamentos.filter(r => r.tipo === 'a_receber')

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
          pagamentos={aPagar}
          selecionado={selecionado?.id ?? null}
          onSelecionar={(r: Pagamento | null) => setSelecionado(selecionado?.id === r?.id ? null : r)}
        />
        <ListaReceber
          recebimentos={aReceber}
          selecionado={selecionado?.id ?? null}
          onSelecionar={(r: Pagamento | null) => setSelecionado(selecionado?.id === r?.id ? null : r)}
        />
      </div>

      {modal === 'criar' && (
        <ModalForm
          titulo="Criar Pagamento"
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
          titulo="Alterar Pagamento"
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
          titulo="Apagar Pagamento"
          mensagem="Deseja mesmo apagar este Pagamento? Esta ação é permanente e não poderá ser desfeita em seu ledger financeiro."
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
          mensagem={`Deseja apagar todos os pagamentos de ${periodoLabel(periodo)}? Esta ação é permanente.`}
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
