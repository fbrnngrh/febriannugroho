<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let { date, title, description, slug, index = 0 } = $props<{
    date: string;
    title: string;
    description: string;
    slug: string;
    index?: number;
  }>();
</script>

<a
  href="/blog/{slug}"
  class="group -mx-4 block rounded-2xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-border hover:bg-secondary/50"
  in:fly={{ x: -20, duration: 300, delay: index * 100 }}
>
  <span class="text-sm text-muted">{date}</span>
  <span class="ml-3 font-medium group-hover:text-accent transition-colors">
    {title}
  </span>
  <span
    class="ml-2 inline-flex items-center text-sm text-muted opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
  >
    <span class="hidden sm:inline">{description}</span>
    <ArrowRight class="ml-1 h-4 w-4 shrink-0" />
  </span>
</a>
