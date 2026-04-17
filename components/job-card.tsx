import { memo } from 'react'
import { Job } from '@/lib/data'

const borderColorMap: Record<string, string> = {
  'IN PROGRESS': 'border-l-green',
  'PRE CONSTRUCTION': 'border-l-outline',
  'COMPLETED': 'border-l-surface-container-highest',
  'ALERT': 'border-l-red',
}

const frequencyBgMap: Record<string, string> = {
  'DAILY': 'bg-surface-container-highest text-on-surface',
  'HOURLY': 'bg-primary-container text-on-primary-container',
  'WEEKLY': 'bg-secondary-container text-on-secondary-container',
}

interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact'
  showPM?: boolean
  showSuper?: boolean
  showLastActivity?: boolean
}

export const JobCard = memo(function JobCard({
  job, 
  variant = 'default',
  showPM = true,
  showSuper = false,
  showLastActivity = false
}: JobCardProps) {
  const borderColor = borderColorMap[job.status]
  const frequencyBg = frequencyBgMap[job.reportFrequency]

  return (
    <div className={`bg-surface-container-low border-l-4 ${borderColor} p-5 ${variant === 'compact' ? 'py-4' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-on-surface leading-tight">
            {job.name}
          </h3>
          <p className="text-on-secondary-container mt-1">
            {job.city}, {job.state}
          </p>
          
          {showPM && (
            <p className="text-on-secondary-container mt-2">
              PM: {job.pm}
            </p>
          )}
          
          {showSuper && job.super && (
            <p className="text-on-secondary-container">
              Super: {job.super}
            </p>
          )}

          {showLastActivity && job.lastActivity && (
            <p className="text-xs text-on-secondary-container mt-3 font-mono">
              Last activity: {new Date(job.lastActivity).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs font-mono font-medium uppercase ${frequencyBg}`}>
            {job.reportFrequency}
          </span>
        </div>
      </div>
    </div>
  )
})
