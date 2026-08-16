import { HOLDINGS, CASH, CONTRIBUTED, type Dividend } from './holdings'

export type Position = {
  ticker:    string
  label:     string
  note:      string
  shares:    number
  avgCost:   number
  price:     number
  value:     number
  pnl:       number
  pnlPct:    number
  live:      boolean
  dividend?: Dividend
}

export type PortfolioData = {
  positions:   Position[]
  cash:        number
  totalValue:  number
  totalPnl:    number
  totalPnlPct: number
  updatedAt:   string
}

async function fetchPrice(ticker: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; changemytrajectory/1.0)' },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null
  } catch {
    return null
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const prices = await Promise.all(HOLDINGS.map(h => fetchPrice(h.ticker)))

  let totalValue = CASH
  const positions: Position[] = HOLDINGS.map((h, i) => {
    const price     = prices[i] ?? h.avgCost
    const value     = h.shares * price
    const costBasis = h.shares * h.avgCost
    const pnl       = value - costBasis
    const pnlPct    = (pnl / costBasis) * 100
    totalValue += value
    return {
      ticker:   h.ticker,
      label:    h.label,
      note:     h.note,
      shares:   h.shares,
      avgCost:  h.avgCost,
      price:    Math.round(price * 100) / 100,
      value:    Math.round(value * 100) / 100,
      pnl:      Math.round(pnl * 100) / 100,
      pnlPct:   Math.round(pnlPct * 100) / 100,
      live:     prices[i] !== null,
      dividend: h.dividend,
    }
  })

  // Measure against capital actually paid in. Two earlier versions were wrong:
  // adding CASH to the cost basis broke once a trade closed (realised profit
  // lands in cash and inflated the denominator), and measuring against a flat
  // $100,000 counted every deposit as if it were performance.
  const totalPnl    = totalValue - CONTRIBUTED
  const totalPnlPct = (totalPnl / CONTRIBUTED) * 100

  return {
    positions,
    cash:        CASH,
    totalValue:  Math.round(totalValue * 100) / 100,
    totalPnl:    Math.round(totalPnl * 100) / 100,
    totalPnlPct: Math.round(totalPnlPct * 100) / 100,
    updatedAt:   new Date().toISOString(),
  }
}
