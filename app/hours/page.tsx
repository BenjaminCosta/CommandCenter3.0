'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { workers, timeEntries, jobs, formatTime } from '@/lib/data'

// ─── Week grouping helpers ────────────────────────────────────────────────────
/** Returns the ISO date string of the Saturday on-or-after a given date string */
function saturdayOf(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  const day = d.getUTCDay() // 0=Sun … 6=Sat
  const daysToSat = (6 - day + 7) % 7
  d.setUTCDate(d.getUTCDate() + daysToSat)
  return d.toISOString().slice(0, 10)
}

function formatWeekLabel(satIso: string): string {
  return new Date(satIso + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatEntryDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HoursPage() {
  const router = useRouter()
  const worker = workers[0]

  // All entries for this worker, newest first
  const myEntries = timeEntries
    .filter(e => e.workerId === worker.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  // Group by week-ending Saturday
  const weekMap = new Map<string, typeof myEntries>()
  for (const entry of myEntries) {
    const sat = saturdayOf(entry.date)
    if (!weekMap.has(sat)) weekMap.set(sat, [])
    weekMap.get(sat)!.push(entry)
  }

  // Sort weeks descending
  const weeks = [...weekMap.entries()].sort(([a], [b]) => b.localeCompare(a))

  const totalAllTime = myEntries.reduce((s, e) => s + (e.hours ?? 0), 0)

  const [openWeeks, setOpenWeeks] = useState<Set<string>>(
    new Set(weeks.length ? [weeks[0][0]] : [])
  )

  const toggleWeek = (sat: string) => {
    setOpenWeeks(prev => {
      const next = new Set(prev)
      if (next.has(sat)) next.delete(sat)
      else next.add(sat)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-surface-container-low z-10 shrink-0">
        <div className="max-w-lg mx-auto h-14 flex items-center px-5 gap-4">
          <button onClick={() => router.back()} className="text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-heading font-bold text-2xl uppercase tracking-tighter text-primary-container">
            My Hours
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full">

        {/* All-time total — hero bar */}
        <div className="bg-secondary-fixed border-l-8 border-tertiary px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-secondary-fixed/50 mb-1">All-time Total</p>
            <p className="font-heading font-bold text-5xl uppercase tracking-tighter text-on-secondary-fixed leading-none">
              {totalAllTime.toFixed(1)}
              <span className="font-mono text-base text-on-secondary-fixed/50 ml-2">hrs</span>
            </p>
          </div>
          <span className="material-symbols-outlined text-4xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-4 px-5 py-4">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
            Timesheet History
          </span>
          <div className="flex-1 h-px bg-surface-container-high" />
        </div>

        {/* Week cards */}
        <div className="flex flex-col gap-0 px-5 pb-8">
          {weeks.map(([sat, entries], idx) => {
            const weekTotal = entries.reduce((s, e) => s + (e.hours ?? 0), 0)
            const isOpen    = openWeeks.has(sat)
            const isCurrent = idx === 0

            return (
              <div key={sat} className="mb-3">
                {/* Week header — cream card */}
                <button
                  onClick={() => toggleWeek(sat)}
                  className="w-full bg-secondary-fixed hover:bg-secondary-fixed-dim transition-colors text-left"
                >
                  <div className="flex items-stretch">
                    <div className={`w-1.5 shrink-0 ${isCurrent ? 'bg-primary-container' : 'bg-on-secondary-fixed/20'}`} />
                    <div className="flex-1 flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-on-secondary-fixed/50 mb-0.5">
                          {isCurrent ? 'Current Period' : 'Week ending'}
                        </p>
                        <p className="font-heading font-bold text-2xl uppercase tracking-tighter text-on-secondary-fixed leading-none">
                          {formatWeekLabel(sat)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-on-secondary-fixed/50 mb-0.5">Total</p>
                          <p className="font-heading font-bold text-2xl text-primary-container tracking-tighter leading-none">
                            {weekTotal.toFixed(1)}
                            <span className="font-mono text-xs text-on-secondary-fixed/40 ml-1">hrs</span>
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-on-secondary-fixed/40">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded entries */}
                {isOpen && (
                  <div className="bg-secondary-fixed border-t border-on-secondary-fixed/10">
                    {entries.map((entry, i) => {
                      const jobName = jobs.find(j => j.id === entry.jobId)?.name ?? entry.jobId
                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-0 ${
                            i > 0 ? 'border-t border-on-secondary-fixed/10' : ''
                          }`}
                        >
                          <div className="w-1.5 shrink-0 bg-transparent" />
                          <div className="flex-1 flex items-center justify-between px-5 py-3 gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="font-heading font-bold text-base uppercase tracking-tighter text-on-secondary-fixed leading-none truncate">
                                {jobName}
                              </p>
                              <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-wider mt-0.5">
                                {formatEntryDate(entry.date)}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-mono text-[11px] text-on-secondary-fixed/60 uppercase">
                                {formatTime(entry.clockIn)}{entry.clockOut ? ` → ${formatTime(entry.clockOut)}` : ' → —'}
                              </p>
                              <p className="font-heading font-bold text-xl text-primary-container tracking-tighter leading-none mt-0.5">
                                {entry.hours != null ? entry.hours.toFixed(1) : '—'}
                                <span className="font-mono text-[10px] text-on-secondary-fixed/40 ml-1">hrs</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
