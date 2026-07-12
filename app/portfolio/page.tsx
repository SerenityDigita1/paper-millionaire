import { CASH, annualDividendIncome, monthlyDividendIncome } from '@/lib/holdings'
import { getPortfolioData, type Position } from '@/lib/prices'

export const revalidate = 300

function pnlColor(n: number) {
  if (n > 0) return 'text-green'
  if (n < 0) return 'text-red'
  return 'text-white/50'
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default async function PortfolioPage() {
  const data = await getPortfolioData()
  const monthlyIncome = monthlyDividendIncome()
  const annualIncome  = annualDividendIncome()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      <div className="mb-10">
        <p className="text-gold font-mono text-xs tracking-widest uppercase mb-2">Live Tracker</p>
        <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-white/40 text-sm font-mono">
          Starting capital: $100,000 · Launched June 7, 2026 · Updated{' '}
          {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Portfolio Value', value: `$${fmt(data.totalValue)}` },
          { label: 'Total P&L',      value: `${data.totalPnl >= 0 ? '+' : ''}$${fmt(data.totalPnl)}`,     color: pnlColor(data.totalPnl) },
          { label: 'Return',         value: `${data.totalPnlPct >= 0 ? '+' : ''}${fmt(data.totalPnlPct)}%`, color: pnlColor(data.totalPnlPct) },
          { label: 'Cash',           value: `$${fmt(data.cash)}` },
        ].map(c => (
          <div key={c.label} className="bg-card border border-white/10 rounded-lg p-5">
            <p className={`font-mono text-xl font-bold mb-1 ${c.color ?? 'text-white'}`}>{c.value}</p>
            <p className="text-white/40 text-xs font-mono uppercase tracking-wide">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Dividend income banner */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gold font-mono text-xs tracking-widest uppercase mb-1">Passive Income</p>
          <p className="text-white text-lg font-bold">
            ${fmt(monthlyIncome)}<span className="text-white/40 font-normal text-sm">/mo</span>
            <span className="text-white/30 font-normal text-sm ml-3">· ${fmt(annualIncome)}/yr projected</span>
          </p>
          <p className="text-white/40 text-xs font-mono mt-1">
            KO (quarterly) + O (monthly) — dividends reinvested as fractional shares
          </p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-white font-mono font-bold">$48.50</p>
            <p className="text-white/40 text-xs font-mono">KO / quarter</p>
          </div>
          <div>
            <p className="text-white font-mono font-bold">$57.62</p>
            <p className="text-white/40 text-xs font-mono">O / month</p>
          </div>
        </div>
      </div>

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
              {data.positions.map((p: Position, i: number) => (
                <tr key={p.ticker} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-6 py-4">
                    <p className="text-gold font-bold">{p.ticker}</p>
                    <p className="text-white/40 text-xs">{p.label}</p>
                    {p.dividend && (
                      <p className="text-gold/50 text-xs mt-0.5">
                        ↻ DRIP · ${p.dividend.perShare}/{p.dividend.frequency === 'monthly' ? 'mo' : 'qtr'} per share
                      </p>
                    )}
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
              ))}

              {/* Cash row */}
              <tr className="border-t border-white/10 bg-white/[0.02]">
                <td className="px-6 py-4">
                  <p className="text-white/50 font-bold">CASH</p>
                  <p className="text-white/30 text-xs">Includes $1,000 Jul contribution</p>
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
