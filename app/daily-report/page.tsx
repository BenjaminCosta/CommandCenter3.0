'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft, Camera, Check, X } from 'lucide-react'

type Step = 1 | 2 | 3

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
    if (step === 1 && workCompleted.trim()) {
      setStep(2)
    } else if (step === 2 && hasIssues !== null) {
      if (hasIssues && !issueDetails.trim()) return
      setStep(3)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setShowSuccess(true)
    }, 300)
  }

  const handleSkipPhoto = () => {
    handleSubmit()
  }

  // Auto-navigate after success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push('/home')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, router])

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 fade-in">
        <div className="text-center">
          <div className="w-28 h-28 border-4 border-orange rounded-full flex items-center justify-center mx-auto mb-8 check-pop">
            <Check className="w-14 h-14 text-orange" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-4xl font-bold text-svc-white mb-3">
            Report Submitted
          </h1>
          <p className="text-svc-white/70 font-heading text-xl">
            {assignedJob?.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <Link href="/home" className="mr-4 min-h-[48px] min-w-[48px] flex items-center justify-center -ml-3">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide">
            Daily Report
          </h1>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">{step} of 3</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 ${s <= step ? 'bg-orange' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col">
        {/* Step 1: Work Completed */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="font-heading text-2xl font-bold text-black mb-6">
              What did you work on today?
            </h2>
            <Textarea
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              placeholder="Describe the work completed..."
              className="flex-1 min-h-[200px] bg-card border-border text-black placeholder:text-grey text-lg leading-relaxed resize-none"
            />
            <Button
              onClick={handleNext}
              disabled={!workCompleted.trim()}
              className="mt-6 w-full h-14 bg-orange hover:bg-orange/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide disabled:opacity-40 btn-press"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Issues */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="font-heading text-2xl font-bold text-black mb-8">
              Any issues to report?
            </h2>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setHasIssues(false)}
                className={`flex-1 h-20 flex items-center justify-center gap-3 border-2 transition-colors btn-press ${
                  hasIssues === false 
                    ? 'bg-green/10 border-green text-green' 
                    : 'border-border text-grey hover:border-grey'
                }`}
              >
                <X className="w-6 h-6" />
                <span className="font-heading text-xl font-bold uppercase">No</span>
              </button>
              <button
                onClick={() => setHasIssues(true)}
                className={`flex-1 h-20 flex items-center justify-center gap-3 border-2 transition-colors btn-press ${
                  hasIssues === true 
                    ? 'bg-red/10 border-red text-red' 
                    : 'border-border text-grey hover:border-grey'
                }`}
              >
                <Check className="w-6 h-6" />
                <span className="font-heading text-xl font-bold uppercase">Yes</span>
              </button>
            </div>

            {hasIssues && (
              <div className="flex-1 fade-in">
                <Textarea
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  placeholder="Describe the issue..."
                  className="min-h-[150px] bg-card border-border text-black placeholder:text-grey text-lg leading-relaxed resize-none"
                />
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={hasIssues === null || (hasIssues && !issueDetails.trim())}
              className="mt-6 w-full h-14 bg-orange hover:bg-orange/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide disabled:opacity-40 btn-press"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 3: Photo */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h2 className="font-heading text-2xl font-bold text-black mb-6">
              Add a photo (optional)
            </h2>
            
            <button
              onClick={handleSubmit}
              className="w-full aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-grey bg-muted hover:border-orange transition-colors mb-6 btn-press"
            >
              <Camera className="w-12 h-12 text-grey mb-3" />
              <span className="text-lg text-grey">Tap to take photo</span>
            </button>

            <div className="mt-auto space-y-3">
              <Button
                onClick={handleSkipPhoto}
                disabled={isSubmitting}
                variant="outline"
                className="w-full h-14 border-2 border-black text-black font-heading text-xl font-bold uppercase tracking-wide hover:bg-black/5 btn-press"
              >
                {isSubmitting ? 'Submitting...' : 'Skip & Submit'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
