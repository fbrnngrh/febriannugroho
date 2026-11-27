<script lang="ts">
  import { PERSON } from "#lib/content/site.ts";
  import Icon from "./Icon.svelte";

  // Shipping in public (Figma 26:1771, Color=Mono). Snapshot counts per day, trimmed in routes/+page.server.ts.
  /** [count, level, date] per day; level is GitHub's own quartile (0 = none … 4 = fourth quartile) */
  let { weeks }: { weeks: [number, number, string][][] } = $props();

  const total = $derived(weeks.flat().reduce((sum, [n]) => sum + n, 0));
  // no data (fetch failed at build): hide the grid and never show "0" (03-ux-pages §5)
  const hasData = $derived(weeks.length > 0 && total > 0);

  // One tooltip for the whole grid (event delegation): it fades in once, then jumps between cells
  // without animating again (a tooltip already open answers the next hover instantly).
  let tip = $state<{ text: string; x: number; y: number; w: number } | null>(null);
  let box = $state<HTMLElement>();
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

  function point(e: PointerEvent) {
    const cell = (e.target as HTMLElement).closest<HTMLElement>(".grid .cell");
    if (!cell || !box) return;
    const day = weeks[Number(cell.dataset.w)]?.[Number(cell.dataset.d)];
    if (!day) return;
    const [count, , date] = day;
    const c = cell.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const when = fmt.format(new Date(date + "T00:00:00Z"));
    tip = {
      text: count === 0 ? `No contributions on ${when}` : `${count} contribution${count === 1 ? "" : "s"} on ${when}`,
      x: c.left + c.width / 2 - b.left,
      y: c.top - b.top,
      w: b.width,
    };
  }
</script>

<div class="shipping" bind:this={box}>
  <div class="head">
    <p class="label-mono">Shipping in public</p>
    <a class="link handle" href="https://github.com/{PERSON.github}" target="_blank" rel="noopener noreferrer">
      @{PERSON.github} <Icon name="arrow-up-right" size={12} />
    </a>
  </div>
  {#if hasData}
    <!-- decorative: the total below is the accessible summary; the per-day tooltip is a pointer extra -->
    <div class="grid" aria-hidden="true" onpointerover={point} onpointerleave={() => (tip = null)}>
      {#each weeks as week, wi (wi)}
        <div class="col">
          {#each week as [, level], di (di)}
            <span class="cell" data-level={level} data-w={wi} data-d={di}></span>
          {/each}
        </div>
      {/each}
    </div>
    <span class="tip" class:on={tip} style:--x="{tip?.x ?? 0}px" style:--y="{tip?.y ?? 0}px" style:--w="{tip?.w ?? 0}px" aria-hidden="true">{tip?.text ?? ""}</span>
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
  /* overflow-x: clip keeps the tooltip from ever widening the page (it clamps inside anyway) */
  .shipping { position: relative; display: grid; gap: 16px; overflow-x: clip; }
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
  /* hovered day: a small lift and a ring, 150 ms (seen many times in a row, so short and subtle) */
  @media (hover: hover) and (pointer: fine) {
    .grid .cell { transition: scale 150ms var(--ease-out), box-shadow 150ms var(--ease-out); }
    .grid .cell:hover { box-shadow: 0 0 0 1.5px var(--fg-default); }
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .grid .cell:hover { scale: 1.35; }
  }
  /* tooltip above the hovered cell, scaling from its bottom centre (the trigger side) */
  .tip {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    padding: 6px 8px;
    border-radius: var(--radius-chip);
    background: var(--surface-inverse);
    color: var(--fg-on-inverse);
    font-size: 12px;
    line-height: 1.2;
    white-space: nowrap;
    pointer-events: none;
    /* centred on the cell, clamped inside the column so the first and last weeks never overflow */
    translate: clamp(0px, calc(var(--x) - 50%), calc(var(--w) - 100%)) calc(var(--y) - 100% - 8px);
    transform-origin: 50% 100%;
    opacity: 0;
    scale: 0.97;
    transition: opacity 125ms var(--ease-out), scale 125ms var(--ease-out);
  }
  .tip.on { opacity: 1; scale: 1; transition-duration: 150ms; }
  @media (prefers-reduced-motion: reduce) {
    .tip { scale: 1; transition-property: opacity; }
  }
  .foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .summary { margin: 0; font-size: 13px; color: var(--fg-muted); }
  .legend { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--fg-muted); }
  .legend .cell { width: 10px; }
  .legend span:first-child { margin-right: 4px; }
  .legend span:last-child { margin-left: 4px; }
</style>
