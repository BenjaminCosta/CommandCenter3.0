'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft, Camera } from 'lucide-react'

type Step = 1 | 2 | 3

const PROGRESS = { 1: 'w-1/3', 2: 'w-2/3', 3: 'w-full' } as const

export default function DailyReportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [workCompleted, setWorkCompleted] = useState('')
  const [hasIssues, setHasIssues] = useState<boolean | null>(null)
  const [issueDetails, setIssueDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)

  const handleNext = () => {
    if (step === 1 && workCompleted.trim()) setStep(2)
    else if (step === 2 && hasIssues !== null) {
      if (hasIssues && !issueDetails.trim()) return
      setStep(3)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setShowSuccess(true), 300)
  }

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => router.push('/home'), 1500)
      return () => clearTimeout(t)
    }
  }, [showSuccess, router])

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-28 h-28 border-4 border-primary-container flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-6xl text-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4">
            DAILY REPORT / SUBMITTED
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tighter leading-none text-on-surface mb-3">
            Report Sent
          </h1>
          <p className="text-on-surface-variant font-mono text-sm">
            {assignedJob?.name}
          </p>
        </div>
      </div>
    )
  }

  const stepLabel = ['WORK SUMMARY', 'ISSUES', 'PHOTO'][step - 1]
  const canNext =
    (step === 1 && workCompleted.trim().length > 0) ||
    (step === 2 && hasIssues !== null && !(hasIssues && !issueDetails.trim()))

  return (
    <div className="h-dvh bg-background flex flex-col">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 bg-background safe-top shrink-0">
        <div className="max-w-lg mx-auto flex items-center h-16 px-6 gap-4">
          <Link href="/home" className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              DAILY REPORT / STAGE {String(step).padStart(2, '0')}
            </p>
            <p className="font-heading text-sm uppercase tracking-wide text-on-surface leading-none mt-0.5">
              {stepLabel}
            </p>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">{step}/3</span>
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
          <div className="flex-1 flex flex-col px-6 pt-8">
            <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-2">
              WHAT DID<br />YOU DO<br />TODAY?
            </h1>
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-8">
              {assignedJob?.name ?? 'Current assignment'}
            </p>
            {/* Cream textarea panel */}
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
          <div className="flex-1 flex flex-col px-6 pt-8">
            <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-8">
              ANY<br />ISSUES?
            </h1>
            <div className="flex gap-4 mb-8">
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
                  className="flex-1 p-4 bg-transparent text-on-secondary-fixed placeholder:text-on-secondary-fixed/40 text-base leading-relaxed resize-none focus:outline-none min-h-36"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Photo */}
        {step === 3 && (
          <div className="flex-1 flex flex-col px-6 pt-8">
            <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-2">
              ADD A<br />PHOTO
            </h1>
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-8">
              Optional — attach site progress photo
            </p>
            <button
              onClick={handleSubmit}
              className="w-full aspect-4/3 flex flex-col items-center justify-center border border-dashed border-outline-variant bg-surface-container-low hover:border-primary-container transition-colors"
            >
              <Camera className="w-12 h-12 text-on-surface-variant mb-3" strokeWidth={1} />
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                TAP TO CAPTURE
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Fixed footer CTA */}
      <div className="shrink-0 safe-bottom">
        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="w-full h-20 bg-primary-container hover:bg-primary text-on-primary-container font-heading text-3xl uppercase tracking-widest disabled:opacity-30 transition-none active:scale-[0.98] flex items-center justify-center gap-4"
          >
            NEXT
            <span className="material-symbols-outlined text-3xl">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-20 bg-primary-container hover:bg-primary text-on-primary-container font-heading text-3xl uppercase tracking-widest disabled:opacity-50 transition-none active:scale-[0.98] flex items-center justify-center gap-4"
          >
            {isSubmitting ? 'SENDING…' : 'SUBMIT'}
            {!isSubmitting && <span className="material-symbols-outlined text-3xl">send</span>}
          </button>
        )}
      </div>
    </div>
  )
}
