<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { fly } from "svelte/transition";

  let { 
    date, 
    title, 
    description, 
    slug, 
    tags = [], 
    readingTime = "", 
    index = 0 
  } = $props<{
    date: string;
    title: string;
    description: string;
    slug: string;
    tags?: string[];
    readingTime?: string;
    index?: number;
  }>();
</script>

<a
  href="/blog/{slug}"
  class="group block p-5 rounded-2xl border border-border hover:border-accent/25 bg-secondary/10 hover:bg-secondary/30 transition-all duration-300 reveal relative"
  style="--delay: {index * 75}ms"
>
  <!-- Metadata header: Date & Reading Time -->
  <div class="flex flex-wrap items-center gap-2 text-xs text-muted mb-2.5">
    <time datetime={date}>{date}</time>
    {#if readingTime}
      <span class="text-neutral-300 dark:text-neutral-700 font-normal">&bull;</span>
      <span>{readingTime}</span>
    {/if}
  </div>

  <!-- Title with arrow transition -->
  <h2 class="text-base font-semibold text-fg group-hover:text-accent transition-colors duration-200 mb-1.5 flex items-center justify-between gap-2">
    <span>{title}</span>
    <ArrowRight class="h-4.5 w-4.5 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
  </h2>

  <!-- Description -->
  <p class="text-sm text-muted/80 leading-relaxed mb-4 line-clamp-2">
    {description}
  </p>

  <!-- Tags at bottom -->
  {#if tags && tags.length > 0}
    <div class="flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
      {#each tags as tag}
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-muted group-hover:bg-secondary/70 transition-colors">
          {tag}
        </span>
      {/each}
    </div>
  {/if}
</a>
