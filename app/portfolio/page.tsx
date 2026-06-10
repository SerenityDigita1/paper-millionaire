import { CASH, START_VALUE } from '@/lib/holdings'

export const revalidate = 300

type Position = {
  ticker:  string
  label:   string
  note:    string
  shares:  number
  avgCost: number
  price:   number
  value:   number
  pnl:     number
  pnlPct:  number
  live:    boolean
}

type PortfolioData = {
  positions:   Position[]
  cash:        number
  totalValue:  number
  totalPnl:    number
  totalPnlPct: number
  updatedAt:   string
}

async function getPortfolio(): Promise<PortfolioData | null> {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${base}/api/portfolio`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function pnlColor(n: number) {
  if (n > 0)  return 'text-green'
  if (n < 0)  return 'text-red'
  return 'text-white/50'
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default async function PortfolioPage() {
  const data = await getPortfolio()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      <div className="mb-10">
        <p className="text-gold font-mono text-xs tracking-widest uppercase mb-2">Live Tracker</p>
        <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-white/40 text-sm font-mono">
          Starting capital: $100,000 · Launched June 7, 2026
          {data && (
            <> · Updated {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</>
          )}
        </p>
      </div>

      {/* Summary cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Portfolio Value', value: `$${fmt(data.totalValue)}` },
            { label: 'Total P&L',      value: `${data.totalPnl >= 0 ? '+' : ''}$${fmt(data.totalPnl)}`, color: pnlColor(data.totalPnl) },
            { label: 'Return',         value: `${data.totalPnlPct >= 0 ? '+' : ''}${fmt(data.totalPnlPct)}%`, color: pnlColor(data.totalPnlPct) },
            { label: 'Cash Remaining', value: `$${fmt(data.cash)}` },
          ].map(c => (
            <div key={c.label} className="bg-card border border-white/10 rounded-lg p-5">
              <p className={`font-mono text-xl font-bold mb-1 ${c.color ?? 'text-white'}`}>{c.value}</p>
              <p className="text-white/40 text-xs font-mono uppercase tracking-wide">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Holdings table */}
      <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-mono text-sm tracking-wide uppercase">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3">Ticker</th>
                <th className="text-right px-4 py-3">Shares</th>
                <th className="text-right px-4 py-3">Avg Cost</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Value</th>
                <th className="text-right px-6 py-3">P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {data ? data.positions.map((p, i) => (
                <tr key={p.ticker} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-6 py-4">
                    <p className="text-gold font-bold">{p.ticker}</p>
                    <p className="text-white/40 text-xs">{p.label}</p>
                  </td>
                  <td className="text-right px-4 py-4 text-white/70">{p.shares.toLocaleString()}</td>
                  <td className="text-right px-4 py-4 text-white/70">${fmt(p.avgCost)}</td>
                  <td className="text-right px-4 py-4 text-white">
                    ${fmt(p.price)}
                    {!p.live && <span className="text-white/20 text-xs ml-1">(est)</span>}
                  </td>
                  <td className="text-right px-4 py-4 text-white">${fmt(p.value)}</td>
                  <td className={`text-right px-6 py-4 font-bold ${pnlColor(p.pnl)}`}>
                    {p.pnl >= 0 ? '+' : ''}{fmt(p.pnlPct)}%
                    <p className="text-xs font-normal opacity-70">
                      {p.pnl >= 0 ? '+' : ''}${fmt(p.pnl)}
                    </p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-white/30 font-mono text-sm">
                    Loading live prices...
                  </td>
                </tr>
              )}

              {/* Cash row */}
              <tr className="border-t border-white/10 bg-white/[0.02]">
                <td className="px-6 py-4">
                  <p className="text-white/50 font-bold">CASH</p>
                  <p className="text-white/30 text-xs">Uninvested capital</p>
                </td>
                <td className="text-right px-4 py-4 text-white/30">—</td>
                <td className="text-right px-4 py-4 text-white/30">—</td>
                <td className="text-right px-4 py-4 text-white/30">—</td>
                <td className="text-right px-4 py-4 text-white/50">${fmt(CASH)}</td>
                <td className="text-right px-6 py-4 text-white/30">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-white/20 text-xs font-mono mt-6 text-center">
        Prices refresh every 5 minutes. This is a paper portfolio — not real money.{' '}
        <a href="/disclaimer" className="underline hover:text-white/40 transition-colors">
          Full disclaimer
        </a>
      </p>
    </div>
  )
}
