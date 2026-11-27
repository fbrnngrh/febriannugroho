import { dirname, join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

// Manually parse env vars from apps/web/.env
const envPath = join(import.meta.dir, "..", "apps", "web", ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.substring(0, equalsIdx).trim();
        const val = trimmed.substring(equalsIdx + 1).trim();
        // Remove quotes if present
        const unquotedVal = val.replace(/^["']|["']$/g, "");
        process.env[key] = unquotedVal;
      }
    }
  }
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "fbrnngrh";
/** ≈ 9 months, the span the home page shows */
const WEEKS = 39;
const outputPath = join(import.meta.dir, "..", "apps", "web", "src", "lib", "data", "github-contributions.json");

console.log(`=== GitHub Contribution Fetcher ===`);
console.log(`Username: ${GITHUB_USERNAME}`);

if (!GITHUB_TOKEN) {
  console.warn("⚠️ Warning: GITHUB_TOKEN is not set in environment variables.");
  if (existsSync(outputPath)) {
    console.log("ℹ️ Fallback: Using existing github-contributions.json cache.");
    process.exit(0);
  } else {
    console.error("❌ Error: GITHUB_TOKEN is missing and no fallback JSON exists.");
    process.exit(1);
  }
}

// contributionLevel is GitHub's own quartile for each day (NONE … FOURTH_QUARTILE), the scale the profile
// graph uses. Our own count thresholds made 73 days look maximal where GitHub shows 2 (review §7).
const query = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`;

const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];

async function fetchContributions() {
  const to = new Date();
  // start on the Sunday WEEKS - 1 weeks back, so the grid has whole columns
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - from.getUTCDay() - (WEEKS - 1) * 7);
  from.setUTCHours(0, 0, 0, 0);

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "User-Agent": "github-contributions-fetcher",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME, from: from.toISOString(), to: to.toISOString() } }),
  });
  if (!response.ok) throw new Error(`GitHub API error (${response.status}): ${await response.text()}`);
  const json = (await response.json()) as any;
  if (json.errors) throw new Error(`GraphQL errors: ${json.errors.map((e: any) => e.message).join(", ")}`);
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("Invalid response: user or contributionCalendar not found");

  return {
    fetchedAt: to.toISOString(),
    weeks: calendar.weeks.map((w: any) =>
      w.contributionDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        level: Math.max(0, LEVELS.indexOf(d.contributionLevel)),
      })),
    ),
  };
}

try {
  const data = await fetchContributions();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`✅ Saved ${data.weeks.length} weeks to ${outputPath}`);
} catch (error: any) {
  console.error("❌ Error fetching from GitHub API:", error.message);
  if (!existsSync(outputPath)) process.exit(1);
  console.log("ℹ️ Fallback: keeping the existing github-contributions.json.");
}
