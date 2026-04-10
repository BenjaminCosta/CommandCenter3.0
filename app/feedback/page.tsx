'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, ThumbsUp, Minus, ThumbsDown } from 'lucide-react'

type Feeling = 'good' | 'neutral' | 'bad'

const feelings: { id: Feeling; icon: typeof ThumbsUp; label: string }[] = [
  { id: 'good', icon: ThumbsUp, label: 'Good' },
  { id: 'neutral', icon: Minus, label: 'Ok' },
  { id: 'bad', icon: ThumbsDown, label: 'Bad' },
]

export default function FeedbackPage() {
  const router = useRouter()
  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    if (!feeling || !feedbackText.trim()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => router.push('/home'), 1500)
    }, 300)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-primary-container flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-primary-container" strokeWidth={3} />
          </div>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4">
            FEEDBACK / RECEIVED
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tighter leading-none text-on-surface">
            Thanks!
          </h1>
          <p className="text-on-surface-variant font-mono text-sm mt-3">
            Your feedback was sent to the team
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background safe-top border-b-0">
        <div className="max-w-lg mx-auto flex items-center h-16 px-6 gap-4">
          <Link href="/home" className="h-11 w-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              COMMAND CENTER
            </p>
            <p className="font-heading text-sm uppercase tracking-wide text-on-surface leading-none mt-0.5">
              App Feedback
            </p>
          </div>
        </div>
        <div className="h-1 bg-surface-container-low w-full" />
      </header>

      <main className="flex-1 overflow-y-auto max-w-lg mx-auto w-full px-6 pt-8 pb-4 flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-5xl uppercase tracking-tighter leading-[0.9] text-on-surface mb-2">
            HOW&apos;S THE<br />APP?
          </h1>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Your input goes directly to the team
          </p>
        </div>

        {/* Feeling selector */}
        <div>
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">
            Select your experience
          </p>
          <div className="flex gap-3">
            {feelings.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setFeeling(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 h-20 border-2 transition-colors ${
                  feeling === id
                    ? 'border-primary-container bg-surface-container text-primary-container'
                    : 'border-outline-variant text-on-surface-variant hover:border-on-surface-variant'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-heading text-sm uppercase tracking-wide">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback textarea */}
        <div className="flex-1 flex flex-col">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">
            Tell us more
          </p>
          <div className="flex flex-1 bg-secondary-fixed">
            <div className="w-2 shrink-0 bg-primary-container" />
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What's working? What's not? What's missing?"
              className="flex-1 p-4 bg-transparent text-on-secondary-fixed placeholder:text-on-secondary-fixed/40 text-base leading-relaxed resize-none focus:outline-none min-h-40"
            />
          </div>
        </div>
      </main>

      <div className="shrink-0 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={!feeling || !feedbackText.trim() || isSubmitting}
          className="w-full h-24 bg-primary-container hover:bg-primary text-on-primary-container font-heading text-3xl uppercase tracking-tighter disabled:opacity-30 transition-colors"
        >
          {isSubmitting ? 'SENDING…' : 'SEND →'}
        </button>
      </div>
    </div>
  )
}
