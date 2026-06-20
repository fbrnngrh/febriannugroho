<script lang="ts">
  import { Sun, Moon } from "lucide-svelte";

  let isDark = $state(false);

  function syncTheme() {
    isDark = document.documentElement.classList.contains("dark");
  }

  $effect(() => {
    syncTheme();
  });

  function toggle() {
    const root = document.documentElement;
    const isReduced = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function apply() {
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
      isDark = root.classList.contains("dark");
    }

    if (!document.startViewTransition || isReduced) {
      apply();
      return;
    }

    const rect = document
      .querySelector(".theme-toggle")!
      .getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--tx", `${x}px`);
    document.documentElement.style.setProperty("--ty", `${y}px`);

    document.startViewTransition(() => apply());
  }
</script>

<button
  class="theme-toggle fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/80 backdrop-blur-sm hover:bg-accent/10 transition-colors"
  onclick={toggle}
  aria-label="Toggle theme"
>
  {#if isDark}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>
