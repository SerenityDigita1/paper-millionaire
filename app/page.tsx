import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import Affiliate from '@/components/Affiliate'
import { EPISODES } from '@/lib/episodes'

export default function Home() {
  const latest = EPISODES.reduce((a, b) => (a.number > b.number ? a : b))

  return (
    <div className="max-w-6xl mx-auto px-6">

      {/* Hero */}
      <section className="pt-24 pb-20 text-center fade-up">
        <p className="text-gold font-mono text-xs tracking-widest uppercase mb-4">
          Change My Trajectory
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          The{' '}
          <span className="text-gold">$100K</span>
          <br />Experiment
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
          Can a disciplined non-professional build real wealth without gambling, panic-selling,
          or pretending losses didn&apos;t happen?
        </p>
        <p className="text-white/40 text-base max-w-xl mx-auto mb-12">
          Every week we document every move, every mistake, and every thesis behind the{' '}
          <span className="text-gold font-mono">Paper Millionaire</span> portfolio — live.
        </p>

        {/* Email capture */}
        <div className="mb-6">
          <EmailCapture />
        </div>
        <p className="text-white/30 text-xs font-mono">
          Weekly update. No spam. Unsubscribe anytime.
        </p>
      </section>

      {/* Gold rule */}
      <div className="gold-rule mb-20" />

      {/* Stats strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { label: 'Starting Capital', value: '$100,000' },
          { label: 'Positions',        value: '8 Stocks' },
          { label: 'Started',          value: 'June 2026' },
          { label: 'Goal',             value: '$10M' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-white/10 rounded-lg p-6 text-center">
            <p className="text-gold font-mono text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-white/40 text-xs font-mono uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Latest episode */}
      {latest.youtubeId !== 'REPLACE_WITH_VIDEO_ID' && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-mono text-lg tracking-wide">Latest Episode</h2>
            <Link href="/episodes" className="text-gold font-mono text-xs hover:underline">
              All episodes →
            </Link>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${latest.youtubeId}`}
              title={latest.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-white/50 text-sm mt-3 font-mono">
            EP. {String(latest.number).padStart(3, '0')} — {latest.title}
          </p>
        </section>
      )}

      {/* How it works */}
      <section className="mb-20">
        <h2 className="text-white font-mono text-lg tracking-wide mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Paper Portfolio',
              body:  'We trade a simulated $100K account — every decision is public, every thesis is explained. Set up your own and follow along.',
            },
            {
              step: '02',
              title: 'Weekly Episodes',
              body:  'Every week a new video breaks down what moved, what didn\'t, and what we\'re watching next. No sponsored picks. No pretending losses didn\'t happen.',
            },
            {
              step: '03',
              title: 'Live Tracker',
              body:  'The portfolio page updates with live prices so you always know where we stand between episodes.',
            },
          ].map(item => (
            <div key={item.step} className="bg-card border border-white/10 rounded-lg p-6">
              <p className="text-gold font-mono text-3xl font-bold mb-3">{item.step}</p>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we actually use */}
      <section className="mb-20">
        <h2 className="text-white font-mono text-lg tracking-wide mb-8">What we actually use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">
              <Affiliate search="The Psychology of Money Morgan Housel">The Psychology of Money</Affiliate>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Morgan Housel on why people panic-sell. The reminder we come back to when a week goes against us.
            </p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">
              <Affiliate search="The Intelligent Investor Benjamin Graham">The Intelligent Investor</Affiliate>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Benjamin Graham&apos;s margin of safety — the framework behind how we size a thesis, not a hot take.
            </p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">
              <Affiliate search="trading journal notebook">A trading journal notebook</Affiliate>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Every decision written down before the market opens. If it isn&apos;t in the journal, it didn&apos;t happen.
            </p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-bold mb-2">
              <Affiliate search="24 inch computer monitor">A second monitor</Affiliate>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Charts on one screen, the thesis on the other. Nothing fancy — just room to think.
            </p>
          </div>
        </div>
        <p className="text-white/30 text-xs font-mono mt-6">
          Amazon Associates, we earn on qualifying purchases at no extra cost. Not financial advice. Not sponsored stock picks.
        </p>
      </section>

      {/* CTA banner */}
      <section className="mb-24 bg-card border border-gold/30 rounded-xl p-10 text-center">
        <h2 className="text-white text-2xl font-bold mb-3">
          Run the experiment alongside us.
        </h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">
          Set up your own paper portfolio, follow the same tickers, and see who comes out ahead.
          No membership. No fee. No pretending.
        </p>
        <EmailCapture />
      </section>

    </div>
  )
}
