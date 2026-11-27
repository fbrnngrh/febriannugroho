<script lang="ts">
  import type { AgentId } from "#lib/content/site.ts";

  // Original avatars (not film characters): one face per agent, Figma Avatar/Agent 112:2110.
  let { id, size = 24, active = false }: { id: AgentId; size?: 24 | 40 | 64; active?: boolean } = $props();

  const FACES: Record<AgentId, string> = {
    JARVIS: "M8 10.5h2M14 10.5h2M9 15c1.6 1.2 4.4 1.2 6 0",
    FRIDAY: "M8 9.5h3v2H8zM13 9.5h3v2h-3zM9.5 15h5",
    ULTRON: "M7.5 10l3 1M16.5 10l-3 1M9 15.5h6",
    EDITH: "M9.5 10.5a1.5 1.5 0 1 0 0 .01M14.5 10.5a1.5 1.5 0 1 0 0 .01M8 10.5h8M10 15h4",
    KAREN: "M8 11c.8-1 2.2-1 3 0M13 11c.8-1 2.2-1 3 0M9 14.5c1.5 1.5 4.5 1.5 6 0",
  };
</script>

<span class="avatar" class:active style:--s="{size}px" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d={FACES[id]} class="face" />
    <path d={FACES[id]} class="face on" />
  </svg>
</span>

<style>
  .avatar {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: var(--s);
    height: var(--s);
    border-radius: 30%;
    position: relative;
    isolation: isolate;
    background: var(--fleet-subtle);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--fleet-solid) 18%, transparent);
  }
  /* active state crossfades on opacity: solid fill (::before), outer ring (::after), light face */
  .avatar::before, .avatar::after, .face { transition: opacity 240ms var(--ease-flow); }
  .avatar::before, .avatar::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    opacity: 0;
  }
  .avatar::before { background: var(--fleet-solid); }
  .avatar::after { box-shadow: 0 0 0 2px var(--surface-default), 0 0 0 4px color-mix(in srgb, var(--fleet-solid) 45%, transparent); }
  .avatar svg { width: 100%; height: 100%; }
  .face { stroke: var(--fleet-text); }
  .face.on { stroke: var(--stage-on-merged); opacity: 0; }
  .active::before, .active::after, .active .face.on { opacity: 1; }
  .active .face:not(.on) { opacity: 0; }
</style>
