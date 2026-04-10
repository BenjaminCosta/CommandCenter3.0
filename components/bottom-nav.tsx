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
    <nav className="fixed bottom-0 left-0 right-0 bg-background safe-bottom z-50">
      <div className="bg-surface-container-low h-2 w-full" />
      <div className="max-w-lg mx-auto flex items-stretch justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`}
                strokeWidth={1.5}
              />
              <span
                className={`text-[10px] font-mono uppercase tracking-widest ${
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
