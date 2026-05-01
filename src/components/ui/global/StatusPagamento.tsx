import { X, Minus, Check } from 'lucide-react'

type Status = 'pendente' | 'parcial' | 'quitado'

const config: Record<Status, { icon: typeof X; label: string; className: string }> = {
  pendente: {
    icon: X,
    label: 'Pendente',
    className: 'bg-red-600 dark:bg-red-400 text-white',
  },
  parcial: {
    icon: Minus,
    label: 'Pago Parcialmente',
    className: 'bg-blue-600 dark:bg-blue-400 text-white',
  },
  quitado: {
    icon: Check,
    label: 'Quitado',
    className: 'bg-green-600 dark:bg-green-400 text-white',
  },
}

export function StatusPagamento({ status }: { status: Status }) {
  const { icon: Icon, label, className } = config[status]
  return (
    <div className="relative group flex justify-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${className}`}>
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </div>
    </div>
  )
}
