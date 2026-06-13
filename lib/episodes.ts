export type Episode = {
  number:      number
  title:       string
  date:        string
  youtubeId:   string
  description: string
}

export const EPISODES: Episode[] = [
  {
    number:      2,
    title:       'Week 2 — The Portfolio Is In The Red. The AI Still Says Buy.',
    date:        '2026-06-12',
    youtubeId:   'NfsoI29RuR0',
    description: 'Down $3,500 in week two. We ran JFB and UMAC through Houndtrader\'s AI analysis — three of four models say buy on both. Here\'s what the data sees that the price doesn\'t.',
  },
  {
    number:      1,
    title:       'Week 1 — The $100K Experiment Begins',
    date:        '2026-06-07',
    youtubeId:   'es-1xuXndSc',
    description: 'Six tickers. One hundred thousand dollars. No open positions yet — but the watchlist is set and the criteria are locked in. Week one is about process, not performance.',
  },
]
