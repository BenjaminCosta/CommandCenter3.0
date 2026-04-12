'use client'

import Link from 'next/link'

type ActiveTab = 'home' | 'reports' | 'rolodex' | 'profile' | 'admin'

interface BottomNavProps {
  active: ActiveTab
}

const navItems: { id: ActiveTab; label: string; icon: string; href: string; fillOnActive?: boolean }[] = [
  { id: 'home',    label: 'Home',    icon: 'home',         href: '/home',    fillOnActive: true },
  { id: 'reports', label: 'Reports', icon: 'analytics',    href: '/reports' },
  { id: 'rolodex', label: 'Rolodex', icon: 'contact_page', href: '/rolodex' },
  { id: 'profile', label: 'Profile', icon: 'person',       href: '/profile', fillOnActive: true },
]

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-stretch justify-around h-20 bg-background">
        {navItems.map((item) => {
          const isActive = active === item.id
          // Profile active = orange bg; others active = highlighted text
          if (isActive && item.id === 'profile') {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 w-full h-full bg-primary-container text-on-primary-container"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={item.fillOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-heading font-bold text-xs uppercase tracking-tighter">
                  {item.label}
                </span>
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
                className={`material-symbols-outlined text-2xl ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`}
                style={isActive && item.fillOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span
                className={`font-heading font-bold text-xs uppercase tracking-tighter ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
