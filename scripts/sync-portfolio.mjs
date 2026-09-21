// Copy the canonical Paper Millionaire portfolio into this site's data file.
//
// WHY: data/portfolio.json was a hand-maintained copy and it drifted. On
// 2026-09-21 the live site still showed JFB (renamed XTND on Sept 3), cash of
// $10,921 (a $1K deposit had landed Sept 13) and a last_updated of Aug 15.
// The source of truth is the episode pipeline's config; this reads it and
// writes the subset this site needs, in this site's field names.
//
//   node scripts/sync-portfolio.mjs          (run before every episode deploy)
import fs from "node:fs";
import path from "node:path";

const CANON = "C:/Users/Tasty/OneDrive - Serenity Digital/AI/paper millionaire/config/portfolio.json";
const OUT = path.resolve("data/portfolio.json");

const c = JSON.parse(fs.readFileSync(CANON, "utf8"));
const out = {
  starting_value: c.starting_value,
  cash: c.cash,
  last_updated: c.last_updated,
  contributions: c.contributions.map(({ date, amount, note }) => ({ date, amount, note })),
  // Site uses avgCost; the pipeline uses avg_cost. Notes stay in lib/holdings.ts
  // because they are written for readers, not for the script generator.
  holdings: c.holdings.map((h) => ({ ticker: h.ticker, shares: h.shares, avgCost: h.avg_cost })),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
const paid = out.contributions.reduce((s, x) => s + x.amount, 0);
console.log(`synced: ${out.holdings.length} holdings, cash ${out.cash.toLocaleString()}, paid in ${paid.toLocaleString()}, as of ${out.last_updated}`);
