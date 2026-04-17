'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { workers, jobs } from '@/lib/data'

const STATUS_BG: Record<string, string> = {
  'IN PROGRESS':      'bg-background border-l-4 border-green text-green',
  'PRE CONSTRUCTION': 'bg-background border-l-4 border-primary-container text-primary-container',
  'COMPLETED':        'bg-background border-l-4 border-outline text-on-surface-variant',
  'ALERT':            'bg-background border-l-4 border-error text-error',
}

export default function CurrentJobPage() {
  const router = useRouter()
  const worker = workers[0]
  const [currentJobId, setCurrentJobId] = useState(worker.assignedJobId)

  useEffect(() => {
    const stored = sessionStorage.getItem('currentJobId')
    if (stored) setCurrentJobId(stored)
  }, [])

  const job = jobs.find(j => j.id === currentJobId)
  const canChangeJob = worker.appLevel === 'Master' || worker.appLevel === 'Neo'

  if (!job) {
    return (
      <div className="h-dvh flex items-center justify-center bg-background">
        <p className="font-mono text-xs text-on-surface-variant">No job assigned.</p>
      </div>
    )
  }

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-surface-container-low z-10 shrink-0">
        <div className="max-w-lg mx-auto h-14 flex items-center px-5 gap-4">
          <button onClick={() => router.back()} className="text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-heading font-bold text-xl uppercase tracking-tighter text-primary-container">
            Current Job
          </h1>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto p-5 flex flex-col gap-5">

          {/* Hero card — cream, big name, border-left orange */}
          <div className="bg-secondary-fixed text-on-secondary-fixed border-l-8 border-primary-container px-7 py-8 card-stagger" style={{"--card-i": 0} as React.CSSProperties}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-bold tracking-widest text-on-secondary-fixed/50 uppercase mb-1">
                  Job ID: {job.id.toUpperCase()}
                </p>
                <h1 className="font-heading font-bold text-5xl uppercase tracking-tighter text-on-secondary-fixed leading-none mb-3">
                  {job.name}
                </h1>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs text-on-secondary-fixed/60 uppercase">
                    Location: {job.city}, {job.state}
                  </span>
                  <span className="font-mono text-xs text-on-secondary-fixed/60 uppercase">
                    PM: {job.pm}
                  </span>
                </div>
              </div>
              {/* Status pill */}
              <div className={`px-4 py-1.5 font-heading font-bold text-base tracking-wider uppercase shrink-0 ${STATUS_BG[job.status] ?? ''}`}>
                {job.status === 'IN PROGRESS' ? 'ACTIVE' : job.status}
              </div>
            </div>

            {/* Frequency */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="block font-mono text-[10px] text-on-secondary-fixed/50 uppercase mb-0.5">Report Freq.</span>
                <span className="font-mono font-bold text-sm text-on-secondary-fixed">{job.reportFrequency}</span>
              </div>
              {job.super && (
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-on-secondary-fixed/50 uppercase mb-0.5">Project Lead</span>
                  <span className="font-mono font-bold text-sm text-on-secondary-fixed">{job.super}</span>
                </div>
              )}
            </div>

            {/* Quick action buttons — side by side, blue */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => router.push('/rolodex')}
                className="h-16 bg-tertiary-container hover:bg-tertiary text-white flex items-center justify-center gap-2 transition-colors btn-press"
              >
                <span className="material-symbols-outlined text-2xl">contact_page</span>
                <span className="font-heading font-bold text-lg uppercase tracking-tighter">Contacts</span>
              </button>
              {job.imageFolder ? (
                <a
                  href={job.imageFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 bg-tertiary-container hover:bg-tertiary text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">folder_shared</span>
                  <span className="font-heading font-bold text-lg uppercase tracking-tighter">Photos</span>
                </a>
              ) : (
                <div className="h-16 bg-surface-container flex items-center justify-center gap-2 opacity-30">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">folder_off</span>
                  <span className="font-heading font-bold text-lg uppercase tracking-tighter text-on-surface-variant">No Folder</span>
                </div>
              )}
            </div>
          </div>

          {/* Address detail row */}
          {job.address && (
            <div className="bg-surface-container-low px-5 py-4 border-l-4 border-outline-variant card-stagger" style={{"--card-i": 1} as React.CSSProperties}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Address</p>
              <p className="font-sans text-sm font-semibold text-on-surface">{job.address}</p>
            </div>
          )}

          {/* Change Job CTA */}
          {canChangeJob && (
            <button
              onClick={() => router.push('/profile/change-job')}
              className="h-16 w-full flex items-center justify-between px-6 bg-primary-container hover:bg-primary text-on-primary-container btn-press transition-colors card-stagger"
              style={{"--card-i": 2} as React.CSSProperties}
            >
              <span className="font-heading font-bold text-2xl uppercase tracking-tighter">Change Job</span>
              <span className="material-symbols-outlined">swap_horiz</span>
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
