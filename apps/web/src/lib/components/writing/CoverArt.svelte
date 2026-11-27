<script lang="ts">
  // Per-post covers by slug; fallback tag covers match Figma 124:3599 Shipping, 3611 Agents, 3624 Design, 3642 Notes.
  // Colours come from the card: --cover-bg and --cover-accent (WritingRow COVERS). `play` > 0 replays the
  // cover's story once from frame 0; the resting markup is the final frame, so no JS or reduced motion shows it whole.
  let { kind, slug, play = 0 }: { kind: string; slug?: string; play?: number } = $props();
  const k = $derived(["Shipping", "Agents", "Design"].includes(kind) ? kind : "Notes");
</script>

{#key play}
<svg class={["art", { play: play > 0 }]} viewBox="0 0 200 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
  {#if slug === "redesigning-this-site-with-claude"}
    <path d="M28 32h12M160 32h12M28 76h12M160 76h12" stroke-dasharray="3 3" opacity="0.55" />
    <rect x="44" y="16" width="112" height="88" rx="8" fill="var(--surface-default)" />
    <path d="M56 24h24M130 24h14" opacity="0.55" />
    <rect x="56" y="32" width="88" height="44" rx="6" />
    <circle class="ring box" cx="102" cy="54" r="12" stroke="var(--cover-accent)" />
    <path class="pop box" d="M97 48.5 107.5 54 97 59.5Z" stroke-linejoin="round" />
    <rect x="56" y="84" width="26" height="12" rx="4" fill="var(--cover-accent)" stroke="none" />
    <path d="M64 90h10" stroke="var(--cover-bg)" stroke-width="1.75" />
    <rect x="87" y="84" width="26" height="12" rx="4" fill="var(--surface-default)" />
    <path d="M95 90h10" opacity="0.55" />
    <rect x="118" y="84" width="26" height="12" rx="4" fill="var(--surface-default)" opacity="0.55" />
    <path d="M126 90h10" opacity="0.35" />
    <path class="cursor" d="m136 56 4 17 4.2-5.2 6.8-.8Z" fill="var(--surface-default)" stroke-linejoin="round" />
  {:else if slug === "how-my-agent-fleet-ships-code"}
    <!-- packets start under the lead, hide under each agent, then converge under the check -->
    {#each [24, 48, 72, 96] as y, i (y)}
      <path class="pk" style:--d="{[0, 50, 90, 120][i]}ms" d="M40 60h12C72 60 72 {y} 93 {y}h7" pathLength="100" />
      <path class="pk out" style:--d="{[520, 570, 610, 640][i]}ms" d="M100 {y}h7C128 {y} 128 60 148 60h12" pathLength="100" />
    {/each}
    {#each [24, 48, 72, 96] as y (y)}
      <path d="M52 60C72 60 72 {y} 93 {y}" />
      <path d="M107 {y}C128 {y} 128 60 148 60" />
      <rect x="93" y={y - 7} width="14" height="14" rx="4" fill="var(--surface-default)" />
    {/each}
    <circle cx="40" cy="60" r="12" fill="var(--cover-accent)" stroke="none" />
    <circle cx="40" cy="60" r="4.5" fill="var(--surface-default)" stroke="none" />
    <circle cx="160" cy="60" r="12" fill="var(--surface-default)" />
    <path class="draw" style:--d="1000ms" d="m154.5 60 3.5 3.5 6.5-7" stroke-width="1.75" pathLength="1" />
  {:else if slug === "from-manual-pulls-to-ci-cd"}
    <path d="M58 32h74" stroke-dasharray="4 4" opacity="0.55" />
    <path d="M37 54h118" />
    <!-- the commit rides under the gates and comes to rest under the check -->
    <circle class="token" cx="37" cy="54" r="3.5" fill="var(--cover-accent)" stroke="none" />
    <circle cx="37" cy="54" r="8" fill="var(--surface-default)" />
    <circle cx="37" cy="54" r="2.5" fill="currentColor" stroke="none" />
    {#each [61, 80, 99, 118] as x, i (x)}
      <rect {x} y="41" width="12" height="26" rx="4" fill="var(--surface-default)" />
      <!-- each lamp lights as the commit passes (times read off the ease-in-out curve) -->
      <circle class="lamp box" style:--d="{[370, 410, 445, 485][i]}ms" cx={x + 6} cy="48" r="2" fill="var(--cover-accent)" stroke="none" />
      <path d="M{x + 3.5} 58h5" opacity="0.6" />
    {/each}
    <circle cx="158" cy="54" r="11" fill="var(--cover-accent)" stroke="none" />
    <path class="draw" style:--d="850ms" d="m153 54 3.5 3.5 6.5-7" stroke="var(--cover-bg)" stroke-width="2" pathLength="1" />
    <rect x="28" y="76" width="144" height="12" rx="6" fill="var(--surface-default)" />
    {#each [36, 68, 100, 132, 164] as x (x)}
      <circle cx={x} cy="82" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
    {/each}
  {:else if slug === "a-practical-guide-to-react-19-actions"}
    <path class="pk" style:--d="120ms" d="M70 42h10Q105 20 126 41h14" pathLength="100" />
    <path class="pk out" style:--d="700ms" d="M144 78h-14Q105 100 84 79H70" pathLength="100" />
    <rect x="26" y="22" width="54" height="76" rx="8" fill="var(--surface-default)" />
    <rect x="33" y="32" width="40" height="10" rx="3" />
    <rect x="33" y="48" width="40" height="10" rx="3" />
    <g class="btn box">
      <rect x="33" y="66" width="40" height="16" rx="5" fill="var(--cover-accent)" stroke="none" />
      <path d="M46 74h14" stroke="var(--cover-bg)" stroke-width="2" />
    </g>
    <path d="M80 42Q105 20 126 41" stroke-dasharray="3 4" />
    <path d="m121 40 5 1-1-5" stroke-linejoin="round" />
    <circle cx="105" cy="30" r="8" fill="var(--surface-default)" />
    <path class="spin" d="M105 26.5a3.5 3.5 0 1 1-3.5 3.5" />
    <path d="M130 78Q105 100 84 79" />
    <path d="m89 80-5-1 1 5" stroke-linejoin="round" />
    <circle cx="105" cy="90" r="8" fill="var(--surface-default)" />
    <path class="draw" style:--d="1100ms" d="m101.5 90 2.5 2.5 4.5-5" pathLength="1" />
    <path d="M152 52v16" opacity="0.55" />
    <rect x="130" y="30" width="44" height="22" rx="5" fill="var(--surface-default)" />
    <circle cx="138" cy="41" r="2" fill="currentColor" stroke="none" />
    <path d="M146 41h20" />
    <rect x="130" y="68" width="44" height="22" rx="5" fill="var(--surface-default)" />
    <circle cx="138" cy="79" r="2" fill="currentColor" stroke="none" />
    <path d="M146 79h20" />
  {:else if slug === "building-a-saas-with-nextjs-16"}
    <path class="links" d="M82 38v10M118 38v10M82 72v10M118 72v10" opacity="0.6" />
    <g class="layer" style:--dy="-18px">
      <rect x="38" y="14" width="124" height="24" rx="6" fill="var(--surface-default)" />
      <rect x="46" y="20" width="18" height="12" rx="2.5" />
      <path d="M46 24.5h18M72 23.5h38M72 28.5h24" />
      <circle cx="148" cy="26" r="4" opacity="0.6" />
    </g>
    <g class="layer" style:--dy="-10px">
      <rect x="38" y="48" width="124" height="24" rx="6" fill="var(--surface-default)" />
      <rect x="46" y="53" width="24" height="14" rx="4" fill="var(--cover-accent)" stroke="none" />
      <path d="M78 60h12M96 60h16M118 60h34" />
      <circle cx="93" cy="60" r="3" fill="var(--surface-default)" />
      <circle cx="115" cy="60" r="3" fill="var(--surface-default)" />
    </g>
    <g class="layer" style:--dy="-4px">
      <rect x="38" y="82" width="124" height="24" rx="6" fill="var(--surface-default)" />
      <ellipse cx="55" cy="89" rx="7" ry="2.8" />
      <path d="M48 89v10c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V89" />
      <path d="M48 94c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8" opacity="0.6" />
      <path d="M72 91.5h46M72 96.5h30" />
      <circle cx="144" cy="94" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="151" cy="94" r="1.5" fill="currentColor" stroke="none" opacity="0.55" />
    </g>
  {:else if slug === "mastering-tailwind-css-v4-with-oklch"}
    <path d="M30 18v84h140" opacity="0.45" />
    <path d="M34 30h132M34 60h132M34 90h132" stroke-dasharray="2 5" opacity="0.35" />
    <path class="curve" d="M34 92C66 90 80 74 100 60S134 30 166 28" pathLength="1" />
    <g class="sw" style:--d="0ms">
      <rect x="36" y="82" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
      <circle cx="44" cy="90" r="4" fill="currentColor" stroke="none" />
    </g>
    <g class="sw" style:--d="70ms">
      <rect x="64" y="72" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
      <circle cx="72" cy="80" r="2.2" fill="currentColor" stroke="none" />
    </g>
    <g class="sw" style:--d="130ms">
      <rect x="89" y="49" width="22" height="22" rx="6" fill="var(--cover-accent)" stroke="none" />
      <circle cx="100" cy="60" r="3" fill="var(--cover-bg)" stroke="none" />
    </g>
    <g class="sw" style:--d="180ms">
      <rect x="120" y="32" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
      <circle cx="128" cy="40" r="2.5" />
    </g>
    <g class="sw" style:--d="220ms">
      <rect x="148" y="22" width="16" height="16" rx="4.5" fill="var(--surface-default)" />
    </g>
  {:else if k === "Shipping"}
    <path d="M30 70c4-12 18-14 22-4" stroke-dasharray="3 4" />
    <path d="M60 52h80M64 92h76" stroke-dasharray="4 4" opacity="0.6" />
    <circle cx="58" cy="72" r="2.5" fill="currentColor" />
    <path d="M58 72h12M84 72h8M106 72h8M128 72h8" />
    {#each [70, 92, 114] as x (x)}<rect x={x} y="65" width="14" height="14" rx="4" fill="var(--surface-default)" />{/each}
    <circle cx="148" cy="72" r="10" fill="var(--cover-accent)" stroke="none" />
    <path d="m143 72 3.5 3.5 6.5-7" stroke="var(--cover-bg)" stroke-width="2" />
  {:else if k === "Agents"}
    <circle cx="100" cy="62" r="46" stroke-dasharray="1 5" opacity="0.6" />
    <circle cx="100" cy="62" r="28" stroke-dasharray="1 5" opacity="0.6" />
    <path d="M100 62 70 34M100 62l26-18M100 62l40 4M100 62 76 88" />
    {#each [[70, 34], [126, 44], [140, 66], [76, 88]] as [x, y] (`${x}-${y}`)}
      <rect x={x! - 7} y={y! - 7} width="14" height="14" rx="4" fill="var(--surface-default)" />
    {/each}
    <circle cx="100" cy="62" r="12" fill="var(--cover-accent)" stroke="none" />
    <circle cx="100" cy="62" r="4.5" fill="var(--surface-default)" stroke="none" />
  {:else if k === "Design"}
    <rect x="58" y="14" width="84" height="92" rx="8" fill="var(--surface-default)" />
    <path d="M58 28h84" />
    <circle cx="66" cy="21" r="1.5" fill="currentColor" /><circle cx="72" cy="21" r="1.5" fill="currentColor" />
    <rect x="66" y="36" width="60" height="6" rx="3" />
    <rect x="66" y="48" width="40" height="5" rx="2.5" />
    <rect x="66" y="62" width="26" height="30" rx="4" fill="var(--cover-accent)" stroke="none" />
    <rect x="98" y="62" width="34" height="12" rx="4" />
    <rect x="98" y="80" width="34" height="12" rx="4" />
    <path d="M40 100c30-6 50-30 70-50s30-26 46-28" />
  {:else}
    <rect x="62" y="18" width="76" height="88" rx="8" fill="var(--surface-default)" />
    <path d="M74 38h52M74 50h52M74 62h36M74 74h44" />
  {/if}
</svg>
{/key}

<style>
  .art { width: 100%; height: 100%; color: var(--fg-default); }

  /* Resting state = last frame. Packets rest at the end of their path, hidden under the node they reach. */
  .pk { stroke: var(--cover-accent); stroke-width: 5; stroke-dasharray: 0.01 200; stroke-dashoffset: -100; }
  .draw, .curve { stroke-dasharray: 1; }
  .token { translate: 121px 0; }
  .ring { opacity: 0; }
  .box { transform-box: fill-box; transform-origin: center; }
  .cursor { transform-box: fill-box; transform-origin: 0 0; }
  .spin { transform-box: view-box; transform-origin: 105px 30px; }

  /* One lead motion per cover, all within 1.4 s; --play-delay comes from the card (row stagger, fan arrival) */
  @media (prefers-reduced-motion: no-preference) {
    .play * {
      animation-delay: calc(var(--play-delay, 0ms) + var(--d, 0ms));
      animation-fill-mode: both;
      animation-timing-function: var(--ease-out);
    }
    .play .pk { animation-name: travel; animation-duration: 480ms; animation-timing-function: var(--ease-in-out); }
    .play .pk.out { animation-duration: 440ms; }
    .play .draw { animation-name: draw; animation-duration: 300ms; }

    /* redesign: cursor glides in and presses, the stage answers with a ripple from the play button */
    .play .cursor { animation-name: glide, press; animation-duration: 720ms, 200ms; animation-delay: var(--play-delay, 0ms), calc(var(--play-delay, 0ms) + 720ms); animation-timing-function: var(--ease-in-out); }
    /* no backwards fill: the ring exists only while it spreads */
    .play .ring { --d: 780ms; animation-name: ripple; animation-duration: 560ms; animation-fill-mode: none; }
    .play .pop { --d: 780ms; animation-name: press; animation-duration: 300ms; }

    /* CI/CD: the commit rides the line, each gate lamp lights as it passes */
    .play .token { animation-name: ride; animation-duration: 900ms; animation-timing-function: var(--ease-in-out); }
    .play .lamp { animation-name: lamp; animation-duration: 220ms; }

    /* React 19 Actions: press, request out (spinner turns while pending), response back, done */
    .play .btn { animation-name: press; animation-duration: 220ms; animation-timing-function: var(--ease-in-out); }
    .play .spin { --d: 120ms; animation-name: spin; animation-duration: 700ms; animation-timing-function: var(--ease-in-out); }

    /* SaaS: the exploded layers settle into one stack together, the links join last */
    .play .layer { animation-name: settle; animation-duration: 600ms; }
    .play .links { --d: 380ms; animation-name: fade; animation-duration: 240ms; }

    /* OKLCH: the curve draws and the swatches rise along it, light to dark */
    .play .curve { animation-name: draw; animation-duration: 700ms; }
    .play .sw { animation-name: rise; animation-duration: 480ms; }
  }

  @keyframes travel { from { stroke-dashoffset: 0; } }
  @keyframes draw { from { stroke-dashoffset: 1; } }
  @keyframes glide { from { translate: 28px 30px; opacity: 0; } 30% { opacity: 1; } }
  /* a press starts and ends at rest, so a replay never jumps */
  @keyframes press { 50% { scale: 0.9; } }
  @keyframes ripple { from { opacity: 0.8; scale: 0.9; } to { opacity: 0; scale: 1.7; } }
  @keyframes ride { from { translate: 0 0; } }
  @keyframes lamp { from { opacity: 0.2; scale: 0.9; } }
  @keyframes spin { from { rotate: -360deg; } }
  @keyframes settle { from { translate: 0 var(--dy); } }
  @keyframes fade { from { opacity: 0; } }
  @keyframes rise { from { translate: -4px 10px; opacity: 0; } }
</style>
