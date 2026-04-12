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

  if (!job) notFound()

  const timeEntries = getTimeEntriesForJob(job.id)
  const reports = getReportsForJob(job.id)

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

  const statusBadge = statusBadgeMap[job.status] ?? 'bg-surface-container text-on-surface'
  const freqBadge = freqBadgeMap[job.reportFrequency] ?? 'bg-surface-container text-on-surface'

  const tabs: { id: TabId; label: string }[] = [
    { id: 'timesheets', label: 'Timesheets' },
    { id: 'reports', label: 'Reports' },
    { id: 'info', label: 'Info' },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background safe-top">
        <div className="max-w-4xl mx-auto flex items-center h-16 px-6 gap-4">
          <Link href="/admin" className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              ADMIN / JOB DETAIL
            </p>
            <p className="font-heading text-sm uppercase tracking-wide text-on-surface leading-none mt-0.5 truncate">
              {job.name}
            </p>
          </div>
        </div>
        <div className="h-1 bg-surface-container-low w-full" />
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-6 pb-16">
        {/* Job summary card */}
        <div className="bg-secondary-fixed p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-3xl uppercase tracking-tighter text-on-secondary-fixed leading-tight">
                {job.name}
              </h1>
              <p className="text-on-secondary-fixed/60 flex items-center gap-2 mt-2 text-sm">
                <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                {job.city}, {job.state}
              </p>
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">PM</p>
              <p className="text-on-secondary-fixed text-sm">{job.pm}</p>
            </div>
            {job.super && (
              <div>
                <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Super</p>
                <p className="text-on-secondary-fixed text-sm">{job.super}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs — orange underline style */}
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

        {/* Timesheets tab */}
        {activeTab === 'timesheets' && (
          <div className="space-y-3">
            {timeEntries.length === 0 ? (
              <p className="text-center font-mono text-xs text-on-surface-variant uppercase tracking-widest py-12">
                No timesheet entries yet
              </p>
            ) : (
              timeEntries.map(entry => (
                <div key={entry.id} className="bg-secondary-fixed border-l-4 border-l-green p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-on-secondary-fixed flex items-center gap-2 mt-2 text-sm">
                        <User className="w-4 h-4 text-on-secondary-fixed/50 shrink-0" strokeWidth={1.5} />
                        {entry.workerName}
                      </p>
                      <p className="text-on-secondary-fixed/60 flex items-center gap-2 mt-2 text-sm">
                        <Clock className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        {formatTime(entry.clockIn)} — {entry.clockOut ? formatTime(entry.clockOut) : 'Active'}
                      </p>
                    </div>
                    {entry.hours && (
                      <div className="text-right shrink-0">
                        <p className="font-heading text-3xl uppercase text-green">{entry.hours}</p>
                        <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest">hours</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reports tab */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-center font-mono text-xs text-on-surface-variant uppercase tracking-widest py-12">
                No reports submitted yet
              </p>
            ) : (
              reports.map(report => (
                <div
                  key={report.id}
                  className={`bg-secondary-fixed border-l-4 p-5 ${report.hasIssues ? 'border-l-red' : 'border-l-green'}`}
                >
                  <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest">
                    {formatDate(report.date)}
                  </p>
                  <p className="text-on-secondary-fixed flex items-center gap-2 mt-2 text-sm">
                    <User className="w-4 h-4 text-on-secondary-fixed/50 shrink-0" strokeWidth={1.5} />
                    {report.workerName}
                  </p>
                  <p className="text-on-secondary-fixed/70 text-sm mt-4 leading-relaxed">
                    {report.workCompleted}
                  </p>
                  {report.hasIssues && report.issueDetails && (
                    <div className="mt-4 p-4 bg-secondary-fixed-dim border-l-4 border-l-red">
                      <p className="font-mono text-[10px] text-red uppercase tracking-widest mb-2">
                        ⚠ Issue Reported
                      </p>
                      <p className="text-on-secondary-fixed/70 text-sm leading-relaxed">
                        {report.issueDetails}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Info tab */}
        {activeTab === 'info' && (
          <div className="bg-secondary-fixed p-6 space-y-6">
            <div>
              <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Project Name</p>
              <p className="font-heading text-xl uppercase tracking-tight text-on-secondary-fixed">{job.name}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Address</p>
              <p className="text-on-secondary-fixed text-sm">{job.address || `${job.city}, ${job.state}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Project Manager</p>
                <p className="text-on-secondary-fixed text-sm">{job.pm}</p>
              </div>
              {job.super && (
                <div>
                  <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Superintendent</p>
                  <p className="text-on-secondary-fixed text-sm">{job.super}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Status</p>
                <span className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-widest mt-1 ${statusBadge}`}>
                  {job.status}
                </span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-1">Report Frequency</p>
                <span className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-widest mt-1 ${freqBadge}`}>
                  {job.reportFrequency}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
