<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
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
  import ProfilePhoto from "$lib/components/ProfilePhoto.svelte";

  interface StackItem {
    icon: any;
    name: string;
    description: string;
    href?: string;
    monochrome?: boolean;
  }

  // Section 1: Development Workspace (IDEs & CLIs)
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

  // Section 2: Frameworks & Languages
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

  // Section 3: Databases, Runtimes & Infrastructure
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

  // Section 4: Productivity & Life Tools
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
</script>

<svelte:head>
  <title>Stack — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Tools and services Febrian Bayu Nugroho uses to build apps and power his life."
  />
</svelte:head>

<div class="space-y-12">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Profile Photo -->
  <div>
    <ProfilePhoto src="/images/profile-photo-2.webp" />
  </div>

  <!-- Heading -->
  <p
    class="text-2xl font-light text-neutral-800 dark:text-neutral-200 leading-9 tracking-tight"
  >
    Here are the tools and services I use to build my apps and power my
    developer workflow.
  </p>

  <!-- My Development Workspace -->
  <div class="space-y-6">
    <h2
      class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-border/40 pb-2"
    >
      My Development Workspace
    </h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {#each workspaceTools as tool}
        <div class="flex items-start gap-4">
          <!-- Icon container -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/80 p-2.5 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <tool.icon
              width={28}
              height={28}
              class="{tool.monochrome ? 'dark:invert' : ''} shrink-0"
            />
          </div>

          <!-- Info -->
          <div class="space-y-1">
            {#if tool.href && tool.href !== "#"}
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="text-base font-semibold text-accent hover:underline inline-block"
              >
                {tool.name}
              </a>
            {:else}
              <span class="text-base font-semibold text-fg">
                {tool.name}
              </span>
            {/if}
            <p
              class="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed font-normal"
            >
              <span
                class="text-neutral-400 dark:text-neutral-600 select-none mt-0.5"
                >↳</span
              >
              <span class="flex-1">{tool.description}</span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Frameworks & Languages -->
  <div class="space-y-6">
    <h2
      class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-border/40 pb-2"
    >
      Frameworks & Languages
    </h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {#each frameworkTools as tool}
        <div class="flex items-start gap-4">
          <!-- Icon container -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/80 p-2.5 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <tool.icon
              width={28}
              height={28}
              class="{tool.monochrome ? 'dark:invert' : ''} shrink-0"
            />
          </div>

          <!-- Info -->
          <div class="space-y-1">
            {#if tool.href && tool.href !== "#"}
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="text-base font-semibold text-accent hover:underline inline-block"
              >
                {tool.name}
              </a>
            {:else}
              <span class="text-base font-semibold text-fg">
                {tool.name}
              </span>
            {/if}
            <p
              class="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed font-normal"
            >
              <span
                class="text-neutral-400 dark:text-neutral-600 select-none mt-0.5"
                >↳</span
              >
              <span class="flex-1">{tool.description}</span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Infrastructure & Databases -->
  <div class="space-y-6">
    <h2
      class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-border/40 pb-2"
    >
      Infrastructure & Databases
    </h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {#each infraTools as tool}
        <div class="flex items-start gap-4">
          <!-- Icon container -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/80 p-2.5 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <tool.icon
              width={28}
              height={28}
              class="{tool.monochrome ? 'dark:invert' : ''} shrink-0"
            />
          </div>

          <!-- Info -->
          <div class="space-y-1">
            {#if tool.href && tool.href !== "#"}
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="text-base font-semibold text-accent hover:underline inline-block"
              >
                {tool.name}
              </a>
            {:else}
              <span class="text-base font-semibold text-fg">
                {tool.name}
              </span>
            {/if}
            <p
              class="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed font-normal"
            >
              <span
                class="text-neutral-400 dark:text-neutral-600 select-none mt-0.5"
                >↳</span
              >
              <span class="flex-1">{tool.description}</span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Productivity & Life Tools -->
  <div class="space-y-6">
    <h2
      class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-border/40 pb-2"
    >
      Productivity & Life Tools
    </h2>
    <div class="grid gap-6 sm:grid-cols-2">
      {#each lifeTools as tool}
        <div class="flex items-start gap-4">
          <!-- Icon container -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/80 p-2.5 shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <tool.icon
              width={28}
              height={28}
              class="{tool.monochrome ? 'dark:invert' : ''} shrink-0"
            />
          </div>

          <!-- Info -->
          <div class="space-y-1">
            {#if tool.href && tool.href !== "#"}
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                class="text-base font-semibold text-accent hover:underline inline-block"
              >
                {tool.name}
              </a>
            {:else}
              <span class="text-base font-semibold text-fg">
                {tool.name}
              </span>
            {/if}
            <p
              class="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed font-normal"
            >
              <span
                class="text-neutral-400 dark:text-neutral-600 select-none mt-0.5"
                >↳</span
              >
              <span class="flex-1">{tool.description}</span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
