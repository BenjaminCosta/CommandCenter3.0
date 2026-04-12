'use client'

import { WorkersList } from '@/components/workers-list'
import { workers, timeEntries } from '@/lib/data'

const TODAY = new Date().toISOString().slice(0, 10)

export default function SupersPage() {
  const totalIn  = workers.filter(w =>
    timeEntries.some(e => e.workerId === w.id && e.date === TODAY)
  ).length
  const totalOut = workers.length - totalIn

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="px-4 pt-8 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary-container mb-2">
          FIELD STATUS
        </p>
        <h1 className="font-heading font-bold text-4xl uppercase tracking-tighter text-on-surface leading-none">
          Supers
        </h1>

        {/* Quick stats */}
        <div className="flex gap-4 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              {totalIn} IN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              {totalOut} OUT
            </span>
          </div>
        </div>
      </div>

      {/* Worker rows */}
      <div className="border-t border-[#1a1a1a]">
        <WorkersList />
      </div>
    </div>
  )
}
