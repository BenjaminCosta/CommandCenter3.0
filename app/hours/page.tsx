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
          <h1 className="font-heading font-bold text-xl uppercase tracking-tighter text-primary-container">
            My Hours
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full">

        {/* Section label */}
        <div className="flex items-center gap-4 px-5 py-5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
            Timesheet History
          </span>
          <div className="flex-1 h-px bg-surface-container-high" />
        </div>

        {/* Week cards */}
        <div className="flex flex-col gap-0">
          {weeks.map(([sat, entries], idx) => {
            const weekTotal = entries.reduce((s, e) => s + (e.hours ?? 0), 0)
            const isOpen    = openWeeks.has(sat)
            const isCurrent = idx === 0

            return (
              <div key={sat} className="border-b border-surface-container-low">
                {/* Week header row */}
                <button
                  onClick={() => toggleWeek(sat)}
                  className="w-full flex items-center gap-0 hover:bg-surface-container transition-colors text-left"
                >
                  {/* Left accent bar */}
                  <div
                    className={`w-1.5 self-stretch shrink-0 ${
                      isCurrent ? 'bg-primary-container' : 'bg-on-secondary-fixed/20'
                    }`}
                  />

                  <div className="flex-1 flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">
                        {isCurrent ? 'Current Period' : 'Week ending'}
                      </p>
                      <p className="font-mono text-sm font-medium text-on-surface">
                        {formatWeekLabel(sat)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-bold text-2xl text-primary-container tracking-tighter">
                        {weekTotal.toFixed(1)}{' '}
                        <span className="text-sm font-mono text-on-surface-variant">hrs</span>
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded entries */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant">
                          <th className="font-mono text-[10px] uppercase tracking-widest text-left px-5 py-2 w-[35%]">
                            Job
                          </th>
                          <th className="font-mono text-[10px] uppercase tracking-widest text-left px-3 py-2">
                            Date
                          </th>
                          <th className="font-mono text-[10px] uppercase tracking-widest text-left px-3 py-2">
                            In → Out
                          </th>
                          <th className="font-mono text-[10px] uppercase tracking-widest text-right px-5 py-2">
                            Hrs
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map(entry => {
                          const jobName = jobs.find(j => j.id === entry.jobId)?.name ?? entry.jobId
                          return (
                            <tr
                              key={entry.id}
                              className="border-t border-surface-container-low"
                            >
                              <td className="px-5 py-3 font-sans text-xs text-on-surface font-semibold truncate max-w-0 w-[35%]">
                                {jobName}
                              </td>
                              <td className="px-3 py-3 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                                {formatEntryDate(entry.date)}
                              </td>
                              <td className="px-3 py-3 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                                {formatTime(entry.clockIn)}
                                {entry.clockOut ? ` → ${formatTime(entry.clockOut)}` : ' → —'}
                              </td>
                              <td className="px-5 py-3 font-mono text-sm text-primary-container font-bold text-right whitespace-nowrap">
                                {entry.hours != null ? entry.hours.toFixed(1) : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* All-time total */}
        <div className="mx-5 my-8 flex items-center justify-between border-l-4 border-primary-container px-5 py-4 bg-surface-container-low">
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            All-time total
          </span>
          <span className="font-heading font-bold text-3xl text-primary-container tracking-tighter">
            {totalAllTime.toFixed(1)}{' '}
            <span className="font-mono text-sm text-on-surface-variant">hrs</span>
          </span>
        </div>

      </div>
    </div>
  )
}
