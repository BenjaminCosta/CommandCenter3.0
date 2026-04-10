'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { JobCard } from '@/components/job-card'
import { workers, jobs } from '@/lib/data'
import { Clock, MessageSquare } from 'lucide-react'

export default function HomePage() {
  const worker = workers[0]
  const assignedJob = jobs.find(j => j.id === worker.assignedJobId)
  
  // Track clocked in state
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<string | null>(null)

  // Check sessionStorage for clock-in status on mount
  if (typeof window !== 'undefined' && !clockInTime) {
    const storedTime = sessionStorage.getItem('clockInTime')
    if (storedTime) {
      setIsClockedIn(true)
      setClockInTime(storedTime)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header workerName={worker.name} />
      
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 pb-24 flex flex-col">
        {/* Assigned Job - Minimal */}
        {assignedJob && (
          <div className="mb-8">
            <div className="border-l-4 border-l-orange">
              <JobCard job={assignedJob} showPM={false} variant="compact" />
            </div>
          </div>
        )}

        {/* Primary Action - Takes up 40%+ of screen */}
        <div className="flex-1 flex flex-col justify-center min-h-[45vh]">
          {isClockedIn ? (
            <>
              {/* Clocked In Status */}
              <div className="bg-green/10 border-l-4 border-l-green p-6 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-green" />
                  <div>
                    <p className="font-heading text-xl font-bold text-green uppercase">
                      Clocked In
                    </p>
                    <p className="font-mono text-sm text-green">{clockInTime}</p>
                  </div>
                </div>
              </div>
              
              {/* Clock Out Button */}
              <Link href="/clock-out" className="block">
                <Button className="w-full h-32 bg-black hover:bg-black/90 text-svc-white font-heading text-3xl font-bold uppercase tracking-wide btn-press">
                  Clock Out
                </Button>
              </Link>
            </>
          ) : (
            /* Clock In Button - Large and prominent */
            <Link href="/clock-in" className="block">
              <Button className="w-full h-48 bg-black hover:bg-black/90 text-svc-white font-heading text-4xl font-bold uppercase tracking-wide btn-press">
                Clock In
              </Button>
            </Link>
          )}
        </div>

        {/* Daily Report - Secondary action */}
        <div className="mt-8">
          <Link href="/daily-report" className="block">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-black text-black font-heading text-lg font-bold uppercase tracking-wide hover:bg-black/5 btn-press"
            >
              + Daily Report
            </Button>
          </Link>
        </div>

        {/* Feedback — subtle */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 text-grey/60 text-xs font-mono hover:text-grey transition-colors py-2"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Give app feedback</span>
          </Link>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
