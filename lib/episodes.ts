export type Episode = {
  number:      number
  title:       string
  date:        string
  youtubeId:   string
  description: string
}

export const EPISODES: Episode[] = [
  {
    number:      1,
    title:       'Week 1 — The $100K Experiment Begins',
    date:        '2026-06-07',
    youtubeId:   'REPLACE_WITH_VIDEO_ID',
    description: 'Six tickers. One hundred thousand dollars. No open positions yet — but the watchlist is set and the criteria are locked in. Week one is about process, not performance.',
  },
]
