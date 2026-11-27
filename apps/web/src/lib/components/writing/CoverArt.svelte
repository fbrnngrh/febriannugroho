<script lang="ts">
  // Per-post covers by slug; fallback tag covers match Figma 124:3599 Shipping, 3611 Agents, 3624 Design, 3642 Notes.
  let { kind, slug }: { kind: string; slug?: string } = $props();
  const k = $derived(["Shipping", "Agents", "Design"].includes(kind) ? kind : "Notes");
</script>

<svg class="art" viewBox="0 0 200 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
  {#if slug === "redesigning-this-site-with-claude"}
    <path d="M28 32h12M160 32h12M28 76h12M160 76h12" stroke-dasharray="3 3" opacity="0.55" />
    <rect x="44" y="16" width="112" height="88" rx="8" fill="var(--surface-default)" />
    <path d="M56 24h24M130 24h14" opacity="0.55" />
    <rect x="56" y="32" width="88" height="44" rx="6" />
    <path d="M97 48.5 107.5 54 97 59.5Z" stroke-linejoin="round" />
    <rect x="56" y="84" width="26" height="12" rx="4" fill="var(--blue-solid)" stroke="none" />
    <path d="M64 90h10" stroke="var(--fg-on-solid)" stroke-width="1.75" />
    <rect x="87" y="84" width="26" height="12" rx="4" fill="var(--surface-default)" />
    <path d="M95 90h10" opacity="0.55" />
    <rect x="118" y="84" width="26" height="12" rx="4" fill="var(--surface-default)" opacity="0.55" />
    <path d="M126 90h10" opacity="0.35" />
    <path d="m136 56 4 17 4.2-5.2 6.8-.8Z" fill="var(--surface-default)" stroke-linejoin="round" />
  {:else if slug === "how-my-agent-fleet-ships-code"}
    {#each [24, 48, 72, 96] as y (y)}
      <path d="M52 60C72 60 72 {y} 93 {y}" />
      <path d="M107 {y}C128 {y} 128 60 148 60" />
      <rect x="93" y={y - 7} width="14" height="14" rx="4" fill="var(--surface-default)" />
    {/each}
    <circle cx="40" cy="60" r="12" fill="var(--fleet-solid)" stroke="none" />
    <circle cx="40" cy="60" r="4.5" fill="var(--surface-default)" stroke="none" />
    <circle cx="160" cy="60" r="12" fill="var(--surface-default)" />
    <path d="m154.5 60 3.5 3.5 6.5-7" stroke-width="1.75" />
  {:else if slug === "from-manual-pulls-to-ci-cd"}
    <path d="M58 32h74" stroke-dasharray="4 4" opacity="0.55" />
    <path d="M37 54h118" />
    <circle cx="37" cy="54" r="8" fill="var(--surface-default)" />
    <circle cx="37" cy="54" r="2.5" fill="currentColor" stroke="none" />
    {#each [61, 80, 99, 118] as x (x)}
      <rect {x} y="41" width="12" height="26" rx="4" fill="var(--surface-default)" />
      <circle cx={x + 6} cy="48" r="1.5" fill="currentColor" stroke="none" />
      <path d="M{x + 3.5} 58h5" opacity="0.6" />
    {/each}
    <circle cx="158" cy="54" r="11" fill="var(--ci-solid)" stroke="none" />
    <path d="m153 54 3.5 3.5 6.5-7" stroke="var(--fg-on-solid)" stroke-width="2" />
    <rect x="28" y="76" width="144" height="12" rx="6" fill="var(--surface-default)" />
    {#each [36, 68, 100, 132, 164] as x (x)}
      <circle cx={x} cy="82" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
    {/each}
  {:else if slug === "a-practical-guide-to-react-19-actions"}
    <rect x="26" y="22" width="54" height="76" rx="8" fill="var(--surface-default)" />
    <rect x="33" y="32" width="40" height="10" rx="3" />
    <rect x="33" y="48" width="40" height="10" rx="3" />
    <rect x="33" y="66" width="40" height="16" rx="5" fill="var(--blue-solid)" stroke="none" />
    <path d="M46 74h14" stroke="var(--fg-on-solid)" stroke-width="2" />
    <path d="M80 42Q105 20 126 41" stroke-dasharray="3 4" />
    <path d="m121 40 5 1-1-5" stroke-linejoin="round" />
    <circle cx="105" cy="30" r="8" fill="var(--surface-default)" />
    <path d="M105 26.5a3.5 3.5 0 1 1-3.5 3.5" />
    <path d="M130 78Q105 100 84 79" />
    <path d="m89 80-5-1 1 5" stroke-linejoin="round" />
    <circle cx="105" cy="90" r="8" fill="var(--surface-default)" />
    <path d="m101.5 90 2.5 2.5 4.5-5" />
    <path d="M152 52v16" opacity="0.55" />
    <rect x="130" y="30" width="44" height="22" rx="5" fill="var(--surface-default)" />
    <circle cx="138" cy="41" r="2" fill="currentColor" stroke="none" />
    <path d="M146 41h20" />
    <rect x="130" y="68" width="44" height="22" rx="5" fill="var(--surface-default)" />
    <circle cx="138" cy="79" r="2" fill="currentColor" stroke="none" />
    <path d="M146 79h20" />
  {:else if slug === "building-a-saas-with-nextjs-16"}
    <path d="M82 38v10M118 38v10M82 72v10M118 72v10" opacity="0.6" />
    <rect x="38" y="14" width="124" height="24" rx="6" fill="var(--surface-default)" />
    <rect x="46" y="20" width="18" height="12" rx="2.5" />
    <path d="M46 24.5h18M72 23.5h38M72 28.5h24" />
    <circle cx="148" cy="26" r="4" opacity="0.6" />
    <rect x="38" y="48" width="124" height="24" rx="6" fill="var(--surface-default)" />
    <rect x="46" y="53" width="24" height="14" rx="4" fill="var(--orange-text)" stroke="none" />
    <path d="M78 60h12M96 60h16M118 60h34" />
    <circle cx="93" cy="60" r="3" fill="var(--surface-default)" />
    <circle cx="115" cy="60" r="3" fill="var(--surface-default)" />
    <rect x="38" y="82" width="124" height="24" rx="6" fill="var(--surface-default)" />
    <ellipse cx="55" cy="89" rx="7" ry="2.8" />
    <path d="M48 89v10c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V89" />
    <path d="M48 94c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" opacity="0.6" />
    <path d="M72 91.5h46M72 96.5h30" />
    <circle cx="144" cy="94" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="151" cy="94" r="1.5" fill="currentColor" stroke="none" opacity="0.55" />
  {:else if slug === "mastering-tailwind-css-v4-with-oklch"}
    <path d="M30 18v84h140" opacity="0.45" />
    <path d="M34 30h132M34 60h132M34 90h132" stroke-dasharray="2 5" opacity="0.35" />
    <path d="M34 92C66 90 80 74 100 60S134 30 166 28" />
    <rect x="36" y="82" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
    <circle cx="44" cy="90" r="4" fill="currentColor" stroke="none" />
    <rect x="64" y="72" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
    <circle cx="72" cy="80" r="2.2" fill="currentColor" stroke="none" />
    <rect x="89" y="49" width="22" height="22" rx="6" fill="var(--fleet-solid)" stroke="none" />
    <circle cx="100" cy="60" r="3" fill="var(--fg-on-solid)" stroke="none" />
    <rect x="120" y="32" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
    <circle cx="128" cy="40" r="2.5" />
    <rect x="148" y="22" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
  {:else if k === "Shipping"}
    <path d="M30 70c4-12 18-14 22-4" stroke-dasharray="3 4" />
    <path d="M60 52h80M64 92h76" stroke-dasharray="4 4" opacity="0.6" />
    <circle cx="58" cy="72" r="2.5" fill="currentColor" />
    <path d="M58 72h12M84 72h8M106 72h8M128 72h8" />
    {#each [70, 92, 114] as x (x)}<rect x={x} y="65" width="14" height="14" rx="4" fill="var(--surface-default)" />{/each}
    <circle cx="148" cy="72" r="10" fill="var(--ci-solid)" stroke="none" />
    <path d="m143 72 3.5 3.5 6.5-7" stroke="var(--fg-on-solid)" stroke-width="2" />
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
