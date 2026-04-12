'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { workers, timeEntries, jobs, formatTime } from '@/lib/data'

/** Returns the ISO date string (YYYY-MM-DD) of the Saturday that ends the week containing dateStr. */
function getWeekEndingSat(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const day = date.getDay() // 0=Sun … 6=Sat
  // Days remaining until Saturday: (6 - day + 7) % 7 handles Sun→+6, Mon→+5, …, Sat→+0
  const daysUntilSat = (6 - day + 7) % 7
  const sat = new Date(date)
  sat.setDate(date.getDate() + daysUntilSat)
  return sat.toISOString().slice(0, 10)
}

function formatWeekLabel(satDateStr: string): string {
  const d = new Date(satDateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatEntryDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function MyHoursPage() {
  const router = useRouter()
  const worker = workers[0]
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set())

  const toggleWeek = (weekEnd: string) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(weekEnd)) next.delete(weekEnd)
      else next.add(weekEnd)
      return next
    })
  }

  // Group this worker's entries by week-ending-Saturday
  const workerEntries = timeEntries.filter(e => e.workerId === worker.id)
  const weekMap = new Map<string, typeof workerEntries>()
  for (const entry of workerEntries) {
    const weekEnd = getWeekEndingSat(entry.date)
    if (!weekMap.has(weekEnd)) weekMap.set(weekEnd, [])
    weekMap.get(weekEnd)!.push(entry)
  }

  const weeks = Array.from(weekMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // newest week first
    .map(([weekEnd, entries]) => ({
      weekEnd,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
      totalHours: entries.reduce((sum, e) => sum + (e.hours ?? 0), 0),
    }))

  const grandTotal = weeks.reduce((sum, w) => sum + w.totalHours, 0)

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-surface-container-low z-10 shrink-0">
        <div className="max-w-lg mx-auto h-14 flex items-center px-5 gap-4">
          <button
            onClick={() => router.back()}
            className="text-primary-container"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-heading font-bold text-2xl uppercase tracking-tighter text-primary-container">
            My Hours
          </h1>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 pt-6 pb-8 flex flex-col gap-4">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] shrink-0">
              Timesheet Archive
            </h3>
            <div className="flex-1 h-px bg-surface-container-high" />
          </div>

          {weeks.length === 0 && (
            <p className="font-mono text-xs text-on-surface-variant text-center py-16">
              No time entries found.
            </p>
          )}

          {weeks.map((week, wi) => {
            const isExpanded = expandedWeeks.has(week.weekEnd)
            const isFirst = wi === 0
            return (
              <div key={week.weekEnd} className="bg-secondary-fixed text-on-secondary-fixed overflow-hidden">

                {/* Week header row */}
                <button
                  onClick={() => toggleWeek(week.weekEnd)}
                  className="w-full flex items-center justify-between p-0 hover:bg-secondary-fixed-dim transition-colors"
                >
                  <div className="flex items-center gap-5 flex-1 px-6 py-5">
                    {/* Orange left accent bar */}
                    <div className={`w-1.5 h-14 shrink-0 ${isFirst ? 'bg-primary-container' : 'bg-on-secondary-fixed/20'}`} />
                    <div className="text-left">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-on-secondary-fixed/60 mb-0.5">
                        Week Ending {formatWeekLabel(week.weekEnd)}
                      </p>
                      <p className="font-heading text-2xl font-bold uppercase tracking-tighter text-on-secondary-fixed leading-tight">
                        {isFirst ? 'Current Period' : 'Submitted'}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 text-right shrink-0">
                    <p className="font-heading font-bold text-3xl text-primary-container leading-none">
                      {week.totalHours.toFixed(1)}
                    </p>
                    <p className="font-mono text-[10px] uppercase text-on-secondary-fixed/50">HRS</p>
                    <span className="material-symbols-outlined text-sm text-on-secondary-fixed/40 mt-1">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </button>

                {/* Expanded entries — table */}
                {isExpanded && (
                  <div className="overflow-x-auto border-t border-on-secondary-fixed/10">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-secondary-fixed-dim">
                        <tr>
                          <th className="px-5 py-2 font-mono text-[9px] uppercase tracking-widest text-on-secondary-fixed/60">Job</th>
                          <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-on-secondary-fixed/60">In</th>
                          <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-on-secondary-fixed/60">Out</th>
                          <th className="px-5 py-2 font-mono text-[9px] uppercase tracking-widest text-on-secondary-fixed/60 text-right">Hrs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.entries.map((entry, i) => {
                          const entryJob = jobs.find(j => j.id === entry.jobId)
                          return (
                            <tr
                              key={entry.id}
                              className={`border-t border-on-secondary-fixed/5 ${
                                i % 2 === 0 ? '' : 'bg-on-secondary-fixed/5'
                              }`}
                            >
                              <td className="px-5 py-3 font-sans text-xs font-bold text-on-secondary-fixed">
                                {entryJob?.name ?? '—'}
                              </td>
                              <td className="px-3 py-3 font-mono text-xs text-on-secondary-fixed/70">
                                {formatTime(entry.clockIn)}
                              </td>
                              <td className="px-3 py-3 font-mono text-xs text-on-secondary-fixed/70">
                                {entry.clockOut ? formatTime(entry.clockOut) : <span className="text-primary-container">ACTIVE</span>}
                              </td>
                              <td className="px-5 py-3 font-mono text-sm font-bold text-primary-container text-right">
                                {(entry.hours ?? 0).toFixed(1)}
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

          {/* Grand total */}
          {weeks.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high border-l-4 border-primary-container mt-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Total All Weeks
              </p>
              <p className="font-heading font-bold text-3xl text-primary-container leading-none">
                {grandTotal.toFixed(1)} <span className="font-mono text-sm">hrs</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
