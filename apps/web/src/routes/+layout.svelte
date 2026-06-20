<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<main class="mx-auto max-w-xl px-6 py-20 sm:py-32">
  {@render children()}
</main>

<ThemeToggle />
