import data from "#lib/data/github-contributions.json";

type Calendar = { weeks: { contributionDays: { contributionCount: number }[] }[] };

const WEEKS = 39; // ≈ 9 months

// Runs at prerender only, so the browser gets 39 weeks of counts instead of the whole JSON history.
export function load() {
  const source = (data as Record<string, Calendar | undefined>).lastYear;
  const weeks = (source?.weeks.slice(-WEEKS) ?? []).map((w) => w.contributionDays.map((d) => d.contributionCount));
  return { contributions: weeks };
}
