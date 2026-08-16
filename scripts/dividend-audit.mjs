#!/usr/bin/env node
/**
 * Quarterly dividend audit.
 *
 * The blue chips are the floor under the drone bets. A floor only counts if it
 * is real, so this checks that the dividends actually arrive, at the rate they
 * are supposed to, on the schedule they are supposed to.
 *
 * Live data alone cannot do that. A payment that never arrived simply is not in
 * the feed, so there is nothing to notice. This keeps an append-only ledger of
 * every payment ever seen and diffs live data against it:
 *
 *   NEW       banked since the last audit
 *   RAISED    per-share rate went up
 *   CUT       per-share rate went DOWN - the floor moving, and real episode content
 *   OVERDUE   later than that holding's own cadence predicts
 *   VANISHED  was in the ledger, gone from the feed - a data problem, not a deletion
 *
 * Exits non-zero on CUT / OVERDUE / VANISHED so the workflow flags it.
 *
 *   node scripts/dividend-audit.mjs            audit and write the ledger
 *   node scripts/dividend-audit.mjs --check    audit only, never write
 *   node scripts/dividend-audit.mjs --no-discord
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const LEDGER = join(ROOT, 'data', 'dividend-ledger.json')
const HOLDINGS_TS = join(ROOT, 'lib', 'holdings.ts')

const CHECK = process.argv.includes('--check')
const NO_DISCORD = process.argv.includes('--no-discord')

const TRACK_FROM = '2026-06-07'
const MATERIAL = 0.005   // below this a rate move is noise, not policy
const GRACE_DAYS = 12    // how late before a payment is worth flagging

/**
 * Read tickers and share counts straight out of holdings.ts so this can never
 * disagree with the site. Parsing the source beats a second copy that drifts.
 */
function loadHoldings() {
  const src = readFileSync(HOLDINGS_TS, 'utf8')
  const out = []
  const re = /ticker:\s*'([^']+)',\s*shares:\s*(\d+),\s*avgCost:\s*([\d.]+)/g
  let m
  while ((m = re.exec(src))) {
    out.push({ ticker: m[1], shares: Number(m[2]), avgCost: Number(m[3]) })
  }
  return out
}

async function fetchDividends(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
              `?interval=1d&range=2y&events=div`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; changemytrajectory/1.0)' },
    })
    if (!res.ok) return null
    const json = await res.json()
    const ev = json?.chart?.result?.[0]?.events?.dividends
    if (!ev) return []
    return Object.values(ev)
      .map(d => ({ date: new Date(d.date * 1000).toISOString().slice(0, 10),
                   perShare: Math.round(d.amount * 1e6) / 1e6 }))
      .filter(d => d.date >= TRACK_FROM)
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return null   // null means unreachable, which is NOT the same as "no dividends"
  }
}

const cadence = (pays) => {
  if (pays.length < 2) return 91
  const gaps = []
  for (let i = 1; i < pays.length; i++) {
    gaps.push((new Date(pays[i].date) - new Date(pays[i - 1].date)) / 86400000)
  }
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
}

async function main() {
  const today = process.env.AUDIT_DATE || new Date().toISOString().slice(0, 10)
  const holdings = loadHoldings()
  const ledger = existsSync(LEDGER)
    ? JSON.parse(readFileSync(LEDGER, 'utf8'))
    : { payments: {}, audits: [] }

  const findings = []
  const updated = {}
  const unreachable = []
  let received = 0

  for (const h of holdings) {
    const live = await fetchDividends(h.ticker)

    if (live === null) {
      unreachable.push(h.ticker)
      updated[h.ticker] = ledger.payments[h.ticker] ?? []   // keep history
      continue
    }
    if (!live.length && !ledger.payments[h.ticker]) continue

    const known = Object.fromEntries((ledger.payments[h.ticker] ?? []).map(p => [p.date, p.perShare]))
    const merged = { ...known }

    for (const p of live) {
      if (!(p.date in known)) {
        findings.push({ type: 'NEW', ticker: h.ticker, date: p.date,
                        perShare: p.perShare, cash: +(p.perShare * h.shares).toFixed(2) })
      }
      merged[p.date] = p.perShare
    }
    const liveDates = new Set(live.map(p => p.date))
    for (const d of Object.keys(known)) {
      if (!liveDates.has(d)) {
        findings.push({ type: 'VANISHED', ticker: h.ticker, date: d })
      }
    }

    const seq = Object.keys(merged).sort().map(d => ({ date: d, perShare: merged[d] }))
    updated[h.ticker] = seq
    received += seq.reduce((s, p) => s + p.perShare * h.shares, 0)

    if (seq.length >= 2) {
      const prev = seq[seq.length - 2].perShare
      const curr = seq[seq.length - 1].perShare
      if (Math.abs(curr - prev) >= MATERIAL) {
        const perYear = 365 / Math.max(cadence(seq), 1)
        findings.push({
          type: curr > prev ? 'RAISED' : 'CUT',
          ticker: h.ticker, date: seq[seq.length - 1].date,
          from: prev, to: curr,
          pct: +((curr / prev - 1) * 100).toFixed(2),
          annualImpact: +((curr - prev) * h.shares * perYear).toFixed(2),
        })
      }
    }

    if (seq.length) {
      const last = new Date(seq[seq.length - 1].date)
      const due = new Date(last.getTime() + cadence(seq) * 86400000)
      const lateBy = Math.floor((new Date(today) - due) / 86400000)
      if (lateBy > GRACE_DAYS) {
        findings.push({ type: 'OVERDUE', ticker: h.ticker,
                        expected: due.toISOString().slice(0, 10),
                        daysLate: lateBy, lastPaid: seq[seq.length - 1].date })
      }
    }
  }

  received = +received.toFixed(2)
  const serious = findings.filter(f => ['CUT', 'OVERDUE', 'VANISHED'].includes(f.type))

  console.log(`DIVIDEND AUDIT  ${today}   (tracked from ${TRACK_FROM})\n`)
  if (unreachable.length) console.log(`  ! unreachable: ${unreachable.join(', ')} - history kept\n`)
  if (!findings.length) console.log('  No changes. Every payment on record matches the live feed.')
  for (const f of findings) {
    if (f.type === 'NEW') console.log(`  NEW      ${f.ticker.padEnd(6)} ${f.date}  $${f.perShare.toFixed(4)}/sh = $${f.cash.toFixed(2)}`)
    else if (f.type === 'RAISED' || f.type === 'CUT')
      console.log(`  ${f.type.padEnd(8)} ${f.ticker.padEnd(6)} ${f.date}  $${f.from.toFixed(4)} -> $${f.to.toFixed(4)}  (${f.pct > 0 ? '+' : ''}${f.pct}%)  ~ $${f.annualImpact}/yr`)
    else if (f.type === 'OVERDUE')
      console.log(`  OVERDUE  ${f.ticker.padEnd(6)} expected ${f.expected}, ${f.daysLate}d late (last paid ${f.lastPaid})`)
    else console.log(`  VANISHED ${f.ticker.padEnd(6)} ${f.date}  in ledger, not in the live feed`)
  }
  console.log(`\n  ${Object.values(updated).reduce((s, v) => s + v.length, 0)} payments on record - $${received.toFixed(2)} received to date`)

  await postToDiscord({ today, findings, serious, received, unreachable })

  if (!CHECK) {
    ledger.payments = updated
    ledger.audits = [...(ledger.audits ?? []), { date: today, findings: findings.length, received }].slice(-24)
    writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n')
    console.log(`\n  ledger updated -> data/dividend-ledger.json`)
  }

  process.exit(serious.length ? 1 : 0)
}

async function postToDiscord({ today, findings, serious, received, unreachable }) {
  if (NO_DISCORD) return
  const token = process.env.DISCORD_BOT_TOKEN
  const channel = process.env.DISCORD_ALERTS_CHANNEL
  if (!token || !channel) { console.log('\n  (no Discord credentials, skipping post)'); return }

  // A quiet quarter is worth one line. Anything serious gets the detail.
  const cuts = findings.filter(f => f.type === 'CUT')
  const fields = []
  const newOnes = findings.filter(f => f.type === 'NEW')
  if (newOnes.length) {
    fields.push({ name: `Banked this quarter (${newOnes.length})`,
                  value: newOnes.map(f => `${f.ticker} ${f.date} — $${f.cash.toFixed(2)}`).join('\n').slice(0, 1000) })
  }
  for (const f of serious) {
    if (f.type === 'CUT') fields.push({ name: `CUT — ${f.ticker}`, value: `$${f.from.toFixed(4)} → $${f.to.toFixed(4)} (${f.pct}%)\nRoughly $${f.annualImpact}/yr. The floor moved.` })
    if (f.type === 'OVERDUE') fields.push({ name: `Overdue — ${f.ticker}`, value: `Expected ${f.expected}, ${f.daysLate} days late. Last paid ${f.lastPaid}.` })
    if (f.type === 'VANISHED') fields.push({ name: `Vanished — ${f.ticker}`, value: `${f.date} is in the ledger but gone from the live feed. Data problem, not a missed payment.` })
  }
  if (unreachable.length) fields.push({ name: 'Unreachable', value: unreachable.join(', ') + ' — history kept, not dropped.' })

  const body = {
    content: serious.length
      ? '🚨 **Paper Millionaire — dividend audit needs attention**'
      : '💵 **Paper Millionaire — quarterly dividend audit**',
    embeds: [{
      color: cuts.length ? 15158332 : serious.length ? 16766720 : 3978097,
      fields: fields.length ? fields.slice(0, 10) : [{ name: 'Result', value: 'No changes. Every payment matched.' }],
      footer: { text: `$${received.toFixed(2)} received since ${TRACK_FROM}` },
      timestamp: new Date(today).toISOString(),
    }],
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, {
      method: 'POST',
      headers: { Authorization: 'Bot ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    console.log(`\n  Discord: HTTP ${res.status}`)
  } catch (e) {
    console.log(`\n  Discord post failed: ${e.message}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
