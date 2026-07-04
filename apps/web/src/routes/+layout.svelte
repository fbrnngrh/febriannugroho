<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { page } from "$app/state";
  import "../app.css";

  let { children } = $props();

  let isHome = $derived(page.url.pathname === "/");
  let isStack = $derived(page.url.pathname === "/stack");
  let maxWidth = $derived(isStack ? "max-w-2xl" : "max-w-xl");
</script>

<main class="mx-auto {maxWidth} px-6 {isHome 
  ? 'min-h-dvh flex flex-col justify-center py-8' 
  : 'py-20 sm:py-32'}"
>
  {@render children()}
</main>

<ThemeToggle />

