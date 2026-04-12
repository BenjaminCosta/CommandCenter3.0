'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { workers, jobs, timeEntries, type Worker } from '@/lib/data'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0, 10)

function isClockedInToday(workerId: string): boolean {
  return timeEntries.some((e) => e.workerId === workerId && e.date === TODAY)
}

function getJobName(jobId: string): string {
  return jobs.find((j) => j.id === jobId)?.name ?? '—'
}

// ─── Detail Panel (slide-up on mobile, slide-in on desktop) ──────────────────
function WorkerDetail({
  worker,
  onClose,
}: {
  worker: Worker
  onClose: () => void
}) {
  const router = useRouter()
  const job = jobs.find((j) => j.id === worker.assignedJobId)
  const clockedIn = isClockedInToday(worker.id)
  const initial = worker.name.charAt(0).toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, right-side on desktop */}
      <div className="fixed z-50 bottom-0 left-0 right-0 lg:bottom-auto lg:top-0 lg:left-auto lg:right-0 lg:h-full lg:w-90 bg-surface-container-low border-t lg:border-t-0 lg:border-l border-surface-container-high flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] shrink-0"
              style={{ borderRadius: 0 }}
            >
              <span className="font-heading font-bold text-2xl text-primary-container">
                {initial}
              </span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl uppercase tracking-tighter text-on-surface">
                {worker.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                  clockedIn ? 'text-tertiary' : 'text-error'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    clockedIn ? 'bg-tertiary' : 'bg-error'
                  }`}
                />
                {clockedIn ? 'CLOCKED IN' : 'NOT IN'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Row label="Email"     value={worker.email} />
            <Row label="App Level" value={worker.appLevel} />
            <Row label="Current Job" value={job?.name ?? '—'} />
            {job && <Row label="Location"    value={`${job.city}, ${job.state}`} />}
            {job && <Row label="PM"          value={job.pm} />}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-5 border-t border-surface-container-high shrink-0">
          <button
            onClick={() => {
              onClose()
              router.push('/profile/change-job')
            }}
            className="w-full h-14 bg-primary-container hover:bg-primary text-on-primary-container font-heading font-bold text-xl uppercase tracking-tighter flex items-center justify-center gap-3 transition-colors btn-press"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            Change Job
          </button>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">
        {label}
      </p>
      <p className="font-sans text-sm font-semibold text-on-surface">{value}</p>
    </div>
  )
}

// ─── Worker Row ───────────────────────────────────────────────────────────────
function WorkerRow({
  worker,
  onClick,
}: {
  worker: Worker
  onClick: () => void
}) {
  const clockedIn = isClockedInToday(worker.id)
  const jobName   = getJobName(worker.assignedJobId)
  const initial   = worker.name.charAt(0).toUpperCase()

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left hover:bg-surface-container transition-colors"
      style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a' }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#1a1a1a]"
        style={{ borderRadius: 0 }}
      >
        <span className="font-heading font-bold text-lg text-primary-container">
          {initial}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold text-sm text-on-surface truncate">
          {worker.name}
        </p>
        <p className="font-mono text-[11px] text-on-surface-variant truncate mt-0.5">
          {jobName}
        </p>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: clockedIn ? 'var(--color-tertiary)' : '#c0392b' }}
        />
        <span
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: clockedIn ? 'var(--color-tertiary)' : '#c0392b' }}
        >
          {clockedIn ? 'IN' : 'OUT'}
        </span>
      </div>
    </button>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────
export function WorkersList() {
  const [selected, setSelected] = useState<Worker | null>(null)

  // Sort: clocked-in first, then alphabetical within each group
  const sorted = [...workers].sort((a, b) => {
    const aIn = isClockedInToday(a.id)
    const bIn = isClockedInToday(b.id)
    if (aIn && !bIn) return -1
    if (!aIn && bIn) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="relative">
      {sorted.map((worker) => (
        <WorkerRow
          key={worker.id}
          worker={worker}
          onClick={() => setSelected(worker)}
        />
      ))}

      {selected && (
        <WorkerDetail worker={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
