<script lang="ts" module>
  // Inline stroke icons (16px grid), so no icon package is needed.
  const PATHS = {
    "arrow-left": "M13 8H3M7 4 3 8l4 4",
    "arrow-right": "M3 8h10M9 4l4 4-4 4",
    "arrow-up-right": "M5 11 11 5M6 5h5v5",
    copy: "M5.5 5.5V3.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M3.5 5.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z",
    check: "M3.5 8.5 6.5 11.5 12.5 4.5",
    close: "M4 4l8 8M12 4l-8 8",
    expand: "M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9",
    external: "M6.5 3.5h-3v9h9v-3M9.5 2.5h4v4M13.5 2.5 8 8",
    sun: "M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1",
    moon: "M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z",
  } as const;
  export type IconName = keyof typeof PATHS | "pause" | "play" | "plane";
</script>

<script lang="ts">
  let { name, size = 16, class: className = "" }: { name: IconName; size?: number; class?: string } = $props();
</script>

<svg
  class={className}
  width={size}
  height={size}
  viewBox="0 0 16 16"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  {#if name === "pause"}
    <path d="M5.5 3.5v9M10.5 3.5v9" stroke-width="2" />
  {:else if name === "play"}
    <path d="M5 3.2v9.6L12.5 8 5 3.2Z" fill="currentColor" />
  {:else if name === "plane"}
    <path d="M14 2 7 9M14 2 9.5 14 7 9 2 6.5 14 2Z" />
  {:else}
    <path d={PATHS[name]} />
  {/if}
</svg>
