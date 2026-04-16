'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { workers, jobs } from '@/lib/data'

export default function ChangeJobPage() {
  const router = useRouter()
  const worker = workers[0]
  const [selectedJobId, setSelectedJobId] = useState(worker.assignedJobId)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('currentJobId')
    if (stored) setSelectedJobId(stored)
  }, [])

  const handleSelect = (jobId: string) => {
    if (confirming || jobId === selectedJobId) return
    sessionStorage.setItem('currentJobId', jobId)
    setSelectedJobId(jobId)
    setConfirming(true)
    setTimeout(() => router.push('/profile'), 500)
  }

  const currentJob = jobs.find(j => j.id === selectedJobId)
  const otherJobs = jobs.filter(j => j.id !== selectedJobId)

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-surface-container-low z-10 shrink-0">
        <div className="max-w-lg mx-auto h-14 flex items-center px-5 gap-4">
          <button onClick={() => router.back()} className="text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-heading font-bold text-2xl uppercase tracking-tighter text-primary-container">
            Change Job
          </h1>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 pt-6 pb-10">

          {/* Page heading */}
          <div className="mb-7">
            <span className="font-mono text-xs uppercase tracking-widest text-primary-container block mb-1">
              Active Session
            </span>
            <h2 className="font-heading font-bold text-5xl uppercase tracking-tighter leading-none">
              Select New Site
            </h2>
          </div>

          {/* Current job card — highlighted */}
          {currentJob && (
            <div className="bg-secondary-fixed p-6 flex justify-between items-center mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-on-secondary-fixed/60 block mb-1">
                  Project ID: {currentJob.id.toUpperCase()}
                </span>
                <h3 className="font-heading font-bold text-3xl text-on-secondary-fixed uppercase tracking-tighter leading-tight">
                  {currentJob.name}
                </h3>
                <div className="flex items-center mt-2 gap-2">
                  <div className="w-2 h-2 bg-tertiary shrink-0" />
                  <span className="font-mono text-xs uppercase text-tertiary font-semibold tracking-tight">
                    Currently Logged
                  </span>
                </div>
              </div>
              <div className="bg-tertiary w-12 h-12 flex items-center justify-center shrink-0 ml-4">
                <span
                  className="material-symbols-outlined text-on-tertiary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
            </div>
          )}

          {/* Spacer + available label */}
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface/40">
              Available Sites
            </span>
          </div>

          {/* Other jobs */}
          <div className="flex flex-col gap-3">
            {otherJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => handleSelect(job.id)}
                disabled={confirming}
                className="group bg-secondary-fixed p-6 flex justify-between items-center hover:bg-primary-container transition-colors text-left w-full btn-press"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-on-secondary-fixed/60 group-hover:text-on-primary-container/70 block mb-1">
                    Project ID: {job.id.toUpperCase()}
                  </span>
                  <h3 className="font-heading font-bold text-3xl text-on-secondary-fixed group-hover:text-on-primary-container uppercase tracking-tighter leading-tight">
                    {job.name}
                  </h3>
                </div>
                <span className="material-symbols-outlined text-on-secondary-fixed/20 group-hover:text-on-primary-container">
                  chevron_right
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
