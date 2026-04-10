'use client'

import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { workers, dailyReports, jobs, formatDate } from '@/lib/data'

export default function ReportsPage() {
  const worker = workers[0]
  const workerReports = dailyReports.filter(r => r.workerId === worker.id)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header workerName={worker.name} />

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

        {workerReports.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              No reports filed yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workerReports.map(report => {
              const job = jobs.find(j => j.id === report.jobId)
              const hasIssue = report.hasIssues

              return (
                <div
                  key={report.id}
                  className={`bg-surface-container-low flex border-l-4 ${
                    hasIssue ? 'border-l-red' : 'border-l-green'
                  }`}
                >
                  {/* Left colour stripe already handled by border-l */}
                  <div className="flex-1 p-5">
                    <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                      {formatDate(report.date)}
                    </p>
                    <h3 className="font-heading text-xl uppercase tracking-tight text-on-surface mt-2 leading-tight">
                      {job?.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-3 leading-relaxed line-clamp-2">
                      {report.workCompleted}
                    </p>
                    {hasIssue && (
                      <p className="font-mono text-[10px] text-red uppercase tracking-widest mt-3">
                        ⚠ Issue reported
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav active="reports" />
    </div>
  )
}
