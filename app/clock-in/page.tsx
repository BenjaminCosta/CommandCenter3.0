'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft, Camera, MapPin, Check } from 'lucide-react'

export default function ClockInPage() {
  const router = useRouter()
  const [photoTaken, setPhotoTaken] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)

  const handlePhotoCapture = () => {
    setPhotoTaken(true)
  }

  const handleConfirm = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      // Store clock-in time
      const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      sessionStorage.setItem('clockInTime', now)
      setShowSuccess(true)
    }, 300)
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
            {"You're In"}
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
            Clock In
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col">
        {/* Photo Capture - Main focus */}
        <div className="flex-1 flex flex-col">
          <button
            onClick={handlePhotoCapture}
            className={`w-full aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed transition-colors mb-6 min-h-[48px] ${
              photoTaken 
                ? 'bg-green/10 border-green' 
                : 'bg-muted border-grey hover:border-orange'
            }`}
          >
            {photoTaken ? (
              <>
                <Check className="w-12 h-12 text-green mb-3" />
                <span className="text-lg text-green font-medium">Photo captured</span>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-grey mb-3" />
                <span className="text-lg text-grey">Tap to take jobsite photo</span>
              </>
            )}
          </button>

          {/* Location Pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green/10 text-green">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Location confirmed</span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!photoTaken || isSubmitting}
          className="w-full h-16 bg-orange hover:bg-orange/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide disabled:opacity-40 btn-press"
        >
          {isSubmitting ? 'Starting...' : 'Confirm'}
        </Button>
      </main>
    </div>
  )
}
