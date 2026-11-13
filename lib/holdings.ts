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
  XTND: {
    label: 'XTEND AI Robotics',
    note: 'Was JFB Construction Holdings. Merger closed 2026-09-03, 1:1 conversion, trades on the NYSE as XTND since 2026-09-04. Opened at $6.19, gave it all back within four sessions. Drone / defense robotics.',
  },
  UMAC: {
    label: 'Unusual Machines',
    note: 'Drone-adjacent, NDAA-compliant, strategic investor in the XTEND merger (formerly JFB). Trimmed 300 sh @ $34.06 on 2026-08-15 to cut a 25.7% portfolio weight. Rules on closes only (set 2026-10-24): cut all under $14.50, trim half at $24.00, no adds to a loser.',
  },
  AVAV: {
    label: 'AeroVironment',
    note: 'Military unmanned aircraft systems. Rules on closes only (set 2026-10-24): cut all under $112, trim half at $160, no adds to a loser.',
  },
  KO: {
    label: 'Coca-Cola',
    note: '60+ consecutive years of dividend growth. Ballast. Rules on closes only (set 2026-10-24): cut all under $84, no trim, no adds to a loser.',
    dividend: { perShare: 0.53, frequency: 'quarterly', drip: true },
  },
  O: {
    label: 'Realty Income',
    note: 'The Monthly Dividend Company — commercial REIT. Ballast. Rules on closes only (set 2026-10-24): cut all under $52.50, optional trim half at $65, no adds to a loser.',
    dividend: { perShare: 0.271, frequency: 'monthly', drip: true },
  },
  'BRK-B': {
    label: 'Berkshire Hathaway B',
    note: 'Capital preservation anchor — Greg Abel era. Ballast. Rules on closes only (set 2026-10-24): cut all under $495, no trim, no adds.',
  },
  S: {
    label: 'SentinelOne',
    note: 'AI-native cybersecurity — asymmetric bet. Rules on closes only (set 2026-10-24): cut all under $19.50, trim half at $30, no adds.',
  },
  WRAP: {
    label: 'Wrap Technologies',
    note: 'Counter-UAS / drone defense — exclusive US + NATO rights to Frenel Imaging physics-based sensing (WrapShield). Drone defense to complement drone offense. Rules on closes only (set 2026-10-24): cut all under $1.05, no adds to a loser.',
  },
  SOUN: {
    label: 'SoundHound AI',
    note: 'Bought 2026-10-20 with half the XTND sale proceeds: 1,363 sh @ $4.70. Sold half (681 sh) 2026-11-02 at $4.275 for $2,911.28. Sold the remaining 682 sh 2026-11-09 at the $4.09 open after the 11/6 close of $4.11 under the $4.25 cut, for $2,789.38. Closed. Total realized loss $705.44.',
  },
  DPRO: {
    label: 'Draganfly',
    note: 'Bought 2026-10-20 with half the XTND sale proceeds: 1,789 sh @ $3.58. Sold all 1,789 sh 2026-11-13 at the $2.83 close after the third close under the $3.05 cut (11/11 $3.00, 11/12 $2.88, 11/13 $2.83), for $5,062.87. Closed. Realized loss $1,341.75.',
  },
  LAR: {
    label: 'Lithium Argentina',
    note: 'Lithium producer. Starter position bought 2026-11-03 at the $4.01 close: 748 sh for $2,999.48, funded by cash freed by the UMAC cut. Rules on closes only: cut all under $3.60, trim half at $6.75, no adds to a loser.',
  },
  SHLD: {
    label: 'Global X Defense Tech',
    note: 'Defense technology ETF. First staged buy of the season: first half bought 2026-11-09 at the $59.20 open, 33 sh for $1,953.60, after closes inside the $58 to $60 zone on 11/5 and 11/6. Second half bought 2026-11-13 at the $59.795 close, 33 sh for $1,973.24, after the close inside the $58 to $60 zone. Full position: 66 sh, average cost $59.4976, total cost $3,926.84. Rules on closes only: cut all under $55, trim half at $70, no adds to a loser.',
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