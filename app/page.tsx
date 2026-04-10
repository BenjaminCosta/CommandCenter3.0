'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
      if (isAdmin) {
        router.push('/admin')
      } else {
        router.push('/home')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-heading text-7xl font-bold text-orange tracking-tight">
            SVC
          </h1>
          <p className="mt-3 text-grey text-sm font-mono uppercase tracking-wider">
            Command Center
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 bg-svc-white border-0 text-black placeholder:text-grey font-sans text-base"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-orange hover:bg-orange/90 text-svc-white font-heading text-xl font-bold uppercase tracking-wide btn-press"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-grey/60 text-xs font-mono">
          Use any email to sign in as worker
          <br />
          Use &quot;admin@svc.com&quot; for admin view
        </p>
      </div>
    </div>
  )
}
