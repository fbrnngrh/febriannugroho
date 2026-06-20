<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    SvglNextjsLogo,
    SvglReactLogo,
    SvglTypeScriptLogo,
    SvglGitHubLogo,
    SvglInstagramLogo,
    SvglLinkedInLogo,
    SvglXformerlyTwitterLogo,
  } from "@selemondev/svgl-svelte";
  import ProfilePhoto from "$lib/components/ProfilePhoto.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  const projects = [
    {
      title: "Project One",
      description: "A brief description of the first project",
      href: "#",
    },
    {
      title: "Project Two",
      description: "A brief description of the second project",
      href: "#",
    },
  ];

  const homeSections = [
    "intro",
    "what-i-do",
    "work",
    "tech",
    "social",
    "projects",
    "cta",
  ];

  const techIcons = [
    { component: SvglNextjsLogo, label: "Next.js" },
    { component: SvglReactLogo, label: "React" },
    { component: SvglTypeScriptLogo, label: "TypeScript" },
  ];

  const socialIcons = [
    { component: SvglGitHubLogo, label: "GitHub", href: "https://github.com/" },
    {
      component: SvglInstagramLogo,
      label: "Instagram",
      href: "https://instagram.com/",
    },
    {
      component: SvglLinkedInLogo,
      label: "LinkedIn",
      href: "https://linkedin.com/in/",
    },
    { component: SvglXformerlyTwitterLogo, label: "X", href: "https://x.com/" },
  ];
</script>

<svelte:head>
  <title>Febrian Bayu Nugroho — Software Engineer</title>
  <meta
    name="description"
    content="Personal portfolio of Febrian Bayu Nugroho — Software Engineer building web applications and SaaS products."
  />
</svelte:head>

<div class="space-y-12">
  {#each homeSections as section, i (section)}
    {@const delay = i * 100}
    {#if section === "intro"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          Hi, my name is
          <span class="font-semibold">Febrian Bayu Nugroho</span>
          <ProfilePhoto src="/images/profile-photo-2.webp" />
        </p>
      </section>
    {:else if section === "what-i-do"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          I build <span class="font-semibold">web applications</span>
          and
          <span class="font-semibold">SaaS products</span>.
        </p>
      </section>
    {:else if section === "work"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          I'm a Mid Software Engineer at
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 align-middle"
          >
            <img
              src="/images/trio-motor-logo.jpeg"
              alt="Trio Motor logo"
              class="inline-block h-8 w-8 rounded-lg border border-border object-cover shadow-sm"
              style="transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
              width="32"
              height="32"
            />
          </a>
          <style>
            a:hover img {
              transform: scale(1.1) rotate(3deg);
            }
          </style>
        </p>
      </section>
    {:else if section === "tech"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          <span class="mr-2">I work with</span>
          <span class="group inline-flex items-center align-middle">
            {#each techIcons as icon, j}
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:ml-1 {j > 0 ? '-ml-2' : ''}"
              >
                <icon.component
                  width={36}
                  height={36}
                  class="transition-transform duration-300 group-hover:rotate-0 dark:invert"
                  style="transform: rotate(-6deg)"
                  aria-label={icon.label}
                />
              </span>
            {/each}
          </span>
        </p>
      </section>
    {:else if section === "social"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          <span class="mr-2">Find me on</span>
          <span class="group inline-flex items-center align-middle">
            {#each socialIcons as icon, j}
              <a
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:ml-1 {j > 0 ? '-ml-2' : ''}"
                aria-label={icon.label}
              >
                <icon.component
                  width={36}
                  height={36}
                  class="transition-transform duration-300 group-hover:rotate-0 dark:invert"
                  style="transform: rotate(-6deg)"
                />
              </a>
            {/each}
          </span>
        </p>
      </section>
    {:else if section === "projects"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <div class="space-y-4">
          <p class="text-2xl leading-8">
            <span class="font-semibold">Projects</span>
          </p>
          <div class="flex flex-row flex-wrap gap-3">
            {#each projects as project}
              <ProjectCard
                title={project.title}
                description={project.description}
                href={project.href}
              />
            {/each}
          </div>
        </div>
      </section>
    {:else if section === "cta"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-8">
          Want to see what I use?
          <a href="/stack" class="text-accent hover:underline">Click here.</a>
        </p>
      </section>
    {/if}
  {/each}

  <!-- Separator -->
  <hr class="mt-20 border-dashed border-border" />

  <!-- Footer links -->
  <section class="space-y-1 text-sm">
    <p>
      <a href="/blog" class="text-muted hover:text-fg transition-colors">
        Read my blog →
      </a>
    </p>
    <p>
      <a href="/contact" class="text-muted hover:text-fg transition-colors">
        Get in touch →
      </a>
    </p>
  </section>
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    section {
      animation: none !important;
    }
  }
</style>
