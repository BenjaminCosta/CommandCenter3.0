'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { workers, jobs } from '@/lib/data'
import { ArrowLeft } from 'lucide-react'

const WAREHOUSE_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVhuheu6sFfN0qvXrmDWdNwHYHmjCoVqmJzXuSRdV6_TmNnB4VFoPQVIszSqyFprvrWAjqGHmBk9ld9dISWUJkRhAdZa7z2YUFQYFFXiKzLQCVgsR71wBC2PaPHEqXY59DT0IAgQfHXr4dMRn2L4kCyxDDOqqi7Bo91QQvnU8Hk7rI2tL_RpBSZjO1h8K9BDbykQCj3j_CeIsyfm_a8GaKCz8jOvQdOieQygzO5oBg1IdI1LfR6GQq5iJqudxFjSyIVeEOhG1pbVt0"

export default function ClockInPage() {
  const router = useRouter()
  const [photoTaken, setPhotoTaken] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)
  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const handleConfirm = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      sessionStorage.setItem('clockInTime', now)
      setShowSuccess(true)
    }, 300)
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => router.push('/home'), 1500)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, router])

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 fade-in">
        <div className="text-center">
          <div className="w-28 h-28 border-4 border-tertiary flex items-center justify-center mx-auto mb-8 check-pop">
            <span
              className="material-symbols-outlined text-6xl text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="font-heading text-5xl text-on-surface mb-3 uppercase tracking-tighter">
            {"YOU'RE IN"}
          </h1>
          <p className="text-on-surface-variant font-mono text-xs uppercase tracking-widest">
            {assignedJob?.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-3.5rem-3.5rem)] bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#0f0f0f] safe-top shrink-0">
        <div className="h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home" className="h-11 w-11 flex items-center justify-center -ml-2">
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </Link>
            <h1 className="font-heading text-3xl tracking-tighter uppercase text-primary-container">
              CLOCK IN
            </h1>
          </div>
        </div>
        <div className="bg-surface-container-low h-1 w-full" />
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Job Context */}
        <div className="shrink-0 bg-surface-container-low px-6 py-4 flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-outline uppercase">
            CURRENT ASSIGNMENT
          </span>
          <h2 className="font-heading text-4xl tracking-tight uppercase leading-none mt-1 text-on-surface">
            {assignedJob?.name ?? 'NO JOB ASSIGNED'}
          </h2>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div
              className={`h-8 flex items-center px-4 font-mono text-xs tracking-wider gap-2 transition-colors ${
                photoTaken
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {photoTaken ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              {photoTaken ? 'LOCATION CONFIRMED' : 'AWAITING PHOTO'}
            </div>
            <div className="h-8 px-4 bg-surface-container-highest flex items-center font-mono text-xs text-on-surface-variant">
              {now}
            </div>
          </div>
        </div>

        {/* Camera Capture Area */}
        <section
          className="grow relative bg-black overflow-hidden flex items-center justify-center border-y-8 border-surface-container-low cursor-pointer"
          onClick={() => setPhotoTaken(true)}
        >
          {/* Simulated camera feed */}
          <div
            className="absolute inset-0 grayscale transition-opacity duration-500"
            style={{
              backgroundImage: `url('${WAREHOUSE_BG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: photoTaken ? 0.65 : 0.35,
            }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(0deg, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0) 40%, rgba(15,15,15,0) 60%, rgba(15,15,15,0.85) 100%)',
            }}
          />
          {/* Viewfinder corners */}
          <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-white opacity-60" />
          <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-white opacity-60" />
          <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-white opacity-60" />
          <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-white opacity-60" />

          {/* Camera trigger */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center backdrop-blur-sm transition-colors ${
                photoTaken
                  ? 'border-tertiary bg-tertiary/10'
                  : 'border-white bg-white/10'
              }`}
            >
              <span
                className="material-symbols-outlined text-5xl"
                style={{
                  fontVariationSettings: "'FILL' 1",
                  color: photoTaken ? '#0098dd' : 'white',
                }}
              >
                {photoTaken ? 'check_circle' : 'photo_camera'}
              </span>
            </div>
            <p className="font-mono text-xs text-white tracking-[0.3em] uppercase bg-black/50 px-3 py-1.5">
              {photoTaken ? 'CAPTURED — TAP TO RETAKE' : 'CAPTURE PHOTO IDENTITY'}
            </p>
          </div>

          {/* Side scan lines */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-40">
            <div className="w-1 h-8 bg-white" />
            <div className="w-1 h-2 bg-white" />
            <div className="w-1 h-2 bg-white" />
            <div className="w-1 h-2 bg-white" />
          </div>
        </section>

        {/* Technical Metadata */}
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
      </main>

      {/* Footer CTA */}
      <footer className="shrink-0 safe-bottom">
        <button
          onClick={handleConfirm}
          disabled={!photoTaken || isSubmitting}
          className="w-full h-16 bg-primary-container hover:bg-primary text-on-primary-container font-heading font-extrabold text-2xl uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-30 transition-colors active:scale-[0.98]"
        >
          {isSubmitting ? 'STARTING…' : 'START WORKING'}
          <span className="material-symbols-outlined text-3xl">play_arrow</span>
        </button>
      </footer>
    </div>
  )
}
