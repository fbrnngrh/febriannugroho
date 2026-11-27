<script lang="ts">
  import { PERSON } from "#lib/content/site.ts";
  import Icon from "./Icon.svelte";

  // Shipping in public (Figma 26:1771, Color=Mono). Snapshot counts per day, trimmed in routes/+page.server.ts.
  /** [count, level] per day; level is GitHub's own quartile (0 = none … 4 = fourth quartile) */
  let { weeks }: { weeks: [number, number][][] } = $props();

  const total = $derived(weeks.flat().reduce((sum, [n]) => sum + n, 0));
  // no data (fetch failed at build): hide the grid and never show "0" (03-ux-pages §5)
  const hasData = $derived(weeks.length > 0 && total > 0);
</script>

<div class="shipping">
  <div class="head">
    <p class="label-mono">Shipping in public</p>
    <a class="link handle" href="https://github.com/{PERSON.github}" target="_blank" rel="noopener noreferrer">
      @{PERSON.github} <Icon name="arrow-up-right" size={12} />
    </a>
  </div>
  {#if hasData}
    <div class="grid" aria-hidden="true">
      {#each weeks as week, wi (wi)}
        <div class="col">
          {#each week as [, level], di (di)}
            <span class="cell" data-level={level}></span>
          {/each}
        </div>
      {/each}
    </div>
    <div class="foot">
      <p class="summary"><span class="tabular">{total.toLocaleString("en-US")}</span> contributions in the last 9 months</p>
      <div class="legend" aria-hidden="true">
        <span>Less</span>
        {#each [0, 1, 2, 3, 4] as l (l)}<span class="cell" data-level={l}></span>{/each}
        <span>More</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .shipping { display: grid; gap: 16px; }
  .head { display: flex; justify-content: space-between; align-items: baseline; }
  .head p { margin: 0; }
  .handle { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; }
  .grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 3px;
    width: 100%;
  }
  .col { display: grid; grid-template-rows: repeat(7, 1fr); gap: 3px; }
  .cell {
    display: block;
    aspect-ratio: 1;
    border-radius: 2px;
    background: var(--surface-muted);
  }
  .cell[data-level="1"] { background: color-mix(in srgb, var(--fg-default) 18%, var(--surface-muted)); }
  .cell[data-level="2"] { background: color-mix(in srgb, var(--fg-default) 40%, var(--surface-muted)); }
  .cell[data-level="3"] { background: color-mix(in srgb, var(--fg-default) 65%, var(--surface-muted)); }
  .cell[data-level="4"] { background: var(--fg-default); }
  .foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .summary { margin: 0; font-size: 13px; color: var(--fg-muted); }
  .legend { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--fg-muted); }
  .legend .cell { width: 10px; }
  .legend span:first-child { margin-right: 4px; }
  .legend span:last-child { margin-left: 4px; }
</style>
