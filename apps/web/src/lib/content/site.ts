/**
 * All site copy in one place (docs/redesign-handoff/05-content-assets.md).
 * Open decisions from handoff §4 are switches here so they are easy to flip later.
 */

export const DECISIONS = {
  /** §4.2 Writing route. Keep "/blog" until Febrian picks "/writing" (+ redirect). */
  writingPath: "/blog",
  /** §4.5 Old 2025 posts (React 19, Next.js 16, Tailwind OKLCH). Kept visible until decided. */
  showLegacyPosts: true,
} as const;

export const PERSON = {
  name: "Febrian Bayu Nugroho",
  role: "Software engineer",
  city: "Banjarmasin",
  location: "Banjarmasin, Indonesia",
  now: "Now: redesigning this site",
  email: "fbrnngrh@gmail.com",
  photo: "/images/profile-photo-2.webp",
  github: "fbrnngrh",
} as const;

export const SOCIALS = [
  { label: "GitHub", short: "GH", href: "https://github.com/fbrnngrh" },
  { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/febrian-bayu-nugroho-ba044a1a0/" },
  { label: "Threads", short: "Th", href: "https://www.threads.net/@febriannugroho.dev" },
  { label: "Instagram", short: "IG", href: "https://www.instagram.com/febriannugroho.dev" },
] as const;

export const NAV = [
  { label: "Work", href: "/#work", key: "work" },
  { label: "Writing", href: DECISIONS.writingPath, key: "writing" },
  { label: "Stack", href: "/stack", key: "stack" },
  { label: "Email", href: `mailto:${PERSON.email}`, key: "email" },
] as const;

export type Accent = "fleet" | "ci" | "blue" | "orange";

export type ProjectId = "dealer" | "ci-cd" | "fleet" | "sales-tool";

export type Project = {
  id: ProjectId;
  title: string;
  description: string;
  glow: string;
  accent: Accent;
  /** label shown on the cover (public-content rule: fake data only) */
  coverLabel?: string;
  detail?: {
    tag: string;
    meta: string;
    title: string;
    summary: string;
    problem: string;
    built: string;
    result: string;
    tech: string[];
    writeUp?: string;
    draft?: boolean;
  };
  /** projects without a dialog link somewhere else */
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "dealer",
    title: "Dealer management system",
    description: "Sales, after-sales and lead follow-up for a dealer network.",
    glow: "var(--glow-dealer)",
    accent: "blue",
    coverLabel: "mockup · fake data",
    detail: {
      tag: "Dealer",
      meta: "2024 – now · Web app",
      title: "Dealer management system",
      summary: "Sales, after-sales and lead follow-up for a dealer network, in one web app.",
      problem: "Leads are shared out to many dealers, and every follow-up has a deadline to keep.",
      built:
        "I designed how it deploys to staging and production, took over one module, and built a sales feature end to end on my own.",
      result: "Every staging and production release goes through the deploy plan I designed.",
      tech: ["PHP", "EasyPanel"],
      draft: true,
    },
  },
  {
    id: "ci-cd",
    title: "From manual deploys to CI/CD",
    description: "More than eight APIs moved to automated pipelines.",
    glow: "var(--glow-ci)",
    accent: "ci",
    coverLabel: "mockup · fake data",
    detail: {
      tag: "CI/CD",
      meta: "2025 · Pipelines",
      title: "Deploy pipeline for 8+ APIs",
      summary: "From manual pulls on the server to pipelines that test, build and ship on every push.",
      problem: "Releases depended on pulling code by hand and a checklist nobody had written down.",
      built: "GitHub Actions workflows with Docker and EasyPanel: test, build, deploy to staging, then promote.",
      result: "Every push ships the same way, and rolling back is one click.",
      tech: ["GitHub Actions", "Docker", "EasyPanel", "Bun"],
      writeUp: `${DECISIONS.writingPath}/from-manual-pulls-to-ci-cd`,
    },
  },
  {
    id: "fleet",
    title: "Fleet",
    description: "My home software factory of coding agents.",
    glow: "var(--glow-fleet)",
    accent: "fleet",
    href: "/stack",
  },
  {
    id: "sales-tool",
    title: "Sales Tool",
    description: "The mobile app sales staff use in the field.",
    glow: "var(--glow-sales)",
    accent: "orange",
    coverLabel: "screenshot · demo data",
    detail: {
      tag: "Mobile app",
      meta: "Mobile app · Backend",
      title: "Sales Tool",
      summary: "The app sales staff use in the field for prospects, follow-ups and monthly targets.",
      problem:
        "Sales staff needed one place on their phone for today's follow-ups and how far they are from target.",
      built: "Built with one colleague. I wrote most of the backend, and I now own its ongoing development.",
      result: "Each salesperson opens a wallboard with today's tasks, activity and progress against target.",
      tech: ["PHP", "Mobile app"],
      draft: true,
    },
  },
];

export const ABOUT = {
  experience: [
    { years: "2024–now", role: "Software engineer, Trio Motor" },
    { years: "2023–2024", role: "Programmer intern, Trio Motor" },
  ],
};

export const WRITING_INTRO = "Notes from shipping systems at work and running an agent fleet at home.";

export const WRITING_FILTERS = ["All", "Shipping", "Agents", "Design"] as const;
export type WritingTag = (typeof WRITING_FILTERS)[number];

/** Posts in the design that have no body in the repo yet (placeholder, handoff 05 §4). */
export const PLANNED_POSTS = [
  {
    slug: "redesigning-this-site-with-claude",
    title: "Redesigning this site with Claude",
    description: "What I learned designing in Figma with an agent and a set of design skills.",
    date: "2026-11-18",
    readingTime: "5 min",
    tags: ["Design"],
  },
  {
    slug: "how-my-agent-fleet-ships-code",
    title: "How my agent fleet ships code",
    description: "Planning, building, reviewing and testing with agents while I orchestrate.",
    date: "2026-11-04",
    readingTime: "7 min",
    tags: ["Agents"],
  },
] as const;

export const TOOLS = [
  { name: "T3 Code", logo: "t3code" },
  { name: "Claude", logo: "claude" },
  { name: "Antigravity", logo: "antigravity" },
  { name: "SvelteKit", logo: "svelte" },
  { name: "Docker + EasyPanel", logo: "docker", logo2: "easypanel" },
  { name: "Figma", logo: "figma" },
] as const;

export const KIT = [
  { name: "Antigravity", logo: "antigravity", note: "Trying new agent workflows" },
  { name: "PostgreSQL", logo: "postgresql", note: "Default database" },
  { name: "Bun", logo: "bun", note: "Scripts and fast installs" },
  { name: "Figma", logo: "figma", note: "Where this redesign started" },
  { name: "Notion", logo: "notion", note: "Notes and plans" },
] as const;

export const FOOTER = "Built with SvelteKit. Designed with Claude and a few design skills.";

/** Stage chapters (07-panggung-v3 §3). Shots live in components/stage/VideoStage.svelte; tone = html[data-stage]. */
export const STAGE_CHAPTERS = [
  {
    id: "fleet",
    title: "Fleet workflow",
    caption: "From an issue to a shipped PR: agents build and review, I approve the spec and the release.",
    link: { label: "Full fleet map", href: "/stack" },
  },
  {
    id: "ci",
    title: "CI/CD pipeline",
    caption: "Every change goes through the same checks, a Docker build and a deploy on EasyPanel.",
  },
  {
    id: "site",
    title: "How this site was built",
    caption: "Designed in Figma, built with SvelteKit, shipped in PR #1 and deployed to Cloudflare in PR #2.",
    // link to the Redesigning post: proposed only, waiting for Febrian (07 §10)
  },
] as const satisfies readonly { id: string; title: string; caption: string; link?: { label: string; href: string } }[];

export type StageChapterId = (typeof STAGE_CHAPTERS)[number]["id"];

export type AgentId = "JARVIS" | "FRIDAY" | "ULTRON" | "EDITH" | "KAREN";

export type Agent = {
  id: AgentId;
  role: string;
  summary?: string;
  model?: string;
  stack?: string[];
  skills?: string[];
  run?: string[];
  logos: string[];
};

/** Only FRIDAY has final copy; the rest are placeholders (handoff 05 §4). */
export const AGENTS: Record<AgentId, Agent> = {
  JARVIS: { id: "JARVIS", role: "lead · orchestrator", model: "Opus", skills: ["Matt Pocock skills", "delegate_task"], logos: ["claude"] },
  FRIDAY: {
    id: "FRIDAY",
    role: "builds features",
    summary: "Takes a task from JARVIS, writes the change on its own branch and opens it for review.",
    model: "Claude",
    stack: ["SvelteKit", "Laravel", "TypeScript"],
    skills: ["tdd", "codebase-design", "prototype"],
    run: ["$ task: add retry to uploads", "✓ 3 files changed · 18 tests pass", "→ handed to ULTRON for review"],
    logos: ["claude", "svelte", "laravel", "typescript"],
  },
  ULTRON: { id: "ULTRON", role: "code review", logos: ["claude", "github"] },
  EDITH: { id: "EDITH", role: "UI review · E2E", logos: ["claude", "tailwind"] },
  KAREN: { id: "KAREN", role: "copy · docs", logos: ["antigravity"] },
};
