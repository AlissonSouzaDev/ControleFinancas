import { ModalConfirmarProps } from '../../../types'
import { useState } from 'react'
import { Overlay } from '../../ui/global/Overlay'
import { Trash2, Star } from 'lucide-react'

const variantes = {
  danger: {
    iconeBg: 'bg-red-100 dark:bg-red-900/30',
    iconeColor: 'text-red-500',
    Icone: Trash2,
    botaoClass: 'bg-red-500 hover:bg-red-600 text-white',
    textoPadrao: 'Apagar',
  },
  warning: {
    iconeBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconeColor: 'text-yellow-500',
    Icone: Star,
    botaoClass: 'bg-yellow-600 hover:bg-yellow-500 text-white',
    textoPadrao: 'Confirmar',
  },
}

export function ModalConfirmar({ titulo, mensagem, variante = 'danger', textoBotao, onConfirmar, onCancelar }: ModalConfirmarProps) {
  const [loading, setLoading] = useState(false)
  const v = variantes[variante]

  async function handleConfirmar() {
    setLoading(true)
    try {
      await onConfirmar()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 text-center transition-colors">
        <div className="flex justify-center mb-4">
          <div className={`${v.iconeBg} p-3 rounded-full`}>
            <v.Icone size={24} className={v.iconeColor} />
          </div>
        </div>
        <h2 className="text-lg font-bold text-[#1C2B3A] dark:text-white mb-2">{titulo}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{mensagem}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${v.botaoClass}`}
          >
            {textoBotao ?? v.textoPadrao}
          </button>
        </div>
      </div>
    </Overlay>
  )
}
