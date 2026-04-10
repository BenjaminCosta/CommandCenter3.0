'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Check, ThumbsUp, Minus, ThumbsDown } from 'lucide-react'

type Feeling = 'good' | 'neutral' | 'bad'

const feelings = [
  { id: 'good' as Feeling, icon: ThumbsUp, label: 'Good' },
  { id: 'neutral' as Feeling, icon: Minus, label: 'Ok' },
  { id: 'bad' as Feeling, icon: ThumbsDown, label: 'Bad' },
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 fade-in">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-orange rounded-full flex items-center justify-center mx-auto mb-8 check-pop">
            <Check className="w-12 h-12 text-orange" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-svc-white mb-2">Thanks!</h1>
          <p className="text-svc-white/60 font-mono text-sm">Your feedback was received</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <Link
            href="/home"
            className="mr-4 min-h-[48px] min-w-[48px] flex items-center justify-center -ml-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide">
            App Feedback
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-8">
        <p className="text-grey text-sm font-sans leading-relaxed">
          Help us improve Command Center. Your input goes directly to the team.
        </p>

        {/* Feeling selector */}
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-grey mb-4">
            How's the app feeling?
          </p>
          <div className="flex gap-3">
            {feelings.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setFeeling(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 h-20 border-2 transition-all btn-press ${
                  feeling === id
                    ? 'border-orange bg-orange/10'
                    : 'border-border hover:border-grey'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${feeling === id ? 'text-orange' : 'text-grey'}`}
                  strokeWidth={1.5}
                />
                <span
                  className={`font-heading text-sm font-bold uppercase tracking-wide ${
                    feeling === id ? 'text-orange' : 'text-grey'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback text */}
        <div className="flex-1 flex flex-col">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-grey mb-4">
            Tell us more
          </p>
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="What's working? What's not? What's missing?"
            className="flex-1 min-h-[160px] bg-card border-border text-black placeholder:text-grey text-base leading-relaxed resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!feeling || !feedbackText.trim() || isSubmitting}
          className="w-full h-14 bg-black hover:bg-black/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide disabled:opacity-40 btn-press"
        >
          {isSubmitting ? 'Sending...' : 'Send Feedback'}
        </Button>
      </main>
    </div>
  )
}
