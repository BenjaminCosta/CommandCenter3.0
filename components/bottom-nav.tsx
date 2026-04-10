'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, FileText, Users, LayoutGrid } from 'lucide-react'

type ActiveTab = 'home' | 'reports' | 'rolodex' | 'admin'

interface BottomNavProps {
  active: ActiveTab
}

export function BottomNav({ active }: BottomNavProps) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('userRole') === 'admin')
  }, [])

  const baseItems = [
    { id: 'home' as const, label: 'Home', icon: Home, href: '/home' },
    { id: 'reports' as const, label: 'Reports', icon: FileText, href: '/reports' },
    { id: 'rolodex' as const, label: 'Rolodex', icon: Users, href: '/rolodex' },
  ]

  const adminItem = { id: 'admin' as const, label: 'Admin', icon: LayoutGrid, href: '/admin' }

  const navItems = isAdmin ? [...baseItems, adminItem] : baseItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-svc-white border-t border-border safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 min-h-12 min-w-16 px-4"
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'text-black' : 'text-grey'}`}
                strokeWidth={1.5}
              />
              <span
                className={`text-xs font-medium font-heading uppercase tracking-wide ${
                  isActive ? 'text-black' : 'text-grey'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
