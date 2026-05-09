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
import { supabase } from '../lib/supabase'

export function OrcamentoMensal() {
  const [periodo, setPeriodo] = useState(periodoAtual)
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [totais, setTotais] = useState<Totais>({ total_pagar: 0, total_receber: 0, diferenca: 0 })
  const [selecionado, setSelecionado] = useState<Pagamento | null>(null)
  const [modal, setModal] = useState<ModalOrcamentoMensal>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('orcamento_mensal')
      .select('*')
      .eq('periodo', periodo)
      .order('tipo')
      .order('criado_em')
    if (error) throw error
    const regs = (data ?? []) as Pagamento[]
    setPagamentos(regs)
    const total_pagar = regs.filter(r => r.tipo === 'a_pagar').reduce((s, r) => s + r.valor_total, 0)
    const total_receber = regs.filter(r => r.tipo === 'a_receber').reduce((s, r) => s + r.valor_total, 0)
    setTotais({ total_pagar, total_receber, diferenca: total_receber - total_pagar })
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
            const { error } = await supabase.from('orcamento_mensal').insert({
              periodo,
              tipo: dados.tipo,
              descricao: dados.descricao,
              data_vencimento: dados.data_vencimento,
              valor_total: dados.valor_total,
              valor_realizado: dados.valor_realizado ?? 0,
            })
            if (error) throw error
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
            const { error } = await supabase.from('orcamento_mensal').update({
              tipo: dados.tipo,
              descricao: dados.descricao,
              data_vencimento: dados.data_vencimento,
              valor_total: dados.valor_total,
              valor_realizado: dados.valor_realizado ?? 0,
              alterado_em: new Date().toISOString(),
            }).eq('id', selecionado.id)
            if (error) throw error
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
            const { error } = await supabase.from('orcamento_mensal').update({
              status_pagamento: dados.status_pagamento,
              valor_realizado: dados.valor_realizado ?? 0,
              observacao: dados.observacao,
              alterado_em: new Date().toISOString(),
            }).eq('id', selecionado.id)
            if (error) throw error
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
            const { error } = await supabase.from('orcamento_mensal').update({
              prioridade: !selecionado.prioridade,
              alterado_em: new Date().toISOString(),
            }).eq('id', selecionado.id)
            if (error) throw error
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
            const { error } = await supabase.from('orcamento_mensal').delete().eq('id', selecionado.id)
            if (error) throw error
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
            const { error } = await supabase.from('orcamento_mensal').delete().eq('periodo', periodo)
            if (error) throw error
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
