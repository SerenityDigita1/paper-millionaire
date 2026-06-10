'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',           label: 'Home' },
  { href: '/portfolio',  label: 'Portfolio' },
  { href: '/episodes',   label: 'Episodes' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-white/10 sticky top-0 z-50 bg-navy/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-1 h-8 bg-gold rounded-full" />
          <div>
            <p className="text-gold font-mono text-xs tracking-widest uppercase">Paper Millionaire</p>
            <p className="text-white/50 font-mono text-xs">The $100K Experiment</p>
          </div>
        </Link>
        <ul className="flex gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-sm font-mono tracking-wide transition-colors ${
                  path === l.href
                    ? 'text-gold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
