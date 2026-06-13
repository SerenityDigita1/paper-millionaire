export type Holding = {
  ticker:    string
  shares:    number
  avgCost:   number
  label:     string
  note:      string
}

export const HOLDINGS: Holding[] = [
  { ticker: 'JFB',   shares: 5000, avgCost: 5.57,   label: 'JFB Construction Holdings', note: 'Drone / AI robotics catalyst — JFB x XTEND merger' },
  { ticker: 'UMAC',  shares: 500,  avgCost: 26.70,  label: 'Unusual Machines',        note: 'Drone-adjacent, stake in JFB XTEND merger' },
  { ticker: 'AVAV',  shares: 50,   avgCost: 185.92, label: 'AeroVironment',           note: 'Military unmanned aircraft systems' },
  { ticker: 'KO',    shares: 100,  avgCost: 79.48,  label: 'Coca-Cola',               note: '60+ years of consecutive dividend growth' },
  { ticker: 'O',     shares: 215,  avgCost: 60.84,  label: 'Realty Income',           note: 'Monthly dividend REIT' },
  { ticker: 'BRK-B', shares: 30,   avgCost: 488.13, label: 'Berkshire Hathaway B',    note: 'Capital preservation anchor' },
]

export const CASH        = 13792
export const START_VALUE = 100000
export const START_DATE  = '2026-06-07'
