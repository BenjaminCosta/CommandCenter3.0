'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { workers, dailyReports, jobs, formatDate, type DailyReport } from '@/lib/data'

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export default function ReportsPage() {
  const router = useRouter()
  const worker = workers[0]
  const [sessionReports, setSessionReports] = useState<DailyReport[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('sessionReports')
      if (raw) setSessionReports(JSON.parse(raw))
    } catch {}
    // Refresh "now" every minute so edit-window badge updates
    const interval = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(interval)
  }, [])

  // Merge seed + session, dedupe by id (session wins), filter to this worker, sort desc by date
  const seedReports = dailyReports.filter(r => r.workerId === worker.id)
  const sessionIds = new Set(sessionReports.map(r => r.id))
  const merged = [
    ...sessionReports.filter(r => r.workerId === worker.id),
    ...seedReports.filter(r => !sessionIds.has(r.id)),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleEdit = (report: DailyReport) => {
    sessionStorage.setItem('editReport', JSON.stringify(report))
    router.push('/daily-report')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-24">
        {/* Page title */}
        <div className="px-2 pt-8 pb-6 border-b border-surface-container-low mb-6">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">
            COMMAND CENTER / HISTORY
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface">
            MY<br />REPORTS
          </h1>
        </div>

        {merged.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              No reports filed yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {merged.map(report => {
              const job = jobs.find(j => j.id === report.jobId)
              const isEditable = now - report.createdAt < TWO_HOURS_MS
              const isEdited = !!report.editedAt

              return (
                <div
                  key={report.id}
                  className={`bg-secondary-fixed border-l-4 ${
                    report.hasIssues ? 'border-l-red' : 'border-l-primary-container'
                  }`}
                >
                  <div className="p-5">
                    {/* Top row: date/badges + edit button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-[10px] text-on-secondary-fixed/60 uppercase tracking-widest">
                          {formatDate(report.date)}
                        </p>
                        {report.hasIssues && (
                          <span className="px-2 py-0.5 bg-red font-mono text-[9px] text-on-surface uppercase tracking-wider">
                            ISSUE REPORTED
                          </span>
                        )}
                        {isEdited && (
                          <span className="px-2 py-0.5 bg-surface-container-highest font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                            EDITED
                          </span>
                        )}
                      </div>
                      {isEditable && (
                        <button
                          onClick={() => handleEdit(report)}
                          className="shrink-0 flex items-center gap-1 text-tertiary font-mono text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          EDIT
                        </button>
                      )}
                    </div>

                    <h3 className="font-heading text-xl uppercase tracking-tight text-on-secondary-fixed leading-tight mt-2">
                      {job?.name}
                    </h3>
                    <p className="text-on-secondary-fixed/70 text-sm mt-3 leading-relaxed line-clamp-2">
                      {report.workCompleted}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

    </div>
  )
}
