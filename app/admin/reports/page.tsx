'use client'

import { useState } from 'react'
import { dailyReports, jobs, workers, formatDate } from '@/lib/data'

export default function AdminReportsPage() {
  const [search, setSearch] = useState('')

  const allReports = [...dailyReports]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter(r => {
      if (!search) return true
      const job    = jobs.find(j => j.id === r.jobId)
      const worker = workers.find(w => w.id === r.workerId)
      const q = search.toLowerCase()
      return (
        r.workerName.toLowerCase().includes(q) ||
        job?.name.toLowerCase().includes(q) ||
        worker?.email.toLowerCase().includes(q) ||
        r.date.includes(q)
      )
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary-container mb-2">
          ALL JOBS
        </p>
        <h1 className="font-heading font-bold text-4xl uppercase tracking-tighter text-on-surface leading-none">
          Reports
        </h1>
        <p className="font-mono text-xs text-on-surface-variant mt-2">
          {allReports.length} total
        </p>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="search"
            placeholder="Search reports, supers, jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-surface-container text-on-surface placeholder:text-on-surface-variant border border-outline-variant text-sm focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>
      </div>

      {/* Report list */}
      <div className="px-4 pb-24">
        {allReports.map(report => {
          const job = jobs.find(j => j.id === report.jobId)
          return (
            <div
              key={report.id}
              className={`bg-secondary-fixed border-l-4 mb-3 ${
                report.hasIssues ? 'border-l-error' : 'border-l-tertiary'
              }`}
            >
              <div className="p-5">
                {/* Top row: date/badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-[10px] text-on-secondary-fixed/60 uppercase tracking-widest">
                      {formatDate(report.date)}
                    </p>
                    {report.hasIssues && (
                      <span className="px-2 py-0.5 bg-error font-mono text-[9px] text-on-error uppercase tracking-wider">
                        ISSUE REPORTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Worker + job name */}
                <h3 className="font-heading text-3xl font-bold uppercase tracking-tight text-on-secondary-fixed leading-tight mt-2">
                  {report.workerName}
                </h3>
                <p className="font-mono text-[10px] text-on-secondary-fixed/60 uppercase tracking-widest mt-1">
                  {job?.name ?? report.jobId}
                </p>

                {/* Work summary */}
                <p className="font-sans font-bold text-sm text-on-secondary-fixed/80 mt-3 leading-snug line-clamp-2">
                  {report.workCompleted}
                </p>

                {/* Issue details */}
                {report.hasIssues && report.issueDetails && (
                  <p className="font-mono text-[11px] text-error mt-2 leading-relaxed">
                    ⚠ {report.issueDetails}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {allReports.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              No reports found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
