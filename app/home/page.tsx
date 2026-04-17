'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { workers, jobs } from '@/lib/data'


export default function HomePage() {
  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<string | null>(null)

  useEffect(() => {
    const storedTime = sessionStorage.getItem('clockInTime')
    if (storedTime) {
      setIsClockedIn(true)
      setClockInTime(storedTime)
    }
  }, [])

  const firstName = worker.name.split(' ')[0].toUpperCase()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 max-w-lg mx-auto w-full pt-4 pb-24 px-6 flex flex-col">

        {/* Greeting */}
        <section className="mb-6 card-stagger" style={{"--card-i": 0} as React.CSSProperties}>
          <h1 className="font-heading text-5xl font-bold leading-none tracking-tighter uppercase mb-3 text-on-surface">
            {greeting},<br />{firstName}
          </h1>

        </section>

        {/* Current Assignment */}
        {assignedJob && (
          <section className="mb-5 card-stagger" style={{"--card-i": 1} as React.CSSProperties}>
            <p className="font-mono text-xs tracking-[0.2em] mb-4 text-primary-container uppercase">CURRENT ASSIGNMENT</p>
            <div className="bg-secondary-fixed text-on-secondary-fixed p-6 border-l-12 border-primary-container relative overflow-hidden">
              <h2 className="font-heading text-3xl font-bold leading-tight mb-4 uppercase">{assignedJob.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase opacity-60 mb-1">LOCATION</p>
                  <p className="font-sans font-bold text-sm">{assignedJob.city}, {assignedJob.state}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase opacity-60 mb-1">PROJECT MANAGER</p>
                  <p className="font-sans font-bold text-sm">{assignedJob.pm}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Primary CTA */}
        <section className="flex flex-col gap-6 min-h-56 mb-4 card-stagger" style={{"--card-i": 2} as React.CSSProperties}>
          {isClockedIn ? (
            <>
              <div className="bg-surface-container-low border-l-4 border-l-green p-5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl text-green">schedule</span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-green">CLOCKED IN</p>
                    <p className="font-mono text-sm text-on-surface-variant">{clockInTime}</p>
                  </div>
                </div>
              </div>
              <Link href="/clock-out" className="block grow">
                <button className="w-full h-full min-h-50 bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex flex-col items-center justify-center gap-4 transition-colors btn-press">
                  <span className="material-symbols-outlined text-4xl opacity-70" style={{fontVariationSettings: "'FILL' 1"}}>stop_circle</span>
                  <span className="font-heading text-6xl font-bold tracking-tighter leading-none uppercase">CLOCK OUT</span>
                  <p className="font-mono text-xs tracking-widest uppercase opacity-60">END SHIFT</p>
                </button>
              </Link>
            </>
          ) : (
            <Link href="/clock-in" className="block grow">
              <button className="w-full h-full min-h-52 bg-primary-container hover:bg-primary text-on-primary-container flex flex-col items-center justify-center gap-4 transition-colors btn-press p-6">
                <span className="font-heading text-6xl font-bold tracking-tighter leading-none uppercase">CLOCK IN</span>
                <p className="font-mono text-xs tracking-widest uppercase opacity-70 flex items-center gap-2">SHIFT START <span className="material-symbols-outlined text-base">play_arrow</span></p>
              </button>
            </Link>
          )}

          <Link href="/daily-report" className="block">
            <button className="w-full h-20 bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container text-on-surface flex items-center justify-center gap-3 transition-colors">
              <span className="material-symbols-outlined text-xl">edit_note</span>
              <span className="font-heading text-2xl font-bold tracking-tighter uppercase">DAILY REPORT</span>
            </button>
          </Link>
        </section>


      </main>

    </div>
  )
}
