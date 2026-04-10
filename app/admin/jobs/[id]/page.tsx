'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { jobs, getTimeEntriesForJob, getReportsForJob, formatDate, formatTime } from '@/lib/data'
import { ArrowLeft, MapPin, User, Clock } from 'lucide-react'

type TabId = 'timesheets' | 'reports' | 'info'

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = jobs.find(j => j.id === id)
  const [activeTab, setActiveTab] = useState<TabId>('timesheets')

  if (!job) {
    notFound()
  }

  const timeEntries = getTimeEntriesForJob(job.id)
  const reports = getReportsForJob(job.id)

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

  const tabs: { id: TabId; label: string }[] = [
    { id: 'timesheets', label: 'Timesheets' },
    { id: 'reports', label: 'Reports' },
    { id: 'info', label: 'Info' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-4xl mx-auto flex items-center h-14 px-4">
          <Link href="/admin" className="mr-4 min-h-[48px] min-w-[48px] flex items-center justify-center -ml-3">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wide truncate">
            {job.name}
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Job Header Card */}
        <div className="bg-card p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="font-heading text-3xl font-bold text-black">{job.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <MapPin className="w-5 h-5" strokeWidth={1.5} />
                {job.city}, {job.state}
              </p>
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
          <div className="grid grid-cols-2 gap-6 text-base">
            <div>
              <p className="text-muted-foreground text-sm">PM</p>
              <p className="font-medium text-black mt-1">{job.pm}</p>
            </div>
            {job.super && (
              <div>
                <p className="text-muted-foreground text-sm">Super</p>
                <p className="font-medium text-black mt-1">{job.super}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs - Orange underline style */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-4 text-sm font-heading font-bold uppercase tracking-wide transition-colors min-h-[48px] ${
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

        {/* Tab Content */}
        {activeTab === 'timesheets' && (
          <div className="space-y-4">
            {timeEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-lg">No timesheet entries yet.</p>
            ) : (
              timeEntries.map(entry => (
                <div key={entry.id} className="bg-card p-5 border-l-4 border-l-green">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                      <p className="font-medium text-black flex items-center gap-2 mt-2">
                        <User className="w-5 h-5 text-grey" strokeWidth={1.5} />
                        {entry.workerName}
                      </p>
                      <p className="text-muted-foreground mt-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" strokeWidth={1.5} />
                        {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'Active'}
                      </p>
                    </div>
                    {entry.hours && (
                      <div className="text-right">
                        <p className="font-heading text-3xl font-bold text-green">{entry.hours}</p>
                        <p className="text-xs text-muted-foreground font-mono">hours</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-lg">No reports submitted yet.</p>
            ) : (
              reports.map(report => (
                <div 
                  key={report.id} 
                  className={`bg-card p-5 border-l-4 ${report.hasIssues ? 'border-l-red' : 'border-l-green'}`}
                >
                  <p className="font-mono text-xs text-muted-foreground">{formatDate(report.date)}</p>
                  <p className="font-medium text-black flex items-center gap-2 mt-2">
                    <User className="w-5 h-5 text-grey" strokeWidth={1.5} />
                    {report.workerName}
                  </p>
                  <p className="text-foreground mt-4 leading-relaxed">{report.workCompleted}</p>
                  {report.hasIssues && report.issueDetails && (
                    <div className="mt-4 p-4 bg-red/5 border-l-4 border-l-red">
                      <p className="text-xs font-mono text-red uppercase mb-2">Issue Reported</p>
                      <p className="text-red leading-relaxed">{report.issueDetails}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="bg-card p-6">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Project Name</p>
                <p className="font-heading font-bold text-black text-xl mt-1">{job.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Address</p>
                <p className="text-black mt-1">{job.address || `${job.city}, ${job.state}`}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Project Manager</p>
                  <p className="text-black mt-1">{job.pm}</p>
                </div>
                {job.super && (
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Superintendent</p>
                    <p className="text-black mt-1">{job.super}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-mono font-medium uppercase mt-1 ${statusBg}`}>
                    {job.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">Report Frequency</p>
                  <span className={`inline-block px-2 py-1 text-xs font-mono font-medium uppercase mt-1 ${frequencyBg}`}>
                    {job.reportFrequency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
