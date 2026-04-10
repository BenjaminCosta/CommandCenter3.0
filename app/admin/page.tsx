'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { jobs } from '@/lib/data'
import { BottomNav } from '@/components/bottom-nav'
import { Search, LogOut, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react'

type FilterTab = 'all' | 'in-progress' | 'pre-construction' | 'alerts'

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  // Calculate stats
  const activeJobs = jobs.filter(j => j.status === 'IN PROGRESS').length
  const alertJobs = jobs.filter(j => j.status === 'ALERT').length
  const reportedToday = Math.round((jobs.filter(j => j.status === 'IN PROGRESS').length / jobs.length) * 100)

  // Filter jobs - alerts always first when in 'all' view
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.pm.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTab = activeTab === 'all' ||
                        (activeTab === 'in-progress' && job.status === 'IN PROGRESS') ||
                        (activeTab === 'pre-construction' && job.status === 'PRE CONSTRUCTION') ||
                        (activeTab === 'alerts' && job.status === 'ALERT')
      
      return matchesSearch && matchesTab
    })
    .sort((a, b) => {
      // Alerts first
      if (a.status === 'ALERT' && b.status !== 'ALERT') return -1
      if (b.status === 'ALERT' && a.status !== 'ALERT') return 1
      return 0
    })

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'in-progress', label: 'Active' },
    { id: 'alerts', label: 'Alerts' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <h1 className="font-heading text-3xl font-bold text-orange tracking-tight">SVC</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-svc-white">Admin</span>
            <Link href="/" className="min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-svc-white/10">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-24">
        {/* Stats - Prominent */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-5 border-l-4 border-l-green">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-green" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground font-mono uppercase">Active</span>
            </div>
            <p className="font-heading text-4xl font-bold text-black">{activeJobs}</p>
          </div>
          <div className="bg-card p-5 border-l-4 border-l-red">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground font-mono uppercase">Alerts</span>
            </div>
            <p className="font-heading text-4xl font-bold text-black">{alertJobs}</p>
          </div>
          <div className="bg-card p-5 border-l-4 border-l-orange">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-orange" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground font-mono uppercase">Reported</span>
            </div>
            <p className="font-heading text-4xl font-bold text-black">{reportedToday}%</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
          <Input
            type="search"
            placeholder="Search jobs, locations, PMs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-card border-border text-black text-base"
          />
        </div>

        {/* Filter Tabs - Orange underline style */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 text-sm font-heading font-bold uppercase tracking-wide transition-colors min-h-12 ${
                activeTab === tab.id
                  ? 'text-black'
                  : 'text-grey hover:text-black'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange" />
              )}
            </button>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const borderColor = {
              'IN PROGRESS': 'border-l-green',
              'PRE CONSTRUCTION': 'border-l-grey',
              'COMPLETED': 'border-l-black',
              'ALERT': 'border-l-red',
            }[job.status]

            const isAlert = job.status === 'ALERT'

            const statusBg = {
              'IN PROGRESS': 'bg-green text-svc-white',
              'PRE CONSTRUCTION': 'bg-grey text-svc-white',
              'COMPLETED': 'bg-black text-svc-white',
              'ALERT': 'bg-red text-svc-white',
            }[job.status]

            const frequencyBg = {
              'DAILY': 'bg-black text-svc-white',
              'HOURLY': 'bg-orange text-svc-white',
              'WEEKLY': 'bg-grey text-svc-white',
            }[job.reportFrequency]

            return (
              <Link 
                key={job.id} 
                href={`/admin/jobs/${job.id}`}
                className="block"
              >
                <div className={`bg-card border-l-4 ${borderColor} p-5 hover:bg-muted/50 transition-colors ${
                  isAlert ? 'bg-red/5' : ''
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-bold text-black leading-tight">
                        {job.name}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {job.city}, {job.state}
                      </p>
                      <div className="mt-3 text-muted-foreground">
                        <p>PM: {job.pm}</p>
                        {job.super && <p>Super: {job.super}</p>}
                      </div>
                      {job.lastActivity && (
                        <p className="text-xs text-muted-foreground mt-3 font-mono">
                          Last: {new Date(job.lastActivity).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 text-xs font-mono font-medium uppercase ${statusBg}`}>
                        {job.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-mono font-medium uppercase ${frequencyBg}`}>
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
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No jobs found.</p>
          </div>
        )}
      </main>

      <BottomNav active="admin" />
    </div>
  )
}
