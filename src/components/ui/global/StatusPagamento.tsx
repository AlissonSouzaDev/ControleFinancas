type Status = 'pendente' | 'parcial' | 'quitado'
type Tipo = 'a_pagar' | 'a_receber'

const config: Record<Status, { icon: string; label: string | ((tipo: Tipo) => string); className: string }> = {
  pendente: {
    icon: '/icons/x.svg',
    label: 'Pendente',
    className: 'bg-red-600 dark:bg-red-400 text-white',
  },
  parcial: {
    icon: '/icons/minus.svg',
    label: (tipo) => tipo === 'a_pagar' ? 'Pago Parcialmente' : 'Recebido Parcialmente',
    className: 'bg-blue-600 dark:bg-blue-400 text-white',
  },
  quitado: {
    icon: '/icons/check.svg',
    label: 'Quitado',
    className: 'bg-green-600 dark:bg-green-400 text-white',
  },
}

export function StatusPagamento({ status, tipo }: { status: Status; tipo: Tipo }) {
  const { icon, label, className } = config[status]
  const tooltip = typeof label === 'function' ? label(tipo) : label

  return (
    <div className="relative group flex justify-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${className}`}>
        <img src={icon} className="w-3 h-3" />
      </div>
      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {tooltip}
      </div>
    </div>
  )
}
