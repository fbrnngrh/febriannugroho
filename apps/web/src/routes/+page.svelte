<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    SvglNextjsLogo,
    SvglReactLogo,
    SvglTypeScriptLogo,
    SvglGitHubLogo,
    SvglInstagramLogo,
    SvglLinkedInLogo,
    SvglThreadsLogo,
  } from "@selemondev/svgl-svelte";
  import ProfilePhoto from "$lib/components/ProfilePhoto.svelte";

  const sections = [
    "intro",
    "what-i-do",
    "work",
    "tech",
    "social",
    "cta",
  ];

  const techIcons = [
    { component: SvglNextjsLogo, label: "Next.js" },
    { component: SvglReactLogo, label: "React" },
    { component: SvglTypeScriptLogo, label: "TypeScript" },
  ];

  const socialIcons = [
    { component: SvglGitHubLogo, label: "GitHub", href: "https://github.com/fbrnngrh" },
    {
      component: SvglInstagramLogo,
      label: "Instagram",
      href: "https://www.instagram.com/febriannugroho.dev",
    },
    {
      component: SvglLinkedInLogo,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/febrian-bayu-nugroho-ba044a1a0/",
    },
    { component: SvglThreadsLogo, label: "Threads", href: "https://www.threads.net/@febriannugroho.dev" },
  ];
</script>

<svelte:head>
  <title>Febrian Bayu Nugroho — Software Engineer</title>
  <meta
    name="description"
    content="Personal portfolio of Febrian Bayu Nugroho — Software Engineer building web applications and SaaS products."
  />
</svelte:head>

<div class="space-y-6 sm:space-y-8">
  {#each sections as section, i (section)}
    {@const delay = i * 100}
    {#if section === "intro"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          Hi, my name is
          <span class="font-semibold">Febrian Bayu Nugroho</span>
          <ProfilePhoto src="/images/profile-photo-2.webp" />
        </p>
      </section>
    {:else if section === "what-i-do"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          I build <span class="font-semibold">web applications</span>
          and
          <span class="font-semibold">SaaS products</span>
          for modern teams.
        </p>
      </section>
    {:else if section === "work"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          Currently a Mid Software Engineer at
          <a
            href="https://triomotor.co.id"
            target="_blank"
            rel="noopener noreferrer"
            class="company-link inline-flex items-center gap-1 align-middle"
          >
            <img
              src="/images/trio-motor-logo.jpeg"
              alt="Trio Motor logo"
              class="inline-block h-8 w-8 rounded-lg border border-border object-cover shadow-sm transition-transform duration-300"
              width="32"
              height="32"
            />
          </a>
        </p>
      </section>
    {:else if section === "tech"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          I'm a software engineer focused on full-stack development with
          <span class="icon-row group inline-flex items-center align-middle">
            {#each techIcons as icon, j (icon.label)}
              <span
                class="icon-pill inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                class:-ml-2={j > 0}
              >
                <icon.component
                  width={36}
                  height={36}
                  class="tilted-icon {icon.label === 'Next.js' ? 'dark:invert' : ''}"
                  aria-label={icon.label}
                />
              </span>
            {/each}
          </span>
        </p>
      </section>
    {:else if section === "social"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          I also post regularly on these platforms
        </p>
        <div class="icon-row group mt-3 inline-flex items-center">
          {#each socialIcons as icon, j (icon.label)}
            <a
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              class="icon-pill press-feedback inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
              class:-ml-2={j > 0}
              aria-label={icon.label}
            >
              <icon.component
                width={36}
                height={36}
                class="tilted-icon {['GitHub', 'Threads'].includes(icon.label) ? 'dark:invert' : ''}"
              />
            </a>
          {/each}
        </div>
      </section>
    {:else if section === "cta"}
      <section in:fly={{ y: 20, duration: 400, delay }}>
        <p class="text-2xl leading-relaxed">
          Curious about my tech stack? Explore the
          <a href="/stack" class="stack-word-link">tools</a>
          I use.
        </p>
      </section>
    {/if}
  {/each}

  <!-- Separator -->
  <hr class="mt-8 sm:mt-12 border-dashed border-border" />

  <!-- Footer links -->
  <section class="space-y-1 text-sm">
    <p>
      Want to read my writing?
      <a href="/blog" class="text-accent link-underline">Browse through my articles.</a>
    </p>
    <p>
      Want to say hi?
      <a href="/contact" class="text-accent link-underline">Let's get in touch.</a>
    </p>
  </section>
</div>

<style>
  .icon-row :global(.tilted-icon) {
    transform: rotate(-6deg);
    transition:
      transform var(--motion-duration-normal) var(--motion-ease),
      opacity var(--motion-duration-normal) var(--motion-ease);
  }

  .icon-row:hover :global(.tilted-icon) {
    transform: rotate(0deg);
  }

  .icon-pill:hover :global(.tilted-icon) {
    transform: rotate(0deg) scale(1.08);
  }

  .icon-pill {
    transition:
      margin-left var(--motion-duration-normal) var(--motion-ease),
      transform var(--motion-duration-normal) var(--motion-ease),
      box-shadow var(--motion-duration-normal) var(--motion-ease),
      opacity var(--motion-duration-normal) var(--motion-ease);
  }

  .icon-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px oklch(0 0 0 / 0.08);
  }

  :global(.dark) .icon-pill:hover {
    box-shadow: 0 4px 12px oklch(0 0 0 / 0.25);
  }

  .icon-row:hover .icon-pill:not(:hover) {
    opacity: 0.75;
  }

  .icon-row:hover .icon-pill {
    margin-left: 4px;
  }

  .company-link:hover img {
    transform: scale(1.1) rotate(3deg);
  }

  .stack-word-link {
    position: relative;
    color: var(--color-accent);
    font-weight: 600;
    text-decoration: none;
    transition: opacity var(--motion-duration-fast) var(--motion-ease);
  }

  .stack-word-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 2px;
    width: 0;
    height: 2px;
    background-color: var(--color-accent);
    transition: width var(--motion-duration-normal) var(--motion-ease);
  }

  .stack-word-link:hover {
    opacity: 0.85;
  }

  .stack-word-link:hover::after {
    width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    section {
      animation: none !important;
    }

    .icon-pill:hover {
      transform: none;
      box-shadow: none;
    }

    .icon-row:hover .icon-pill:not(:hover) {
      opacity: 1;
    }
  }
</style>
