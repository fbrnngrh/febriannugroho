<script lang="ts">
  import { page } from "$app/state";
  import { DECISIONS, NAV } from "#lib/content/site.ts";
  import { scrollToElement } from "#lib/motion.ts";

  function current(key: string) {
    const path = page.url.pathname;
    if (key === "writing") return path.startsWith(DECISIONS.writingPath);
    if (key === "stack") return path.startsWith("/stack");
    return false;
  }

  function onWork(e: MouseEvent) {
    const target = page.url.pathname === "/" ? document.getElementById("work") : null;
    if (!target) return;
    e.preventDefault();
    scrollToElement(target);
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
</script>

<!-- Desktop nav; scrolls away with the page (not sticky). Phones use the Explore menu. -->
<nav class="site-nav" aria-label="Main">
  <ul>
    {#each NAV as item (item.key)}
      <li>
        <a
          href={item.href}
          class="link"
          aria-current={current(item.key) ? "page" : undefined}
          onclick={item.key === "work" ? onWork : undefined}>{item.label}</a
        >
      </li>
    {/each}
  </ul>
</nav>

<style>
  .site-nav {
    display: none;
  }
  @media (min-width: 768px) {
    .site-nav { display: block; }
  }
  ul {
    display: flex;
    gap: 24px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  a {
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
  }
</style>
