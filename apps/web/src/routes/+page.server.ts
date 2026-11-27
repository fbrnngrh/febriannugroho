import data from "#lib/data/github-contributions.json";

type Day = { date: string; count: number; level: number };

const WEEKS = 39; // ≈ 9 months

// Runs at prerender only: the browser gets 39 weeks of [count, GitHub quartile level, date] per day.
export function load() {
  const weeks = ((data as { weeks?: Day[][] }).weeks ?? []).slice(-WEEKS).map((w) => w.map((d) => [d.count, d.level, d.date] as [number, number, string]));
  return { contributions: weeks };
}
