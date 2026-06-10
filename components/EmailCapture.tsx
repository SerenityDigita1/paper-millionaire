'use client'
import { useState } from 'react'

export default function EmailCapture({ compact = false }: { compact?: boolean }) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('done')
        setMessage("You're in. Weekly update drops every Sunday.")
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className={`${compact ? 'py-4' : 'py-8'} text-center`}>
        <p className="text-green font-mono text-sm">✓ {message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={`flex flex-col sm:flex-row gap-3 ${compact ? '' : 'max-w-md mx-auto'}`}>
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:border-gold transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gold text-navy font-mono font-bold text-sm px-6 py-3 rounded hover:bg-gold/90 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Sending...' : 'Follow the Experiment →'}
      </button>
      {status === 'error' && (
        <p className="text-red text-xs font-mono mt-1 sm:col-span-2">{message}</p>
      )}
    </form>
  )
}
