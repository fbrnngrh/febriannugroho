<script lang="ts">
  // Post covers (Figma 124:3599 Shipping, 3611 Agents, 3624 Design, 3642 Notes), drawn as inline SVG.
  let { kind }: { kind: string } = $props();
  const k = $derived(["Shipping", "Agents", "Design"].includes(kind) ? kind : "Notes");
</script>

<svg class="art" viewBox="0 0 200 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
  {#if k === "Shipping"}
    <path d="M30 70c4-12 18-14 22-4" stroke-dasharray="3 4" />
    <path d="M60 52h80M64 92h76" stroke-dasharray="4 4" opacity="0.6" />
    <circle cx="58" cy="72" r="2.5" fill="currentColor" />
    <path d="M58 72h12M84 72h8M106 72h8M128 72h8" />
    {#each [70, 92, 114] as x (x)}<rect x={x} y="65" width="14" height="14" rx="4" fill="var(--surface-default)" />{/each}
    <circle cx="148" cy="72" r="10" fill="var(--ci-solid)" stroke="none" />
    <path d="m143 72 3.5 3.5 6.5-7" stroke="#fff" stroke-width="2" />
  {:else if k === "Agents"}
    <circle cx="100" cy="62" r="46" stroke-dasharray="1 5" opacity="0.6" />
    <circle cx="100" cy="62" r="28" stroke-dasharray="1 5" opacity="0.6" />
    <path d="M100 62 70 34M100 62l26-18M100 62l40 4M100 62 76 88" />
    {#each [[70, 34], [126, 44], [140, 66], [76, 88]] as [x, y] (`${x}-${y}`)}
      <rect x={x! - 7} y={y! - 7} width="14" height="14" rx="4" fill="var(--surface-default)" />
    {/each}
    <circle cx="100" cy="62" r="12" fill="var(--fleet-solid)" stroke="none" />
    <circle cx="100" cy="62" r="4.5" fill="var(--surface-default)" stroke="none" />
  {:else if k === "Design"}
    <rect x="58" y="14" width="84" height="92" rx="8" fill="var(--surface-default)" />
    <path d="M58 28h84" />
    <circle cx="66" cy="21" r="1.5" fill="currentColor" /><circle cx="72" cy="21" r="1.5" fill="currentColor" />
    <rect x="66" y="36" width="60" height="6" rx="3" />
    <rect x="66" y="48" width="40" height="5" rx="2.5" />
    <rect x="66" y="62" width="26" height="30" rx="4" fill="var(--blue-solid)" stroke="none" />
    <rect x="98" y="62" width="34" height="12" rx="4" />
    <rect x="98" y="80" width="34" height="12" rx="4" />
    <path d="M40 100c30-6 50-30 70-50s30-26 46-28" />
  {:else}
    <rect x="62" y="18" width="76" height="88" rx="8" fill="var(--surface-default)" />
    <path d="M74 38h52M74 50h52M74 62h36M74 74h44" />
  {/if}
</svg>

<style>
  .art { width: 100%; height: 100%; color: var(--fg-default); }
</style>
