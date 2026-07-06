import { join } from "path";
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

const query = `
query($login: String!, $from: DateTime, $to: DateTime) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
`;

async function fetchYearData(year: number | "lastYear") {
  const variables: any = { login: GITHUB_USERNAME };
  if (year !== "lastYear") {
    variables.from = `${year}-01-01T00:00:00Z`;
    variables.to = `${year}-12-31T23:59:59Z`;
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${GITHUB_TOKEN}`,
      "User-Agent": "Bun-GitHub-Contributions-Fetcher",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}) for year ${year}: ${text}`);
  }

  const json = await response.json() as any;

  if (json.errors) {
    throw new Error(`GraphQL Errors for year ${year}: ${json.errors.map((e: any) => e.message).join(", ")}`);
  }

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error(`Invalid response format: user or contributionCalendar not found for year ${year}`);
  }

  return calendar;
}

async function fetchAllContributions() {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = 2021;
    const allData: Record<string, any> = {};

    // Fetch lastYear (rolling 365 days)
    console.log("Fetching rolling last year...");
    allData["lastYear"] = await fetchYearData("lastYear");

    // Fetch calendar years from currentYear down to startYear
    for (let y = currentYear; y >= startYear; y--) {
      console.log(`Fetching calendar year ${y}...`);
      allData[y.toString()] = await fetchYearData(y);
      // Add a tiny sleep to prevent hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const dir = join(import.meta.dir, "..", "apps", "web", "src", "lib", "data");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, JSON.stringify(allData, null, 2), "utf-8");
    console.log(`✅ Success: Fetched contribution data for rolling year and calendar years ${startYear}-${currentYear} and saved to ${outputPath}`);
  } catch (error: any) {
    console.error("❌ Error fetching from GitHub API:", error.message);
    if (existsSync(outputPath)) {
      console.log("ℹ️ Fallback: Keeping existing github-contributions.json due to fetch error.");
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

fetchAllContributions();
