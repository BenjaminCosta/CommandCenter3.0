'use client'

import { useState, useEffect, useCallback, memo, useRef } from 'react'
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
  if (pathname.startsWith('/admin/jobs'))    return 'dashboard'
  if (pathname.startsWith('/admin/supers'))  return 'supers'
  if (pathname.startsWith('/admin/reports')) return 'reports'
  if (pathname.startsWith('/profile'))       return 'profile'
  return 'dashboard'
}

// ─── Navigation direction tracking ───────────────────────────────────────────
const TAB_PAGES = new Set([
  '/home', '/reports', '/rolodex', '/profile',
  '/admin', '/admin/supers', '/admin/reports',
])

function getNavDirection(from: string, to: string): 'forward' | 'back' | 'tab' {
  if (!from || from === '/') return 'forward'
  const fromIsTab = TAB_PAGES.has(from)
  const toIsTab   = TAB_PAGES.has(to)
  if (fromIsTab && toIsTab)  return 'tab'
  if (fromIsTab && !toIsTab) return 'forward'
  if (!fromIsTab && toIsTab) return 'back'
  return 'forward'
}

// ─── Shared bottom nav bar ────────────────────────────────────────────────────
const BottomNavBar = memo(function BottomNavBar({
  items,
  activeId,
}: {
  items: ReadonlyArray<{ id: string; label: string; icon: string; href: string; fillOnActive?: boolean }>
  activeId: string
}) {
  const activeIndex = items.findIndex(i => i.id === activeId)
  const tabWidth    = 100 / items.length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="relative max-w-lg mx-auto flex items-stretch justify-around h-14 bg-background border-t border-surface-container-low">
        {/* Sliding active indicator bar */}
        <div
          className="absolute top-0 h-0.5 bg-primary-container transition-[left] duration-250 ease-in-out"
          style={{ width: `${tabWidth}%`, left: `${activeIndex * tabWidth}%`, opacity: activeIndex >= 0 ? 1 : 0 }}
        />
        {items.map((item) => {
          const isActive = activeId === item.id

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors hover:bg-surface-container ${
                isActive ? 'bg-surface-container-low' : ''
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-200 ${
                  isActive ? '-translate-y-0.5 text-primary-container' : 'text-on-surface-variant'
                }`}
                style={isActive && item.fillOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`font-heading font-bold text-[10px] uppercase tracking-tighter ${
                isActive ? 'text-primary-container' : 'text-on-surface-variant'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
})

// ─── Unified topbar (logo + worker name + optional admin toggle) ──────────────
const Topbar = memo(function Topbar({
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
})

// ─── Main export ──────────────────────────────────────────────────────────────
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole]               = useState<UserRole>('worker')
  const [isAdminView, setIsAdminView] = useState(false)
  const [isDesktop, setIsDesktop]     = useState(false)
  const [mounted, setMounted]         = useState(false)

  const pathname = usePathname()
  const router   = useRouter()

  // Track navigation direction for page-enter animations
  const prevPathnameRef = useRef(pathname)
  useEffect(() => {
    const direction = getNavDirection(prevPathnameRef.current, pathname)
    document.documentElement.dataset.navDirection = direction
    prevPathnameRef.current = pathname
  }, [pathname])

  const worker = workers[0]

  // Re-read sessionStorage whenever pathname changes so that a login redirect
  // (/ → /admin) picks up the role written just before router.push().
  useEffect(() => {
    const storedRole = (sessionStorage.getItem('userRole') as UserRole) || 'worker'
    const storedView = sessionStorage.getItem('adminViewActive')
    // Admins default to admin view unless they explicitly toggled it off
    const resolvedAdminView = storedRole === 'admin'
      ? (storedView === null ? true : storedView === 'true')
      : false

    setRole(storedRole)
    setIsAdminView(resolvedAdminView)
    setMounted(true)
  }, [pathname])

  // Desktop detection — runs once, persists across navigations
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024)
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
            <button
              onClick={() => { sessionStorage.clear(); router.push('/') }}
              className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors w-full text-left"
            >
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
          <main key={pathname} className="flex-1 page-root">
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
    // Login route: render bare — no shared topbar or bottom nav
    if (pathname === '/') {
      return <div className="min-h-dvh bg-background">{children}</div>
    }
    return (
      <div className="mobile-shell min-h-dvh bg-background flex flex-col">
        <Topbar
          workerName={worker.name}
          isAdmin={isAdmin}
          isAdminView={false}
          onToggle={toggleAdminView}
        />
        <div key={pathname} className="flex-1 pb-14 page-root">
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
      <div key={pathname} className="flex-1 pb-14 page-root">
        {children}
      </div>
      <BottomNavBar items={adminNavItems} activeId={adminActive} />
    </div>
  )
}
