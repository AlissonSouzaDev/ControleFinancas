import { useState } from 'react'
import { Overlay } from '../ui/Overlay'
import { Trash2 } from 'lucide-react'

interface ModalConfirmarProps {
  titulo: string
  mensagem: string
  onConfirmar: () => Promise<void>
  onCancelar: () => void
}

export function ModalConfirmar({ titulo, mensagem, onConfirmar, onCancelar }: ModalConfirmarProps) {
  const [loading, setLoading] = useState(false)

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
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
            <Trash2 size={24} className="text-red-500" />
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
            className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            Apagar
          </button>
        </div>
      </div>
    </Overlay>
  )
}
