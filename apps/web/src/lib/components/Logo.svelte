<script lang="ts" module>
  // Local SVGs from docs/redesign-handoff/assets/logos.md, inlined at build time.
  const files = import.meta.glob("../assets/logos/*.svg", { query: "?raw", import: "default", eager: true }) as Record<
    string,
    string
  >;
  const LOGOS: Record<string, string> = Object.fromEntries(
    Object.entries(files).map(([path, svg]) => [path.split("/").pop()!.replace(".svg", ""), svg]),
  );
</script>

<script lang="ts">
  /** Decorative: the tool name is always written next to it (alt=""). */
  let { name, size = 16 }: { name: string; size?: number } = $props();
</script>

<span class="logo" style:--size="{size}px" aria-hidden="true">{@html LOGOS[name] ?? ""}</span>

<style>
  .logo {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: var(--size);
    height: var(--size);
    color: var(--fg-default);
  }
  .logo :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
