'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const isAdmin = email.toLowerCase() === 'admin@svc.com'
      sessionStorage.setItem('userRole', isAdmin ? 'admin' : 'worker')
      sessionStorage.setItem('userEmail', email)
      if (isAdmin) sessionStorage.setItem('adminViewActive', 'true')
      router.push(isAdmin ? '/admin' : '/home')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero: logo + branding */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Top scan divider */}
        <div className="w-full max-w-xs flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-surface-container-high" />
          <span className="font-mono text-[9px] text-on-surface-variant/50 uppercase tracking-[0.3em]">
            SVC GROUP
          </span>
          <div className="flex-1 h-px bg-surface-container-high" />
        </div>

        {/* Large logo */}
        <img
          src="/logo.png"
          alt="SVC Command Center"
          className="w-56 h-auto mx-auto"
          style={{ filter: 'drop-shadow(0 0 32px rgba(226,113,33,0.15))' }}
        />

        {/* App name */}
        <div className="mt-8 text-center">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.35em]">
            FIELD OPERATIONS
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tighter text-on-surface mt-1 leading-[0.9]">
            COMMAND<br />CENTER
          </h1>
        </div>

        {/* Bottom scan divider */}
        <div className="w-full max-w-xs flex items-center gap-4 mt-10">
          <div className="flex-1 h-px bg-surface-container-high" />
          <span className="font-mono text-[9px] text-on-surface-variant/50 uppercase tracking-[0.3em]">
            v3.0
          </span>
          <div className="flex-1 h-px bg-surface-container-high" />
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full max-w-sm mx-auto px-6 pb-14 space-y-3">
        <form onSubmit={handleSignIn} className="space-y-3">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full h-14 px-5 bg-surface-container text-on-surface border border-outline-variant placeholder:text-on-surface-variant/40 font-mono text-sm tracking-widest focus:outline-none focus:border-primary-container transition-colors uppercase"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-primary-container hover:bg-primary text-on-primary-container font-heading font-extrabold text-2xl uppercase tracking-widest disabled:opacity-40 transition-colors flex items-center justify-between px-6"
          >
            <span>{isLoading ? 'SIGNING IN…' : 'SIGN IN'}</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </form>
        <p className="text-center text-on-surface-variant/30 font-mono text-[9px] uppercase tracking-widest pt-3">
          Any email → worker · admin@svc.com → admin
        </p>
      </div>
    </div>
  )
}
