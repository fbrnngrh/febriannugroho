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
    mail: "M3.5 3.5h9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1ZM3 4.5l5 4 5-4",
    linkedin: "M3.5 2.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM5.5 7.25V11M5.5 5v.01M8 11V7.25M8 9c0-1 .7-1.75 1.75-1.75S11 8 11 9v2",
    instagram: "M5 2.5h6A2.5 2.5 0 0 1 13.5 5v6a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 11V5A2.5 2.5 0 0 1 5 2.5ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM11.25 4.75v.01",
    threads: "M12 5.5C11.3 3.9 9.9 3 8 3 5 3 3.25 5.2 3.25 8S5 13 8 13c2.4 0 4.25-1.4 4.25-3.4 0-1.9-1.6-2.9-3.75-2.6-1.5.2-2.4 1-2.3 2 .1.9 1 1.4 2 1.3 1.5-.1 2.3-1.3 2.3-3.3 0-1.5-.7-2.4-1.9-2.5",
  } as const;
  export type IconName = keyof typeof PATHS | "pause" | "play" | "plane" | "github";
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
  {:else if name === "github"}
    <!-- drawn on a 24 grid; scaled down with the stroke compensated so it renders at 1.5 like the rest -->
    <g transform="scale(0.6667)" stroke-width="2.25">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" />
    </g>
  {:else}
    <path d={PATHS[name]} />
  {/if}
</svg>
