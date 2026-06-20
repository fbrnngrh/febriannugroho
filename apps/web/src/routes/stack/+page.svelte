<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import {
    SvglWindsurfLogo,
    SvglClaudeAILogo,
    SvglWarpLogo,
    SvglBraveBrowserLogo,
    SvglFigmaLogo,
    SvglNotionLogo,
    SvglNextjsLogo,
    SvglReactLogo,
    SvglTypeScriptLogo,
    SvglTailwindCSSLogo,
    SvglPostgreSQLLogo,
    SvglPrismaLogo,
    SvglVercelLogo,
    SvglBunLogo,
  } from "@selemondev/svgl-svelte";

  interface StackItem {
    icon: typeof SvglWindsurfLogo;
    name: string;
    description: string;
    href?: string;
  }

  const lifeTools: StackItem[] = [
    {
      icon: SvglWindsurfLogo,
      name: "Windsurf",
      description: "AI-powered IDE",
      href: "#",
    },
    {
      icon: SvglClaudeAILogo,
      name: "Claude",
      description: "AI assistant",
      href: "#",
    },
    { icon: SvglWarpLogo, name: "Warp", description: "Modern terminal", href: "#" },
    {
      icon: SvglBraveBrowserLogo,
      name: "Brave",
      description: "Privacy-first browser",
      href: "#",
    },
    { icon: SvglFigmaLogo, name: "Figma", description: "Design tool", href: "#" },
    {
      icon: SvglNotionLogo,
      name: "Notion",
      description: "Knowledge base",
      href: "#",
    },
  ];

  const appTools: StackItem[] = [
    {
      icon: SvglNextjsLogo,
      name: "Next.js",
      description: "Web framework",
      href: "#",
    },
    { icon: SvglReactLogo, name: "React", description: "UI library", href: "#" },
    {
      icon: SvglTypeScriptLogo,
      name: "TypeScript",
      description: "Type-safe JavaScript",
      href: "#",
    },
    {
      icon: SvglTailwindCSSLogo,
      name: "Tailwind CSS",
      description: "Utility-first CSS",
      href: "#",
    },
    {
      icon: SvglPostgreSQLLogo,
      name: "PostgreSQL",
      description: "Relational database",
      href: "#",
    },
    {
      icon: SvglPrismaLogo,
      name: "Prisma",
      description: "Type-safe ORM",
      href: "#",
    },
    {
      icon: SvglVercelLogo,
      name: "Vercel",
      description: "Deployment platform",
      href: "#",
    },
    {
      icon: SvglBunLogo,
      name: "Bun",
      description: "JavaScript runtime",
      href: "#",
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
  <a href="/" class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors">
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Avatar -->
  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
    <span class="text-sm font-medium text-muted">FB</span>
  </div>

  <!-- Heading -->
  <p class="text-2xl leading-8">
    Here are the tools and services I use to build my apps and power them.
  </p>

  <!-- Life Tools -->
  <div class="space-y-4">
    <h2 class="text-lg font-medium">Things that power my life</h2>
    <div class="space-y-4">
      {#each lifeTools as tool}
        {#if tool.href}
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3"
          >
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium hover:text-accent transition-colors">
              {tool.name}
            </span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </a>
        {:else}
          <div class="flex items-center gap-3">
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium">{tool.name}</span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- App Tools -->
  <div class="space-y-4">
    <h2 class="text-lg font-medium">Things that power my apps</h2>
    <div class="space-y-4">
      {#each appTools as tool}
        {#if tool.href}
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3"
          >
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium hover:text-accent transition-colors">
              {tool.name}
            </span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </a>
        {:else}
          <div class="flex items-center gap-3">
            <tool.icon width={20} height={20} class="dark:invert shrink-0" />
            <span class="font-medium">{tool.name}</span>
            <span class="text-sm text-muted">→ {tool.description}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>
