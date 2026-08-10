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

export const HOLDINGS: Holding[] = [
  {
    ticker: 'JFB', shares: 6588, avgCost: 5.40,
    label: 'JFB Construction Holdings',
    note: 'Drone / AI robotics catalyst — JFB × XTEND merger (XTND on Nasdaq, Q3 2026)',
  },
  {
    ticker: 'UMAC', shares: 800, avgCost: 24.47,
    label: 'Unusual Machines',
    note: 'Drone-adjacent, NDAA-compliant, strategic investor in JFB × XTEND merger',
  },
  {
    ticker: 'AVAV', shares: 50, avgCost: 185.92,
    label: 'AeroVironment',
    note: 'Military unmanned aircraft systems',
  },
  {
    ticker: 'KO', shares: 100, avgCost: 79.48,
    label: 'Coca-Cola',
    note: '60+ consecutive years of dividend growth',
    dividend: { perShare: 0.485, frequency: 'quarterly', drip: true },
  },
  {
    ticker: 'O', shares: 215, avgCost: 60.84,
    label: 'Realty Income',
    note: 'The Monthly Dividend Company — commercial REIT',
    dividend: { perShare: 0.268, frequency: 'monthly', drip: true },
  },
  {
    ticker: 'BRK-B', shares: 30, avgCost: 488.13,
    label: 'Berkshire Hathaway B',
    note: 'Capital preservation anchor — Greg Abel era',
  },
  {
    ticker: 'S', shares: 25, avgCost: 15.19,
    label: 'SentinelOne',
    note: 'AI-native cybersecurity — asymmetric bet',
  },
  {
    ticker: 'WRAP', shares: 406, avgCost: 2.46,
    label: 'Wrap Technologies',
    note: 'Counter-UAS / drone defense — exclusive US + NATO rights to Frenel Imaging physics-based sensing (WrapShield). Drone defense to complement drone offense.',
  },
]

// $1,000 Jul contribution deployed into WRAP; ~$3 remaining
export const CASH        = 3
export const START_VALUE = 100000
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
