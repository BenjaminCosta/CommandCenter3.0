'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft, Check, Clock } from 'lucide-react'

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

  // Auto-navigate after success
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 fade-in">
        <div className="text-center">
          <div className="w-28 h-28 border-4 border-orange rounded-full flex items-center justify-center mx-auto mb-8 check-pop">
            <Check className="w-14 h-14 text-orange" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-4xl font-bold text-svc-white mb-3">
            {"You're Out"}
          </h1>
          <p className="text-svc-white/70 font-mono text-lg">
            {clockInTime} - {clockOutTime}
          </p>
          <p className="text-orange font-heading text-2xl font-bold mt-4">
            8.5 hours
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <Link href="/home" className="mr-4 min-h-[48px] min-w-[48px] flex items-center justify-center -ml-3">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide">
            Clock Out
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col">
        {/* Session Info */}
        <div className="flex-1">
          {/* Job */}
          <div className="bg-card border-l-4 border-l-orange p-5 mb-6">
            <h3 className="font-heading text-xl font-bold text-black">
              {assignedJob?.name}
            </h3>
            <p className="text-muted-foreground mt-1">
              {assignedJob?.city}, {assignedJob?.state}
            </p>
          </div>

          {/* Time Summary */}
          <div className="bg-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-green" />
              <div>
                <p className="text-sm text-muted-foreground font-mono uppercase">Clocked In</p>
                <p className="font-heading text-2xl font-bold text-black">{clockInTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-grey" />
              <div>
                <p className="text-sm text-muted-foreground font-mono uppercase">Current Time</p>
                <p className="font-heading text-2xl font-bold text-black">{clockOutTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clock Out Button */}
        <Button
          onClick={handleClockOut}
          disabled={isSubmitting}
          className="w-full h-16 bg-black hover:bg-black/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide disabled:opacity-40 btn-press"
        >
          {isSubmitting ? 'Clocking Out...' : 'Clock Out'}
        </Button>
      </main>
    </div>
  )
}
