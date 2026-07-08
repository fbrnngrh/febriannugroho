<script lang="ts">
  import type { Component } from "svelte";
  import {
    SvglWindsurfLogo,
    SvglCursorLogo,
    SvglGoogleAntigravityLogo,
    SvglCodexLogo,
    SvglClaudeAILogo,
    SvglNextjsLogo,
    SvglReactLogo,
    SvglTypeScriptLogo,
    SvglTailwindCSSLogo,
    SvglSvelteLogo,
    SvglLaravelLogo,
    SvglNestJSLogo,
    SvglExpressjsLogo,
    SvglHonoLogo,
    SvglFastifyLogo,
    SvglPostgreSQLLogo,
    SvglPrismaLogo,
    SvglVercelLogo,
    SvglCloudflareLogo,
    SvglBunLogo,
    SvglBraveBrowserLogo,
    SvglFigmaLogo,
    SvglNotionLogo,
  } from "@selemondev/svgl-svelte";
  import { inview } from "$lib/actions/inview";
  import BackLink from "$lib/components/BackLink.svelte";
  import ProfilePhoto from "$lib/components/ProfilePhoto.svelte";
  import GitHubContributionCalendar from "$lib/components/GitHubContributionCalendar.svelte";
  import StackToolItem from "$lib/components/StackToolItem.svelte";

  interface StackItem {
    icon: Component;
    name: string;
    description: string;
    href?: string;
    monochrome?: boolean;
  }

  const workspaceTools: StackItem[] = [
    {
      icon: SvglWindsurfLogo,
      name: "Windsurf",
      description: "My primary agentic IDE that feels like pure coding magic.",
      href: "https://codeium.com/windsurf",
      monochrome: true,
    },
    {
      icon: SvglCursorLogo,
      name: "Cursor",
      description: "My go-to editor for AI-driven code acceleration.",
      href: "https://cursor.com",
      monochrome: true,
    },
    {
      icon: SvglGoogleAntigravityLogo,
      name: "Antigravity",
      description: "Intelligent secondary companion for complex operations.",
      href: "https://deepmind.google",
      monochrome: true,
    },
    {
      icon: SvglCodexLogo,
      name: "Codex CLI",
      description: "High-speed terminal utility for instant repo access.",
      href: "https://openai.com",
      monochrome: true,
    },
    {
      icon: SvglClaudeAILogo,
      name: "Claude CLI",
      description: "Terminal assistant for fast architectural guidance.",
      href: "https://claude.ai",
    },
  ];

  const frameworkTools: StackItem[] = [
    {
      icon: SvglNextjsLogo,
      name: "Next.js",
      description: "The leading React framework for production-grade web apps.",
      href: "https://nextjs.org",
      monochrome: true,
    },
    {
      icon: SvglReactLogo,
      name: "React",
      description: "The core UI library powering all my dynamic interfaces.",
      href: "https://react.dev",
    },
    {
      icon: SvglSvelteLogo,
      name: "Svelte",
      description:
        "My absolute favorite framework for building ultra-lean, reactivity-driven web applications.",
      href: "https://svelte.dev",
    },
    {
      icon: SvglTypeScriptLogo,
      name: "TypeScript",
      description: "Type-safe JavaScript dialect that eliminates runtime bugs.",
      href: "https://typescriptlang.org",
    },
    {
      icon: SvglLaravelLogo,
      name: "Laravel",
      description: "The PHP framework for robust, elegant web craft.",
      href: "https://laravel.com",
    },
    {
      icon: SvglNestJSLogo,
      name: "NestJS",
      description:
        "Enterprise-grade Node.js architecture made incredibly simple.",
      href: "https://nestjs.com",
    },
    {
      icon: SvglExpressjsLogo,
      name: "Express.js",
      description: "Minimalist and time-tested web framework for Node.js.",
      href: "https://expressjs.com",
      monochrome: true,
    },
    {
      icon: SvglHonoLogo,
      name: "Hono",
      description: "Ultrafast, lightweight web framework built for the edge.",
      href: "https://hono.dev",
    },
    {
      icon: SvglFastifyLogo,
      name: "Fastify",
      description: "Highly efficient Node.js server with minimal overhead.",
      href: "https://fastify.dev",
      monochrome: true,
    },
    {
      icon: SvglTailwindCSSLogo,
      name: "Tailwind CSS",
      description: "Rapid, utility-first styling with modern OKLCH tokens.",
      href: "https://tailwindcss.com",
    },
  ];

  const infraTools: StackItem[] = [
    {
      icon: SvglPostgreSQLLogo,
      name: "PostgreSQL",
      description:
        "My database of choice for structured, relational data storage.",
      href: "https://postgresql.org",
    },
    {
      icon: SvglPrismaLogo,
      name: "Prisma ORM",
      description:
        "Type-safe database client for intuitive, hassle-free queries.",
      href: "https://prisma.io",
      monochrome: true,
    },
    {
      icon: SvglVercelLogo,
      name: "Vercel",
      description:
        "Seamless hosting platform for serverless frontend deployments.",
      href: "https://vercel.com",
      monochrome: true,
    },
    {
      icon: SvglCloudflareLogo,
      name: "Cloudflare",
      description:
        "Securing, routing, and accelerating my web apps at the edge.",
      href: "https://cloudflare.com",
    },
    {
      icon: SvglBunLogo,
      name: "Bun",
      description: "All-in-one ultra-fast runtime that speeds up local dev.",
      href: "https://bun.sh",
    },
  ];

  const lifeTools: StackItem[] = [
    {
      icon: SvglBraveBrowserLogo,
      name: "Brave",
      description:
        "Privacy-first browser keeping my internet experience clean.",
      href: "https://brave.com",
    },
    {
      icon: SvglFigmaLogo,
      name: "Figma",
      description: "Visual canvas where my UI/UX mockups and designs begin.",
      href: "https://figma.com",
    },
    {
      icon: SvglNotionLogo,
      name: "Notion",
      description: "Organized workspace acting as my digital second brain.",
      href: "https://notion.so",
      monochrome: true,
    },
  ];

  const sections = [
    { title: "My Development Workspace", tools: workspaceTools },
    { title: "Frameworks & Languages", tools: frameworkTools },
    { title: "Infrastructure & Databases", tools: infraTools },
    { title: "Productivity & Life Tools", tools: lifeTools },
  ];
</script>

<svelte:head>
  <title>Stack — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Tools and services Febrian Bayu Nugroho uses to build apps and power his life."
  />
</svelte:head>

<div class="space-y-12">
  <BackLink href="/" label="Back to home" />

  <div
    class="scroll-reveal rounded-2xl border border-border/80 bg-secondary/15 p-5 md:p-6 space-y-6"
    use:inview
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3.5">
        <ProfilePhoto src="/images/profile-photo-2.webp" />
        <div>
          <h1 class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Febrian Bayu Nugroho
          </h1>
          <p class="text-[11px] text-muted">Software Engineer</p>
        </div>
      </div>

      <div class="self-start sm:self-auto">
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
          Active on GitHub
        </span>
      </div>
    </div>

    <div class="border-t border-border/40 pt-5">
      <GitHubContributionCalendar />
    </div>
  </div>

  <p
    class="scroll-reveal text-2xl font-light text-neutral-800 dark:text-neutral-200 leading-9 tracking-tight"
    use:inview
  >
    Here are the tools and services I use to build my apps and power my
    developer workflow.
  </p>

  {#each sections as section}
    <div class="scroll-reveal-group space-y-6" use:inview>
      <h2
        class="section-heading-reveal text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-border/40 pb-2"
      >
        {section.title}
      </h2>
      <div class="grid gap-6 sm:grid-cols-2">
        {#each section.tools as tool, i (tool.name)}
          <StackToolItem {tool} index={i} />
        {/each}
      </div>
    </div>
  {/each}
</div>
