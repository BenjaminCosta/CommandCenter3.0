import { Job } from '@/lib/data'

interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact'
  showPM?: boolean
  showSuper?: boolean
  showLastActivity?: boolean
}

export function JobCard({ 
  job, 
  variant = 'default',
  showPM = true,
  showSuper = false,
  showLastActivity = false
}: JobCardProps) {
  const borderColor = {
    'IN PROGRESS': 'border-l-green',
    'PRE CONSTRUCTION': 'border-l-grey',
    'COMPLETED': 'border-l-black',
    'ALERT': 'border-l-red',
  }[job.status]

  const frequencyBg = {
    'DAILY': 'bg-black',
    'HOURLY': 'bg-orange',
    'WEEKLY': 'bg-grey',
  }[job.reportFrequency]

  return (
    <div className={`bg-card border-l-4 ${borderColor} p-5 ${variant === 'compact' ? 'py-4' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-bold text-black leading-tight">
            {job.name}
          </h3>
          <p className="text-muted-foreground mt-1">
            {job.city}, {job.state}
          </p>
          
          {showPM && (
            <p className="text-muted-foreground mt-2">
              PM: {job.pm}
            </p>
          )}
          
          {showSuper && job.super && (
            <p className="text-muted-foreground">
              Super: {job.super}
            </p>
          )}

          {showLastActivity && job.lastActivity && (
            <p className="text-xs text-muted-foreground mt-3 font-mono">
              Last activity: {new Date(job.lastActivity).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs font-mono font-medium uppercase text-svc-white ${frequencyBg}`}>
            {job.reportFrequency}
          </span>
        </div>
      </div>
    </div>
  )
}
