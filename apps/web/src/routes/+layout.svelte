<script lang="ts">
  import { afterNavigate, onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import ExploreMenu from "#lib/components/ExploreMenu.svelte";
  import FloatingProfile from "#lib/components/FloatingProfile.svelte";
  import SiteNav from "#lib/components/SiteNav.svelte";
  import ThemeToggle from "#lib/components/ThemeToggle.svelte";
  import { inview } from "#lib/actions/inview.ts";
  import { FOOTER } from "#lib/content/site.ts";
  import { prefersReducedMotion } from "#lib/motion.ts";
  import "@fontsource-variable/inter";
  import "@fontsource-variable/geist-mono";
  import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
  import "../app.css";

  let { children } = $props();

  const isHome = $derived(page.url.pathname === "/");

  // Cross-fade between pages (250 ms, 04-motion.md §4). Skipped for shallow overlays and reduced motion.
  onNavigate((navigation) => {
    if (navigation.shallow || !document.startViewTransition || prefersReducedMotion()) return;
    if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  // After a client navigation, focus the new page's <h1> (SvelteKit's route announcer reads the title).
  afterNavigate((navigation) => {
    if (navigation.type === "enter" || navigation.shallow || navigation.to?.url.hash) return;
    if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
    const h1 = document.querySelector<HTMLElement>("main h1");
    if (!h1) return;
    h1.tabIndex = -1;
    h1.focus({ preventScroll: true });
  });
</script>

<svelte:head>
  <link rel="preload" href={interLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

<!-- Home's nav lives in the hero, so a header here would be an empty banner on desktop -->
{#if isHome}
  <ExploreMenu />
{:else}
  <header class="site-header">
    <div class="page-nav"><SiteNav /></div>
    <ExploreMenu />
  </header>
{/if}

<main id="main" tabindex="-1">
  {@render children()}
</main>

<footer class="site-footer col-text" data-reveal="fade" use:inview={{ margin: "-5%" }}>
  <p>{FOOTER}</p>
</footer>

<FloatingProfile />
<ThemeToggle />

<style>
  .page-nav {
    position: absolute;
    top: 32px;
    right: 40px;
    z-index: 2;
  }
  main:focus { outline: none; }
  .site-footer {
    padding: 120px 0 calc(114px + env(safe-area-inset-bottom));
  }
  .site-footer p {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--fg-muted);
  }
  @media (min-width: 768px) {
    .site-footer { padding-bottom: 120px; }
  }
</style>
