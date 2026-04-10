interface HeaderProps {
  workerName?: string
  showBackButton?: boolean
  title?: string
}

export function Header({ workerName, title }: HeaderProps) {
  return (
    <header className="bg-black text-svc-white safe-top">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <h1 className="font-heading text-3xl font-bold text-orange tracking-tight">SVC</h1>
        {workerName && (
          <span className="text-sm font-medium text-svc-white">{workerName}</span>
        )}
        {title && (
          <span className="text-sm font-semibold uppercase tracking-wide text-svc-white">{title}</span>
        )}
      </div>
    </header>
  )
}
