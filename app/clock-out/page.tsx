'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react'

export default function ClockOutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [clockInTime, setClockInTime] = useState<string>('7:52 AM')

  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)

  useEffect(() => {
    const storedTime = sessionStorage.getItem('clockInTime')
    if (storedTime) {
      setClockInTime(storedTime)
    }
  }, [])

  const handleClockOut = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      sessionStorage.removeItem('clockInTime')
      setShowSuccess(true)
    }, 300)
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push('/home')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, router])

  const clockOutTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 fade-in">
        <div className="text-center">
          <div className="w-28 h-28 border-4 border-primary-container flex items-center justify-center mx-auto mb-8 check-pop">
            <Check className="w-14 h-14 text-primary-container" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-5xl font-bold text-on-surface mb-3 uppercase tracking-tighter">{"YOU'RE OUT"}</h1>
          <p className="text-on-surface-variant font-mono text-xs uppercase tracking-widest">{clockInTime} — {clockOutTime}</p>
          <p className="text-primary-container font-heading text-3xl font-bold mt-4 tracking-tighter">8.5 HOURS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-3.5rem-4.25rem)] bg-background flex flex-col">
      {/* Transactional Header */}
      <header className="sticky top-0 w-full z-50 bg-background safe-top shrink-0">
        <div className="h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home"><ArrowLeft className="w-5 h-5 text-on-surface" /></Link>
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">CLOCK OUT / CONFIRM</span>
          </div>
        </div>
        <div className="w-full h-2 bg-surface-container-low">
          <div className="h-full bg-primary-container w-full transition-all duration-300" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col px-6 py-5">
        <div className="mt-4 mb-6">
          <h1 className="font-heading text-6xl font-bold tracking-tighter uppercase leading-[0.85] text-on-surface">
            END YOUR<br />SHIFT?
          </h1>
        </div>

        {/* Job */}
          <div className="bg-secondary-fixed text-on-secondary-fixed p-6 border-l-12 border-primary-container mb-4">
          <p className="font-mono text-[10px] uppercase opacity-60 mb-2">CURRENT ASSIGNMENT</p>
          <h3 className="font-heading text-2xl font-bold leading-tight">{assignedJob?.name}</h3>
          <p className="font-sans text-sm opacity-70 mt-1">{assignedJob?.city}, {assignedJob?.state}</p>
        </div>

        {/* Time summary */}
          <div className="bg-surface-container-low p-6 mb-4">
          <div className="flex items-center gap-4 mb-5">
            <Clock className="w-5 h-5 text-green shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">CLOCKED IN</p>
              <p className="font-heading text-2xl font-bold text-on-surface tracking-tighter">{clockInTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-on-surface-variant shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">CURRENT TIME</p>
              <p className="font-heading text-2xl font-bold text-on-surface tracking-tighter">{clockOutTime}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="shrink-0 safe-bottom border-t-2 border-surface-container-low">
        <button
          onClick={handleClockOut}
          disabled={isSubmitting}
          className="w-full h-20 bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-between px-10 disabled:opacity-40 btn-press transition-colors"
        >
          <span className="font-heading text-4xl font-bold tracking-tighter uppercase">
            {isSubmitting ? 'CLOCKING OUT...' : 'CLOCK OUT'}
          </span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </footer>
    </div>
  )
}