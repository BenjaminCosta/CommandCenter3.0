'use client'

import { useState } from 'react'
import Link from 'next/link'
import { jobs } from '@/lib/data'
import { BottomNav } from '@/components/bottom-nav'
import { Search, LogOut, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react'

type FilterTab = 'all' | 'in-progress' | 'pre-construction' | 'alerts'

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const activeJobs = jobs.filter(j => j.status === 'IN PROGRESS').length
  const alertJobs = jobs.filter(j => j.status === 'ALERT').length
  const reportedToday = Math.round((jobs.filter(j => j.status === 'IN PROGRESS').length / jobs.length) * 100)

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch =
        job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.pm.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'in-progress' && job.status === 'IN PROGRESS') ||
        (activeTab === 'pre-construction' && job.status === 'PRE CONSTRUCTION') ||
        (activeTab === 'alerts' && job.status === 'ALERT')
      return matchesSearch && matchesTab
    })
    .sort((a, b) => {
      if (a.status === 'ALERT' && b.status !== 'ALERT') return -1
      if (b.status === 'ALERT' && a.status !== 'ALERT') return 1
      return 0
    })

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'in-progress', label: 'Active' },
    { id: 'alerts', label: 'Alerts' },
  ]

  const statusBorderMap: Record<string, string> = {
    'IN PROGRESS': 'border-l-green',
    'PRE CONSTRUCTION': 'border-l-outline-variant',
    'COMPLETED': 'border-l-surface-container-highest',
    'ALERT': 'border-l-red',
  }
  const statusBadgeMap: Record<string, string> = {
    'IN PROGRESS': 'bg-green text-background',
    'PRE CONSTRUCTION': 'bg-surface-container-high text-on-surface',
    'COMPLETED': 'bg-surface-container-highest text-on-surface',
    'ALERT': 'bg-red text-on-surface',
  }
  const freqBadgeMap: Record<string, string> = {
    'DAILY': 'bg-surface-container-highest text-on-surface',
    'HOURLY': 'bg-primary-container text-on-primary-container',
    'WEEKLY': 'bg-secondary-container text-on-secondary-container',
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background safe-top">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16 px-6">
          <img src="/logo.png" alt="SVC Logo" className="h-10 w-auto" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                COMMAND CENTER
              </p>
              <p className="font-heading text-sm uppercase tracking-wide text-on-surface leading-none mt-0.5">
                Admin
              </p>
            </div>
            <Link href="/" className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="h-1 bg-surface-container-low w-full" />
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-24 pt-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-container-low p-5 border-l-4 border-l-green">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-green" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Active</span>
            </div>
            <p className="font-heading text-4xl uppercase text-on-surface">{activeJobs}</p>
          </div>
          <div className="bg-surface-container-low p-5 border-l-4 border-l-red">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Alerts</span>
            </div>
            <p className="font-heading text-4xl uppercase text-on-surface">{alertJobs}</p>
          </div>
          <div className="bg-surface-container-low p-5 border-l-4 border-l-primary-container">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-primary-container" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Reported</span>
            </div>
            <p className="font-heading text-4xl uppercase text-on-surface">{reportedToday}%</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="search"
            placeholder="Search jobs, locations, PMs…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-surface-container text-on-surface placeholder:text-on-surface-variant border border-outline-variant text-base focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>

        {/* Filter tabs — orange underline style */}
        <div className="flex gap-0 mb-8 border-b border-surface-container-low">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 font-heading text-sm uppercase tracking-wide transition-colors min-h-12 ${
                activeTab === tab.id ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container" />
              )}
            </button>
          ))}
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {filteredJobs.map(job => {
            const borderColor = statusBorderMap[job.status] ?? 'border-l-outline-variant'
            const statusBadge = statusBadgeMap[job.status] ?? 'bg-surface-container text-on-surface'
            const freqBadge = freqBadgeMap[job.reportFrequency] ?? 'bg-surface-container text-on-surface'
            const isAlert = job.status === 'ALERT'

            return (
              <Link key={job.id} href={`/admin/jobs/${job.id}`} className="block">
                <div className={`bg-surface-container-low border-l-4 ${borderColor} p-5 hover:bg-surface-container transition-colors ${isAlert ? 'bg-red/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl uppercase tracking-tight text-on-surface leading-tight">
                        {job.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-1">
                        {job.city}, {job.state}
                      </p>
                      <div className="mt-3 text-on-surface-variant text-sm space-y-0.5">
                        <p>PM: {job.pm}</p>
                        {job.super && <p>Super: {job.super}</p>}
                      </div>
                      {job.lastActivity && (
                        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-3">
                          Last: {new Date(job.lastActivity).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${statusBadge}`}>
                        {job.status}
                      </span>
                      <span className={`px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${freqBadge}`}>
                        {job.reportFrequency}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              No jobs found
            </p>
          </div>
        )}
      </main>

      <BottomNav active="admin" />
    </div>
  )
}
