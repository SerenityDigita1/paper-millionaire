import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-gold font-mono text-sm tracking-widest uppercase">Change My Trajectory</p>
          <p className="text-white/40 text-xs mt-1">
            Not financial advice. Paper portfolio experiment.{' '}
            <Link href="/disclaimer" className="underline hover:text-white/70 transition-colors">
              Full disclaimer →
            </Link>
          </p>
        </div>
        <div className="flex gap-6 text-white/40 text-xs font-mono">
          <a
            href="https://www.youtube.com/@PaperMillionaire"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            YouTube
          </a>
          <Link href="/portfolio" className="hover:text-gold transition-colors">Portfolio</Link>
          <Link href="/episodes"  className="hover:text-gold transition-colors">Episodes</Link>
        </div>
      </div>
    </footer>
  )
}
