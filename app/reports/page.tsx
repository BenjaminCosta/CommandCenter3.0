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
      
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 pb-24">
        <h2 className="font-heading text-3xl font-bold text-black mb-8">
          My Reports
        </h2>

        {workerReports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No reports filed yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workerReports.map(report => {
              const job = jobs.find(j => j.id === report.jobId)
              return (
                <div 
                  key={report.id} 
                  className={`bg-card p-5 border-l-4 ${report.hasIssues ? 'border-l-red' : 'border-l-green'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDate(report.date)}
                      </p>
                      <h3 className="font-heading text-xl font-bold text-black mt-2">
                        {job?.name}
                      </h3>
                      <p className="text-foreground mt-3 leading-relaxed line-clamp-2">
                        {report.workCompleted}
                      </p>
                      {report.hasIssues && (
                        <p className="text-xs text-red mt-3 font-mono uppercase">
                          Issue reported
                        </p>
                      )}
                    </div>
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
