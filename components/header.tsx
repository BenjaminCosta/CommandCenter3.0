interface HeaderProps {
  workerName?: string
  showBackButton?: boolean
  title?: string
}

export function Header({ workerName, title }: HeaderProps) {
  return (
    <header className="bg-background text-on-surface safe-top">
      <div className="max-w-lg mx-auto flex items-center justify-between h-16 px-6">
        <img src="/logo.png" alt="SVC Logo" className="h-10 w-auto" />
        {workerName && (
          <span className="font-mono text-xs font-medium text-on-surface-variant uppercase tracking-widest">{workerName}</span>
        )}
        {title && (
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{title}</span>
        )}
      </div>
      <div className="bg-surface-container-low h-1 w-full" />
    </header>
  )
}
