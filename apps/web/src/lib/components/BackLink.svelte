<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import type { Component } from "svelte";

  let {
    href,
    label = "Back",
  } = $props<{
    href: string;
    label?: string;
  }>();
</script>

<a
  {href}
  class="back-link group inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors duration-200"
>
  <ArrowLeft class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
  {label}
</a>
