'use client'

import { useState } from 'react'
import Link from 'next/link'
import { jobs } from '@/lib/data'

export default function AdminJobsPage() {
  const [search, setSearch] = useState('')

  const filtered = jobs.filter(job =>
    job.name.toLowerCase().includes(search.toLowerCase()) ||
    job.city.toLowerCase().includes(search.toLowerCase()) ||
    job.pm.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a.status === 'ALERT' && b.status !== 'ALERT') return -1
    if (b.status === 'ALERT' && a.status !== 'ALERT') return 1
    return a.name.localeCompare(b.name)
  })

  const statusBorderMap: Record<string, string> = {
    'IN PROGRESS':      'border-l-tertiary',
    'PRE CONSTRUCTION': 'border-l-outline-variant',
    'COMPLETED':        'border-l-surface-container-highest',
    'ALERT':            'border-l-error',
  }
  const statusBadgeMap: Record<string, string> = {
    'IN PROGRESS':      'bg-tertiary text-background',
    'PRE CONSTRUCTION': 'bg-surface-container-high text-on-surface',
    'COMPLETED':        'bg-surface-container-highest text-on-surface',
    'ALERT':            'bg-error-container text-on-error-container',
  }
  const freqBadgeMap: Record<string, string> = {
    'DAILY':  'bg-surface-container-highest text-on-surface',
    'HOURLY': 'bg-primary-container text-on-primary-container',
    'WEEKLY': 'bg-secondary-container text-on-secondary-container',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary-container mb-2">
          ALL SITES
        </p>
        <h1 className="font-heading font-bold text-4xl uppercase tracking-tighter text-on-surface leading-none">
          Jobs
        </h1>
        <p className="font-mono text-xs text-on-surface-variant mt-2">
          {jobs.length} total
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
            placeholder="Search jobs, locations, PMs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-surface-container text-on-surface placeholder:text-on-surface-variant border border-outline-variant text-sm focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3 px-4 pb-10">
        {filtered.map(job => {
          const border = statusBorderMap[job.status] ?? 'border-l-outline-variant'
          const badge  = statusBadgeMap[job.status]  ?? 'bg-surface-container text-on-surface'
          const freq   = freqBadgeMap[job.reportFrequency] ?? 'bg-surface-container text-on-surface'
          const noImg  = !job.imageFolder

          return (
            <Link key={job.id} href={`/admin/jobs/${job.id}`} className="block">
              <div className={`bg-secondary-fixed border-l-4 ${border} p-5 hover:bg-secondary-fixed-dim transition-colors`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl uppercase tracking-tight text-on-secondary-fixed leading-tight">
                      {job.name}
                    </h3>
                    <p className="text-on-secondary-fixed/60 text-sm mt-1">
                      {job.city}, {job.state}
                    </p>
                    <div className="mt-3 text-on-secondary-fixed/60 text-sm space-y-0.5">
                      <p>PM: {job.pm}</p>
                      {job.super && <p>Super: {job.super}</p>}
                    </div>
                    {job.lastActivity && (
                      <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mt-3">
                        Last: {new Date(job.lastActivity).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${badge}`}>
                      {job.status}
                    </span>
                    <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${freq}`}>
                      {job.reportFrequency}
                    </span>
                    {noImg && (
                      <span className="px-2 py-1 font-mono text-[10px] uppercase tracking-widest bg-[#1a1a1a] border border-[#444] text-[#888]">
                        NO IMG URL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
