'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { workers } from '@/lib/data'

type UserRole = 'worker' | 'admin'

const workerNavItems = [
  { id: 'home',    label: 'Home',    icon: 'home',         href: '/home',    fillOnActive: true },
  { id: 'reports', label: 'Reports', icon: 'analytics',    href: '/reports' },
  { id: 'rolodex', label: 'Rolodex', icon: 'contact_page', href: '/rolodex' },
  { id: 'profile', label: 'Profile', icon: 'person',       href: '/profile', fillOnActive: true },
] as const

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard',    href: '/admin'         },
  { id: 'jobs',      label: 'Jobs',      icon: 'construction', href: '/admin/jobs'    },
  { id: 'supers',    label: 'Supers',    icon: 'groups',       href: '/admin/supers'  },
  { id: 'reports',   label: 'Reports',   icon: 'analytics',    href: '/admin/reports' },
  { id: 'profile',   label: 'Profile',   icon: 'person',       href: '/profile', fillOnActive: true },
] as const

type WorkerNavId = typeof workerNavItems[number]['id']
type AdminNavId  = typeof adminNavItems[number]['id']

function getWorkerActive(pathname: string): WorkerNavId | '' {
  if (pathname.startsWith('/home'))    return 'home'
  if (pathname.startsWith('/reports')) return 'reports'
  if (pathname.startsWith('/rolodex')) return 'rolodex'
  if (pathname.startsWith('/profile')) return 'profile'
  return ''
}

function getAdminActive(pathname: string): AdminNavId | '' {
  if (pathname === '/admin')                 return 'dashboard'
  if (pathname.startsWith('/admin/jobs'))    return 'jobs'
  if (pathname.startsWith('/admin/supers'))  return 'supers'
  if (pathname.startsWith('/admin/reports')) return 'reports'
  if (pathname.startsWith('/profile'))       return 'profile'
  return 'dashboard'
}

// ─── Shared bottom nav bar ────────────────────────────────────────────────────
function BottomNavBar({
  items,
  activeId,
}: {
  items: ReadonlyArray<{ id: string; label: string; icon: string; href: string; fillOnActive?: boolean }>
  activeId: string
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-stretch justify-around h-20 bg-background border-t border-surface-container-low">
        {items.map((item) => {
          const isActive = activeId === item.id

          if (isActive && item.id === 'profile') {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 w-full h-full bg-primary-container text-on-primary-container"
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <span className="font-heading font-bold text-xs uppercase tracking-tighter">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors hover:bg-surface-container ${
                isActive ? 'bg-surface-container-low' : ''
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`}
                style={isActive && item.fillOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`font-heading font-bold text-xs uppercase tracking-tighter ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Unified topbar (logo + worker name + optional admin toggle) ──────────────
function Topbar({
  workerName,
  isAdmin,
  isAdminView,
  onToggle,
}: {
  workerName: string
  isAdmin: boolean
  isAdminView: boolean
  onToggle: () => void
}) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-surface-container-low shrink-0">
      <div className="h-14 flex items-center justify-between px-5 max-w-full">
        <img src="/logo.png" alt="SVC" className="h-9 w-auto" />
        <div className="flex items-center gap-3">
          {!isAdminView && (
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest hidden sm:block">
              {workerName}
            </span>
          )}
          {isAdmin && (
            <button
              onClick={onToggle}
              className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                isAdminView
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
              }`}
            >
              ADMIN VIEW
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole]               = useState<UserRole>('worker')
  const [isAdminView, setIsAdminView] = useState(false)
  const [isDesktop, setIsDesktop]     = useState(false)
  const [mounted, setMounted]         = useState(false)

  const pathname = usePathname()
  const router   = useRouter()

  const worker = workers[0]

  useEffect(() => {
    const storedRole = (sessionStorage.getItem('userRole') as UserRole) || 'worker'
    const storedView = sessionStorage.getItem('adminViewActive') === 'true'
    const desktop    = window.innerWidth >= 1024

    setRole(storedRole)
    setIsAdminView(storedView)
    setIsDesktop(desktop)
    setMounted(true)

    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleAdminView = useCallback(() => {
    const next = !isAdminView
    setIsAdminView(next)
    sessionStorage.setItem('adminViewActive', String(next))
    router.push(next ? '/admin' : '/home')
  }, [isAdminView, router])

  /* Pre-mount shell — avoids hydration mismatch */
  if (!mounted) {
    return <div className="min-h-dvh bg-background">{children}</div>
  }

  const isAdmin      = role === 'admin'
  const workerActive = getWorkerActive(pathname)
  const adminActive  = getAdminActive(pathname)

  // ── ADMIN DESKTOP: fixed left sidebar + topbar with toggle ─────────────────
  if (isAdmin && isDesktop && isAdminView) {
    return (
      <div className="flex min-h-dvh w-full bg-background">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-full w-55 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col z-50">
          {/* Logo in sidebar */}
          <div className="px-6 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
            <img src="/logo.png" alt="SVC" className="h-9 w-auto" />
          </div>

          <nav className="flex-1 py-3 flex flex-col overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = adminActive === item.id
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors border-l-2 ${
                    isActive
                      ? 'border-primary-container text-primary-container bg-surface-container-low'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={
                      isActive && (item as { fillOnActive?: boolean }).fillOnActive
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-heading font-bold text-lg uppercase tracking-tighter">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-[#1a1a1a] px-5 py-4 flex flex-col gap-3">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              {worker.name}
            </p>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors w-full text-left">
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="font-heading font-bold text-base uppercase tracking-tighter">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main content: offset by sidebar width */}
        <div className="ml-55 flex-1 flex flex-col min-h-dvh">
          {/* Topbar with admin toggle */}
          <header className="sticky top-0 z-40 bg-background border-b border-surface-container-low shrink-0">
            <div className="h-14 flex items-center justify-end px-6">
              <button
                onClick={toggleAdminView}
                className="bg-primary-container text-on-primary-container px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-primary"
              >
                EXIT ADMIN VIEW
              </button>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // ── WORKER VIEW (mobile only — admin toggled off, or role=worker) ───────────
  // For admin on mobile with admin view OFF → show worker layout
  // For role=worker → show worker layout
  if (!isAdmin || (isAdmin && !isAdminView)) {
    return (
      <div className="mobile-shell min-h-dvh bg-background flex flex-col">
        <Topbar
          workerName={worker.name}
          isAdmin={isAdmin}
          isAdminView={false}
          onToggle={toggleAdminView}
        />
        <div className="flex-1 pb-20">
          {children}
        </div>
        <BottomNavBar items={workerNavItems} activeId={workerActive} />
      </div>
    )
  }

  // ── ADMIN MOBILE VIEW ON ────────────────────────────────────────────────────
  return (
    <div className="mobile-shell min-h-dvh bg-background flex flex-col">
      <Topbar
        workerName={worker.name}
        isAdmin={isAdmin}
        isAdminView={isAdminView}
        onToggle={toggleAdminView}
      />
      <div className="flex-1 pb-20">
        {children}
      </div>
      <BottomNavBar items={adminNavItems} activeId={adminActive} />
    </div>
  )
}
