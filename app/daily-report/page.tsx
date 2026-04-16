'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { workers, jobs, type DailyReport } from '@/lib/data'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const WAREHOUSE_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVhuheu6sFfN0qvXrmDWdNwHYHmjCoVqmJzXuSRdV6_TmNnB4VFoPQVIszSqyFprvrWAjqGHmBk9ld9dISWUJkRhAdZa7z2YUFQYFFXiKzLQCVgsR71wBC2PaPHEqXY59DT0IAgQfHXr4dMRn2L4kCyxDDOqqi7Bo91QQvnU8Hk7rI2tL_RpBSZjO1h8K9BDbykQCj3j_CeIsyfm_a8GaKCz8jOvQdOieQygzO5oBg1IdI1LfR6GQq5iJqudxFjSyIVeEOhG1pbVt0'

type Step = 1 | 2 | 3 | 4

const PROGRESS = { 1: 'w-1/4', 2: 'w-2/4', 3: 'w-3/4', 4: 'w-full' } as const
const STEP_LABEL = { 1: 'WORK SUMMARY', 2: 'ISSUES', 3: 'PHOTO', 4: 'PREVIEW' } as const

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export default function DailyReportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [workCompleted, setWorkCompleted] = useState('')
  const [hasIssues, setHasIssues] = useState<boolean | null>(null)
  const [issueDetails, setIssueDetails] = useState('')
  const [photoTaken, setPhotoTaken] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingReportId, setEditingReportId] = useState<string | null>(null)
  const [quickFeedback, setQuickFeedback] = useState<'good' | 'neutral' | 'bad' | null>(null)
  const [feedbackSent, setFeedbackSent] = useState(false)

  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)

  // Pre-fill from sessionStorage if editing an existing report
  useEffect(() => {
    const editData = sessionStorage.getItem('editReport')
    if (editData) {
      try {
        const r: DailyReport = JSON.parse(editData)
        setEditingReportId(r.id)
        setWorkCompleted(r.workCompleted)
        setHasIssues(r.hasIssues)
        setIssueDetails(r.issueDetails ?? '')
        setPhotoTaken(!!r.photoUrl)
        sessionStorage.removeItem('editReport')
      } catch {}
    }
  }, [])

  const handleNext = () => {
    if (step === 1 && workCompleted.trim()) setStep(2)
    else if (step === 2 && hasIssues !== null) {
      if (hasIssues && !issueDetails.trim()) return
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleConfirm = () => {
    setIsSubmitting(true)

    const now = Date.now()
    const today = new Date().toISOString().split('T')[0]

    // Load existing session reports
    let sessionReports: DailyReport[] = []
    try {
      sessionReports = JSON.parse(sessionStorage.getItem('sessionReports') ?? '[]')
    } catch {}

    if (editingReportId) {
      // Update existing report
      sessionReports = sessionReports.map(r =>
        r.id === editingReportId
          ? { ...r, workCompleted, hasIssues: hasIssues!, issueDetails, photoUrl: photoTaken ? WAREHOUSE_BG : undefined, editedAt: now }
          : r
      )
    } else {
      // Create new report
      const newReport: DailyReport = {
        id: `session-${now}`,
        workerId: worker.id,
        workerName: worker.name,
        jobId: worker.assignedJobId,
        date: today,
        workCompleted,
        hasIssues: hasIssues!,
        issueDetails: hasIssues ? issueDetails : undefined,
        photoUrl: photoTaken ? WAREHOUSE_BG : undefined,
        createdAt: now,
      }
      sessionReports.push(newReport)
    }

    sessionStorage.setItem('sessionReports', JSON.stringify(sessionReports))

    setTimeout(() => setShowSuccess(true), 300)
  }

  const handleQuickFeedback = (value: 'good' | 'neutral' | 'bad') => {
    setQuickFeedback(value)
    if (value === 'good') {
      sessionStorage.setItem('quickFeedback', 'good')
      setFeedbackSent(true)
      setTimeout(() => router.push('/reports'), 900)
    } else {
      sessionStorage.setItem('prefillFeedback', value)
      setTimeout(() => router.push('/feedback'), 200)
    }
  }

  if (showSuccess) {
    return (
      <div className="h-dvh bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center w-full max-w-sm">
          <div className="w-28 h-28 border-4 border-primary-container flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4">
            DAILY REPORT / {editingReportId ? 'UPDATED' : 'SUBMITTED'}
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tighter leading-none text-on-surface mb-3">
            {editingReportId ? 'Report Updated' : 'Report Sent'}
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">
            {assignedJob?.name}
          </p>

          {/* Quick feedback */}
          <div className="mt-10 border-t border-surface-container-low pt-8">
            {feedbackSent ? (
              <p className="font-mono text-xs text-primary-container uppercase tracking-widest">Thanks for the feedback!</p>
            ) : (
              <>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-5">
                  How was reporting today?
                </p>
                <div className="flex gap-3 justify-center">
                  {([
                    { value: 'good' as const, emoji: '👍' },
                    { value: 'neutral' as const, emoji: '😐' },
                    { value: 'bad' as const, emoji: '👎' },
                  ]).map(({ value, emoji }) => (
                    <button
                      key={value}
                      onClick={() => handleQuickFeedback(value)}
                      className={`w-20 h-20 border-2 flex items-center justify-center text-3xl transition-colors ${
                        quickFeedback === value
                          ? 'border-primary-container bg-surface-container'
                          : 'border-outline-variant hover:border-on-surface-variant'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const canNext =
    (step === 1 && workCompleted.trim().length > 0) ||
    (step === 2 && hasIssues !== null && !(hasIssues && !issueDetails.trim())) ||
    step === 3

  return (
    <div className="h-[calc(100dvh-3.5rem-4.25rem)] bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background safe-top shrink-0">
        <div className="max-w-lg mx-auto flex items-center h-16 px-6 gap-4">
          {step === 4 ? (
            <button
              onClick={() => setStep(3)}
              className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link href="/home" className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="flex-1">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              DAILY REPORT / STAGE {String(step).padStart(2, '0')}
            </p>
            <p className="font-heading text-sm uppercase tracking-wide text-on-surface leading-none mt-0.5">
              {STEP_LABEL[step]}
            </p>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">{step}/4</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-surface-container-low w-full">
          <div className={`h-full bg-primary-container transition-all duration-300 ${PROGRESS[step]}`} />
        </div>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto max-w-lg mx-auto w-full flex flex-col">

        {/* Step 1: Work Completed */}
        {step === 1 && (
          <div className="flex-1 flex flex-col px-6 pt-5">
            <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-2">
              WHAT DID<br />YOU DO<br />TODAY?
            </h1>
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-5">
              {assignedJob?.name ?? 'Current assignment'}
            </p>
            <div className="flex bg-secondary-fixed">
              <div className="w-2 shrink-0 bg-primary-container" />
              <textarea
                value={workCompleted}
                onChange={(e) => setWorkCompleted(e.target.value)}
                placeholder="Describe the work completed…"
                className="flex-1 p-4 bg-transparent text-on-secondary-fixed placeholder:text-on-secondary-fixed/40 text-base leading-relaxed resize-none focus:outline-none min-h-28"
              />
            </div>
          </div>
        )}

        {/* Step 2: Issues */}
        {step === 2 && (
          <div className="flex-1 flex flex-col px-6 pt-5">
            <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-5">
              ANY<br />ISSUES?
            </h1>
            <div className="flex gap-4 mb-5">
              <button
                onClick={() => setHasIssues(false)}
                className={`flex-1 h-20 flex items-center justify-center gap-3 border-2 transition-colors ${
                  hasIssues === false
                    ? 'bg-surface-container border-primary-container text-primary-container'
                    : 'border-outline-variant text-on-surface-variant hover:border-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">close</span>
                <span className="font-heading text-xl uppercase tracking-wide">No</span>
              </button>
              <button
                onClick={() => setHasIssues(true)}
                className={`flex-1 h-20 flex items-center justify-center gap-3 border-2 transition-colors ${
                  hasIssues === true
                    ? 'bg-surface-container border-red text-red'
                    : 'border-outline-variant text-on-surface-variant hover:border-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">check</span>
                <span className="font-heading text-xl uppercase tracking-wide">Yes</span>
              </button>
            </div>
            {hasIssues && (
              <div className="flex flex-1 bg-secondary-fixed">
                <div className="w-2 shrink-0 bg-red" />
                <textarea
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  placeholder="Describe the issue…"
                  className="flex-1 p-4 bg-transparent text-on-secondary-fixed placeholder:text-on-secondary-fixed/40 text-base leading-relaxed resize-none focus:outline-none min-h-28"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Photo */}
        {step === 3 && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 bg-surface-container-low px-6 py-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-outline uppercase">ATTACH PHOTO</span>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-1">
                Optional — site progress documentation
              </p>
            </div>
            <section
              className="grow relative bg-black overflow-hidden flex items-center justify-center border-y-8 border-surface-container-low cursor-pointer"
              onClick={() => setPhotoTaken(true)}
            >
              <div
                className="absolute inset-0 grayscale transition-opacity duration-500"
                style={{ backgroundImage: `url('${WAREHOUSE_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: photoTaken ? 0.65 : 0.35 }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0) 40%, rgba(15,15,15,0) 60%, rgba(15,15,15,0.85) 100%)' }} />
              <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-white opacity-60" />
              <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-white opacity-60" />
              <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-white opacity-60" />
              <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-white opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center backdrop-blur-sm transition-colors ${photoTaken ? 'border-tertiary bg-tertiary/10' : 'border-white bg-white/10'}`}>
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1", color: photoTaken ? '#0098dd' : 'white' }}>
                    {photoTaken ? 'check_circle' : 'photo_camera'}
                  </span>
                </div>
                <p className="font-mono text-xs text-white tracking-[0.3em] uppercase bg-black/50 px-3 py-1.5">
                  {photoTaken ? 'CAPTURED — TAP TO RETAKE' : 'CAPTURE SITE PHOTO'}
                </p>
              </div>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-40">
                <div className="w-1 h-8 bg-white" /><div className="w-1 h-2 bg-white" /><div className="w-1 h-2 bg-white" /><div className="w-1 h-2 bg-white" />
              </div>
            </section>
            <div className="shrink-0 px-6 py-3 grid grid-cols-2 gap-4 bg-surface-container-low">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-outline uppercase tracking-widest">DEVICE_ID</span>
                <span className="font-mono text-sm text-on-surface">SVC-XP-9902</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="font-mono text-[10px] text-outline uppercase tracking-widest">GPS_COORD</span>
                <span className="font-mono text-sm text-on-surface">34.0522° N, 118.2437° W</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="flex-1 flex flex-col px-6 pt-5 pb-6 gap-5">
            <div>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">PREVIEW REPORT</p>
              <h1 className="font-heading text-4xl uppercase tracking-tighter leading-[0.9] text-on-surface">
                CONFIRM<br />& SEND
              </h1>
            </div>

            {/* Work summary */}
            <div className="flex bg-secondary-fixed">
              <div className="w-2 shrink-0 bg-primary-container" />
              <div className="flex-1 p-4">
                <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest mb-2">WORK COMPLETED</p>
                <p className="text-on-secondary-fixed text-sm leading-relaxed">{workCompleted}</p>
              </div>
            </div>

            {/* Issues */}
            <div className={`flex ${hasIssues ? 'bg-secondary-fixed' : 'bg-surface-container-low'}`}>
              <div className={`w-2 shrink-0 ${hasIssues ? 'bg-red' : 'bg-surface-container-highest'}`} />
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-mono text-[10px] text-on-secondary-fixed/50 uppercase tracking-widest">ISSUES</p>
                  {hasIssues ? (
                    <span className="px-2 py-0.5 bg-red font-mono text-[9px] text-on-surface uppercase tracking-wider">REPORTED</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-surface-container-highest font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">NONE</span>
                  )}
                </div>
                {hasIssues && issueDetails && (
                  <p className="text-on-secondary-fixed text-sm leading-relaxed">{issueDetails}</p>
                )}
              </div>
            </div>

            {/* Photo */}
            <div className="flex bg-surface-container-low">
              <div className={`w-2 shrink-0 ${photoTaken ? 'bg-tertiary' : 'bg-surface-container-highest'}`} />
              <div className="flex-1 p-4">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">PHOTO</p>
                {photoTaken ? (
                  <div className="relative w-full h-24 overflow-hidden">
                    <div
                      className="absolute inset-0 grayscale"
                      style={{ backgroundImage: `url('${WAREHOUSE_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7 }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 bg-tertiary-container font-mono text-[9px] text-on-tertiary-container uppercase tracking-wider">CAPTURED</span>
                    </div>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">No photo attached</p>
                )}
              </div>
            </div>

            {/* Job info */}
            <div className="border-t border-surface-container-low pt-4">
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{assignedJob?.name ?? 'Unknown job'}</p>
              <p className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest mt-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <div className="shrink-0 safe-bottom border-t-2 border-surface-container-low">
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="w-full h-20 bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-between px-10 disabled:opacity-30 btn-press transition-colors"
          >
            <span className="font-heading text-4xl font-bold tracking-tighter uppercase">NEXT</span>
            <ArrowRight className="w-8 h-8" />
          </button>
        ) : (
          <div className="flex h-20">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 h-full bg-surface-container-high hover:bg-surface-container text-on-surface flex items-center justify-between px-6 transition-colors border-r border-surface-container-low"
            >
              <span className="font-heading text-2xl font-bold tracking-tighter uppercase">EDIT</span>
              <span className="material-symbols-outlined text-2xl">edit</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 h-full bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-between px-8 disabled:opacity-50 transition-colors"
            >
              <span className="font-heading text-4xl font-bold tracking-tighter uppercase">
                {isSubmitting ? 'SENDING…' : 'CONFIRM'}
              </span>
              {!isSubmitting && <ArrowRight className="w-8 h-8" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
