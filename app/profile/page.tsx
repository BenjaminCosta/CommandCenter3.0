'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { workers, jobs, timeEntries } from '@/lib/data'

export default function ProfilePage() {
  const router = useRouter()
  const worker = workers[0]
  const [currentJobId, setCurrentJobId] = useState(worker.assignedJobId)

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('currentJobId')
    if (stored) setCurrentJobId(stored)
  }, [])

  const job = jobs.find(j => j.id === currentJobId)
  const initials = worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const canChangeJob = worker.appLevel === 'Master' || worker.appLevel === 'Neo'

  // Weekly hours: entries this calendar week (Mon–Sun)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  startOfWeek.setHours(0, 0, 0, 0)
  const weeklyHours = timeEntries
    .filter(e => e.workerId === worker.id && new Date(e.date + 'T12:00:00') >= startOfWeek)
    .reduce((s, e) => s + (e.hours ?? 0), 0)

  const menuItems = [
    { label: 'My Hours', href: '/hours', icon: 'schedule' },
    { label: 'Current Job', href: '/profile/current-job', icon: 'construction' },
    ...(canChangeJob
      ? [{ label: 'Change Current Job', href: '/profile/change-job', icon: 'swap_horiz' }]
      : []),
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 max-w-lg mx-auto w-full pb-28">

        {/* Hero section */}
        <section className="flex flex-col items-center py-10 px-6 bg-background border-b border-surface-container-low">
          {/* Avatar */}
          <div className="w-28 h-28 bg-primary-container flex items-center justify-center mb-5">
            <span className="font-heading font-bold text-5xl tracking-tighter text-on-primary-container leading-none">
              {initials}
            </span>
          </div>
          {/* Identity */}
          <h1 className="font-heading font-bold text-4xl uppercase tracking-tighter text-on-surface text-center">
            {worker.name}
          </h1>
          {job && (
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-1 text-center">
              {job.name}
            </p>
          )}
          {/* appLevel badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low">
            <div className="w-2 h-2 bg-tertiary shrink-0" />
            <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest">
              {worker.appLevel}
            </span>
          </div>
        </section>

        {/* Stats bento */}
        <section className="px-6 grid grid-cols-2 gap-3 pt-6 pb-2">
          <div className="bg-surface-container-low p-5 flex flex-col justify-between h-28">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              This Week
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-4xl text-on-surface leading-none">
                {weeklyHours.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-primary-container">HRS</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 flex flex-col justify-between h-28">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              App Level
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-4xl text-on-surface leading-none">
                {worker.appLevel}
              </span>
              <span className="material-symbols-outlined text-tertiary text-xl">verified</span>
            </div>
          </div>
        </section>

        {/* Menu list — cream (secondary-fixed) buttons */}
        <nav className="flex flex-col gap-3 px-6 pt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between bg-secondary-fixed px-6 py-6 hover:bg-secondary-fixed-dim transition-colors text-on-secondary-fixed btn-press"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-2xl text-on-secondary-fixed">{item.icon}</span>
                <span className="font-heading font-bold text-2xl uppercase tracking-tighter">
                  {item.label}
                </span>
              </div>
              <span className="material-symbols-outlined text-primary-container font-bold">chevron_right</span>
            </Link>
          ))}
        </nav>

        {/* Log Out — orange CTA */}
        <div className="px-6 pt-8">
          <button
            onClick={handleLogout}
            className="w-full h-16 bg-primary-container hover:bg-primary flex items-center justify-center gap-3 text-on-primary-container btn-press transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-heading font-bold text-2xl uppercase tracking-tighter">Log Out</span>
          </button>
        </div>

      </main>

    </div>
  )
}
