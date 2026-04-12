// Types
export interface Job {
  id: string
  name: string
  city: string
  state: string
  pm: string
  super?: string
  address?: string
  reportFrequency: 'DAILY' | 'HOURLY' | 'WEEKLY'
  status: 'IN PROGRESS' | 'PRE CONSTRUCTION' | 'COMPLETED' | 'ALERT'
  lastActivity?: string
  imageFolder?: string
}

export interface Worker {
  id: string
  name: string
  email: string
  assignedJobId: string
  appLevel: 'Neo' | 'Master' | 'Journeyman'
}

export interface Contact {
  id: string
  name: string
  role: 'PM' | 'Super' | 'Worker' | 'Admin'
  email?: string
  phone?: string
}

export interface TimeEntry {
  id: string
  workerId: string
  workerName: string
  jobId: string
  clockIn: string
  clockOut?: string
  hours?: number
  date: string
}

export interface DailyReport {
  id: string
  workerId: string
  workerName: string
  jobId: string
  date: string
  workCompleted: string
  hasIssues: boolean
  issueDetails?: string
  photoUrl?: string
  createdAt: number   // Unix ms timestamp
  editedAt?: number   // Unix ms timestamp, set on edits after first submit
}

// Sample Data
export const jobs: Job[] = [
  {
    id: 'job-1',
    name: 'Appaloosa',
    city: 'Short Hills',
    state: 'NJ',
    pm: 'Ralph Geraldo',
    super: 'Mike Thompson',
    address: '123 Mountain Ave, Short Hills, NJ 07078',
    reportFrequency: 'HOURLY',
    status: 'IN PROGRESS',
    lastActivity: '2024-01-15T14:30:00Z',
    imageFolder: 'https://drive.google.com/drive/folders/appaloosa-nj'
  },
  {
    id: 'job-2',
    name: 'Heartland Dental',
    city: 'Tampa',
    state: 'FL',
    pm: 'Ben Tuseth',
    super: 'Carlos Rodriguez',
    address: '456 Bay Street, Tampa, FL 33602',
    reportFrequency: 'HOURLY',
    status: 'IN PROGRESS',
    lastActivity: '2024-01-15T12:00:00Z'
  },
  {
    id: 'job-3',
    name: "Bill's House",
    city: 'Cortez',
    state: 'FL',
    pm: 'Bill Lloyd',
    super: 'Steve Martinez',
    address: '789 Gulf Blvd, Cortez, FL 34215',
    reportFrequency: 'DAILY',
    status: 'IN PROGRESS',
    lastActivity: '2024-01-14T17:00:00Z',
    imageFolder: 'https://drive.google.com/drive/folders/bills-house-fl'
  },
  {
    id: 'job-4',
    name: 'Kingsland',
    city: 'Lyndhurst',
    state: 'NJ',
    pm: 'Dominick Tucci',
    super: 'Anthony Romano',
    address: '321 Ridge Road, Lyndhurst, NJ 07071',
    reportFrequency: 'DAILY',
    status: 'PRE CONSTRUCTION',
    lastActivity: '2024-01-10T09:00:00Z'
  },
  {
    id: 'job-5',
    name: 'Metro Plaza',
    city: 'Newark',
    state: 'NJ',
    pm: 'Ralph Geraldo',
    super: 'Mike Thompson',
    address: '500 Broad Street, Newark, NJ 07102',
    reportFrequency: 'HOURLY',
    status: 'ALERT',
    lastActivity: '2024-01-15T08:00:00Z'
  }
]

export const workers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Pablo Carballeira',
    email: 'pablo@svc.com',
    assignedJobId: 'job-1',
    appLevel: 'Master'
  },
  {
    id: 'worker-2',
    name: 'Anthony Fraser',
    email: 'anthony@svc.com',
    assignedJobId: 'job-2',
    appLevel: 'Journeyman'
  },
  {
    id: 'worker-3',
    name: 'Robert Depoortere',
    email: 'robert@svc.com',
    assignedJobId: 'job-3',
    appLevel: 'Neo'
  },
  {
    id: 'worker-4',
    name: 'J. Haddad',
    email: 'jhaddad@svc.com',
    assignedJobId: 'job-4',
    appLevel: 'Journeyman'
  },
  {
    id: 'worker-5',
    name: 'Michael Healy',
    email: 'mhealy@svc.com',
    assignedJobId: 'job-5',
    appLevel: 'Master'
  },
  {
    id: 'worker-6',
    name: 'Nathaniel Bowers',
    email: 'nbowers@svc.com',
    assignedJobId: 'job-2',
    appLevel: 'Neo'
  }
]

export const timeEntries: TimeEntry[] = [
  {
    id: 'time-1',
    workerId: 'worker-1',
    workerName: 'Pablo Carballeira',
    jobId: 'job-1',
    clockIn: '2024-01-15T07:00:00Z',
    clockOut: '2024-01-15T15:30:00Z',
    hours: 8.5,
    date: '2024-01-15'
  },
  {
    id: 'time-2',
    workerId: 'worker-1',
    workerName: 'Pablo Carballeira',
    jobId: 'job-1',
    clockIn: '2024-01-14T06:30:00Z',
    clockOut: '2024-01-14T15:00:00Z',
    hours: 8.5,
    date: '2024-01-14'
  },
  {
    id: 'time-3',
    workerId: 'worker-2',
    workerName: 'Anthony Fraser',
    jobId: 'job-2',
    clockIn: '2024-01-15T08:00:00Z',
    clockOut: '2024-01-15T16:00:00Z',
    hours: 8,
    date: '2024-01-15'
  },
  // Pablo Carballeira — Week ending Apr 11, 2026 (Sat)
  { id: 'te-1', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-06T12:00:00Z', clockOut: '2026-04-06T20:30:00Z', hours: 8.5, date: '2026-04-06' },
  { id: 'te-2', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-07T11:30:00Z', clockOut: '2026-04-07T20:30:00Z', hours: 9.0, date: '2026-04-07' },
  { id: 'te-3', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-08T12:00:00Z', clockOut: '2026-04-08T20:00:00Z', hours: 8.0, date: '2026-04-08' },
  { id: 'te-4', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-09T12:00:00Z', clockOut: '2026-04-09T20:30:00Z', hours: 8.5, date: '2026-04-09' },
  { id: 'te-5', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-10T11:30:00Z', clockOut: '2026-04-10T20:30:00Z', hours: 9.0, date: '2026-04-10' },
  // Pablo Carballeira — Week ending Apr 4, 2026 (Sat)
  { id: 'te-6', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-30T12:00:00Z', clockOut: '2026-03-30T20:00:00Z', hours: 8.0, date: '2026-03-30' },
  { id: 'te-7', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-31T12:00:00Z', clockOut: '2026-03-31T20:30:00Z', hours: 8.5, date: '2026-03-31' },
  { id: 'te-8', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-01T12:00:00Z', clockOut: '2026-04-01T20:00:00Z', hours: 8.0, date: '2026-04-01' },
  { id: 'te-9', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-02T12:00:00Z', clockOut: '2026-04-02T21:00:00Z', hours: 9.0, date: '2026-04-02' },
  { id: 'te-10', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-03T11:30:00Z', clockOut: '2026-04-03T20:00:00Z', hours: 8.5, date: '2026-04-03' },
  // Pablo Carballeira — Week ending Mar 28, 2026 (Sat)
  { id: 'te-11', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-23T12:00:00Z', clockOut: '2026-03-23T20:00:00Z', hours: 8.0, date: '2026-03-23' },
  { id: 'te-12', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-24T11:30:00Z', clockOut: '2026-03-24T20:30:00Z', hours: 9.0, date: '2026-03-24' },
  { id: 'te-13', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-25T12:00:00Z', clockOut: '2026-03-25T20:30:00Z', hours: 8.5, date: '2026-03-25' },
  { id: 'te-14', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-26T12:00:00Z', clockOut: '2026-03-26T20:00:00Z', hours: 8.0, date: '2026-03-26' },
  { id: 'te-15', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-03-27T11:30:00Z', clockOut: '2026-03-27T20:00:00Z', hours: 8.5, date: '2026-03-27' },
  // Today (2026-04-12) — workers currently clocked in
  { id: 'te-today-1', workerId: 'worker-1', workerName: 'Pablo Carballeira', jobId: 'job-1', clockIn: '2026-04-12T12:00:00Z', date: '2026-04-12' },
  { id: 'te-today-2', workerId: 'worker-5', workerName: 'Michael Healy',     jobId: 'job-5', clockIn: '2026-04-12T11:30:00Z', date: '2026-04-12' },
]

export const dailyReports: DailyReport[] = [
  {
    id: 'report-1',
    workerId: 'worker-1',
    workerName: 'Pablo Carballeira',
    jobId: 'job-1',
    date: '2024-01-15',
    workCompleted: 'Completed framing on second floor east wing. Installed 12 window frames.',
    hasIssues: false,
    createdAt: new Date('2024-01-15T15:00:00Z').getTime()
  },
  {
    id: 'report-2',
    workerId: 'worker-1',
    workerName: 'Pablo Carballeira',
    jobId: 'job-1',
    date: '2024-01-14',
    workCompleted: 'Finished drywall installation in main hallway. Started electrical rough-in.',
    hasIssues: true,
    issueDetails: 'Material delivery delayed - missing 20 sheets of drywall',
    createdAt: new Date('2024-01-14T15:00:00Z').getTime(),
    editedAt: new Date('2024-01-14T16:30:00Z').getTime()
  },
  {
    id: 'report-3',
    workerId: 'worker-2',
    workerName: 'Anthony Fraser',
    jobId: 'job-2',
    date: '2024-01-15',
    workCompleted: 'Dental chair installation complete. Started plumbing connections.',
    hasIssues: false,
    createdAt: new Date('2024-01-15T14:00:00Z').getTime()
  }
]

export const contacts: Contact[] = [
  // Project Managers
  { id: 'c-1', name: 'Ralph Geraldo', role: 'PM', email: 'rgeraldo@svc.com', phone: '(201) 555-0101' },
  { id: 'c-2', name: 'Ben Tuseth', role: 'PM', email: 'btuseth@svc.com', phone: '(813) 555-0102' },
  { id: 'c-3', name: 'Bill Lloyd', role: 'PM', email: 'blloyd@svc.com', phone: '(941) 555-0103' },
  { id: 'c-4', name: 'Dominick Tucci', role: 'PM', email: 'dtucci@svc.com', phone: '(201) 555-0104' },
  { id: 'c-5', name: 'Aaron Maenke', role: 'PM', email: 'amaenke@svc.com', phone: '(253) 555-0105' },
  { id: 'c-6', name: 'Andy Haas', role: 'PM', email: 'ahaas@svc.com', phone: '(724) 555-0106' },
  { id: 'c-7', name: 'James Gagnon', role: 'PM', email: 'jgagnon@svc.com', phone: '(973) 555-0107' },
  { id: 'c-8', name: 'Courtney Roberts', role: 'PM', email: 'croberts@svc.com', phone: '(712) 555-0108' },
  { id: 'c-9', name: 'Frank Careri', role: 'PM', email: 'fcareri@svc.com', phone: '(760) 555-0109' },
  { id: 'c-10', name: 'Gerry Pelissier', role: 'PM', email: 'gpelissier@svc.com', phone: '(228) 555-0110' },
  // Superintendents
  { id: 'c-11', name: 'Pablo Carballeira', role: 'Super', email: 'pablo@svc.com', phone: '(201) 555-0201' },
  { id: 'c-12', name: 'Anthony Fraser', role: 'Super', email: 'anthony@svc.com', phone: '(813) 555-0202' },
  { id: 'c-13', name: 'Robert Depoortere', role: 'Super', email: 'robert@svc.com', phone: '(201) 555-0203' },
  { id: 'c-14', name: 'J. Haddad', role: 'Super', email: 'jhaddad@svc.com', phone: '(201) 555-0204' },
  { id: 'c-15', name: 'Michael Healy', role: 'Super', email: 'mhealy@svc.com', phone: '(732) 555-0205' },
  { id: 'c-16', name: 'Michael Cravo', role: 'Super', email: 'mcravo@svc.com', phone: '(973) 555-0206' },
  { id: 'c-17', name: 'Nathaniel Bowers', role: 'Super', email: 'nbowers@svc.com', phone: '(419) 555-0207' },
  { id: 'c-18', name: 'Sean Richards', role: 'Super', email: 'srichards@svc.com', phone: '(760) 555-0208' },
  { id: 'c-19', name: 'Mike McGuire', role: 'Super', email: 'mmcguire@svc.com', phone: '(253) 555-0209' },
  { id: 'c-20', name: 'Mike Thompson', role: 'Super', email: 'mthompson@svc.com', phone: '(201) 555-0210' },
]

// Helper functions
export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id)
}

export function getWorkerById(id: string): Worker | undefined {
  return workers.find(worker => worker.id === id)
}

export function getWorkerByEmail(email: string): Worker | undefined {
  return workers.find(worker => worker.email === email)
}

export function getTimeEntriesForJob(jobId: string): TimeEntry[] {
  return timeEntries.filter(entry => entry.jobId === jobId)
}

export function getReportsForJob(jobId: string): DailyReport[] {
  return dailyReports.filter(report => report.jobId === jobId)
}

export function getWeekEndingDate(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysUntilSunday)
  return sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
