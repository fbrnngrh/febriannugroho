<script lang="ts">
  import type { Component } from "svelte";
  import { staggerDelay } from "$lib/motion";

  interface StackTool {
    icon: Component;
    name: string;
    description: string;
    href?: string;
    monochrome?: boolean;
  }

  let { tool, index = 0 } = $props<{
    tool: StackTool;
    index?: number;
  }>();
</script>

<div class="scroll-reveal-stagger flex items-start gap-4" style="--delay: {staggerDelay(index)}">
  <div
    class="icon-hover-lift flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/80 p-2.5 shadow-sm"
  >
    <tool.icon
      width={28}
      height={28}
      class="stack-tool-icon {tool.monochrome ? 'dark:invert' : ''} shrink-0"
    />
  </div>

  <div class="space-y-1">
    {#if tool.href && tool.href !== "#"}
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        class="text-base font-semibold text-accent hover:underline inline-block"
      >
        {tool.name}
      </a>
    {:else}
      <span class="text-base font-semibold text-fg">
        {tool.name}
      </span>
    {/if}
    <p
      class="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed font-normal"
    >
      <span class="stack-elbow text-neutral-400 dark:text-neutral-600 select-none mt-0.5"
        >↳</span
      >
      <span class="flex-1">{tool.description}</span>
    </p>
  </div>
</div>

<style>
  .icon-hover-lift :global(.stack-tool-icon) {
    transform: rotate(-3deg);
    transition: transform var(--motion-duration-normal) var(--motion-ease);
  }

  .icon-hover-lift:hover :global(.stack-tool-icon) {
    transform: rotate(0deg);
  }

  .stack-elbow {
    opacity: 0;
    transition: opacity var(--motion-duration-fast) var(--motion-ease);
    transition-delay: calc(var(--delay, 0ms) + 40ms);
  }

  :global(.scroll-reveal-group.in-view) .stack-elbow {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon-hover-lift :global(.stack-tool-icon) {
      transform: none;
    }

    .stack-elbow {
      opacity: 1;
      transition: none;
    }
  }
</style>
