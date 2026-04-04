const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function periodoLabel(periodo: string) {
  const [ano, mes] = periodo.split('-')
  return `${MESES[parseInt(mes) - 1]} ${ano}`
}

export function periodoAtual() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  return `${ano}-${mes}`
}

export function navegarPeriodo(periodo: string, direcao: number) {
  const [ano, mes] = periodo.split('-').map(Number)
  const data = new Date(ano, mes - 1 + direcao)
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
}
