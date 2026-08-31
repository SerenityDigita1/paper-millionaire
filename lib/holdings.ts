import portfolio from '@/data/portfolio.json'

export type Dividend = {
  perShare:  number
  frequency: 'monthly' | 'quarterly'
  drip:      boolean
}

export type Holding = {
  ticker:    string
  shares:    number
  avgCost:   number
  label:     string
  note:      string
  dividend?: Dividend
}

type HoldingOverlay = {
  label:     string
  note:      string
  dividend?: Dividend
}

/** Labels, notes, and dividend overlay. Shares, avgCost, cash, and contributions come from data/portfolio.json. */
const OVERLAY: Record<string, HoldingOverlay> = {
  JFB: {
    label: 'JFB Construction Holdings',
    note: 'Drone / AI robotics catalyst. SEC declared the S-4 effective 11 Aug 2026; closing expected 1 Sept. Becomes XTEND AI Robotics on the NYSE as XTND, 1:1 conversion, JFB holders take ~30% of the combined company.',
  },
  UMAC: {
    label: 'Unusual Machines',
    note: 'Drone-adjacent, NDAA-compliant, strategic investor in JFB x XTEND merger. Trimmed 300 sh @ $34.06 on 2026-08-15 to cut a 25.7% portfolio weight.',
  },
  AVAV: {
    label: 'AeroVironment',
    note: 'Military unmanned aircraft systems',
  },
  KO: {
    label: 'Coca-Cola',
    note: '60+ consecutive years of dividend growth',
    dividend: { perShare: 0.53, frequency: 'quarterly', drip: true },
  },
  O: {
    label: 'Realty Income',
    note: 'The Monthly Dividend Company — commercial REIT',
    dividend: { perShare: 0.271, frequency: 'monthly', drip: true },
  },
  'BRK-B': {
    label: 'Berkshire Hathaway B',
    note: 'Capital preservation anchor — Greg Abel era',
  },
  S: {
    label: 'SentinelOne',
    note: 'AI-native cybersecurity — asymmetric bet',
  },
  WRAP: {
    label: 'Wrap Technologies',
    note: 'Counter-UAS / drone defense — exclusive US + NATO rights to Frenel Imaging physics-based sensing (WrapShield). Drone defense to complement drone offense.',
  },
}

export const HOLDINGS: Holding[] = portfolio.holdings.map((row) => {
  const meta = OVERLAY[row.ticker]
  if (!meta) {
    throw new Error(`Missing holdings overlay for ticker ${row.ticker}`)
  }
  const holding: Holding = {
    ticker:  row.ticker,
    shares:  row.shares,
    avgCost: row.avgCost,
    label:   meta.label,
    note:    meta.note,
  }
  if (meta.dividend) holding.dividend = meta.dividend
  return holding
})

// Ep010 (2026-08-15): trimmed 300 UMAC @ $34.06 for $10,218 and deposited $700,
// taking cash from $3 to $10,921. Undeployed as of this episode.
export const CASH        = portfolio.cash
export const START_VALUE = portfolio.starting_value

/**
 * Everything paid into the account. Return is measured against this, not against
 * START_VALUE - otherwise every deposit reads as performance. Keep in step with
 * `contributions` in data/portfolio.json.
 */
export const CONTRIBUTIONS = portfolio.contributions

export const CONTRIBUTED = CONTRIBUTIONS.reduce((s, c) => s + c.amount, 0)

/** Dividends actually banked since START_DATE. DRIP is flagged but not auto-compounded. */
export const DIVIDENDS_RECEIVED = 169.53
export const START_DATE  = '2026-06-07'

/** Projected annual dividend income across all DRIP holdings */
export function annualDividendIncome(): number {
  return HOLDINGS.reduce((sum, h) => {
    if (!h.dividend) return sum
    const perYear = h.dividend.frequency === 'monthly'
      ? h.dividend.perShare * 12
      : h.dividend.perShare * 4
    return sum + perYear * h.shares
  }, 0)
}

/** Monthly equivalent dividend income */
export function monthlyDividendIncome(): number {
  return annualDividendIncome() / 12
}