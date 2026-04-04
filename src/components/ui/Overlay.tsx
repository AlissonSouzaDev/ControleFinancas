interface OverlayProps {
  children: React.ReactNode
}

export function Overlay({ children }: OverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      {children}
    </div>
  )
}
