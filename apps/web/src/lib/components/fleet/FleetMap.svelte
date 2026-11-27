<script lang="ts">
  import { tick } from "svelte";
  import { page } from "$app/state";
  import { AGENTS, type AgentId } from "#lib/content/site.ts";
  import { prefersReducedMotion } from "#lib/motion.ts";
  import { isBackdropClick, openOverlay } from "#lib/overlay.ts";
  import { sheetDrag } from "#lib/sheet.ts";
  import AgentAvatar from "../AgentAvatar.svelte";
  import Icon from "../Icon.svelte";
  import Logo from "../Logo.svelte";

  // Fleet map (Figma 104:2817, phone 103:2047, motion 105:6878 / 04-motion.md §10).
  // One ~6 s loop expressed as steps 0 (Diam) … 6 (Ship); CSS does each element's motion.
  const TIMELINE: [number, number][] = [
    [0, 1], // packet Task → T3 Code; T3 ring at +240
    [560, 2], // packet T3 → JARVIS
    [1040, 3], // 4 packets JARVIS → agents, agents active at +40
    [2000, 4], // merge
    [2200, 5], // check chips + approve line
    [2900, 6], // ship
    [4800, 0], // reset
  ];
  const LOOP_MS = 6000;
  const WORKERS: AgentId[] = ["FRIDAY", "ULTRON", "EDITH", "KAREN"];

  let step = $state(0);
  let visible = $state(false);
  let hovering = $state(false);
  let focusedWithin = $state(false);
  let tabHidden = $state(false);
  let reduced = $state(false);
  let paused = $state(false);
  let openAgent = $state<AgentId | null>(null);
  let map = $state<HTMLElement>();
  let card = $state<HTMLDialogElement>();
  let trigger: HTMLElement | null = null;
  let cardPos = $state({ top: 0, left: 0, side: "right" as "right" | "left" });

  const running = $derived(visible && !paused && !hovering && !focusedWithin && !tabHidden && !reduced && !openAgent);

  $effect(() => {
    reduced = prefersReducedMotion();
    const onVis = () => (tabHidden = document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    // start at 50% visible, pause below 10%
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.intersectionRatio >= 0.5) visible = true;
        else if (e.intersectionRatio < 0.1) visible = false;
      },
      { threshold: [0, 0.1, 0.5] },
    );
    if (map) io.observe(map);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  });

  // restart the loop from step 0 whenever it resumes
  $effect(() => {
    if (!running) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      timers = TIMELINE.map(([at, s]) => setTimeout(() => (step = s), at));
      timers.push(setTimeout(loop, LOOP_MS));
    };
    loop();
    return () => timers.forEach(clearTimeout);
  });

  async function show(id: AgentId, e: MouseEvent) {
    trigger = e.currentTarget as HTMLElement;
    openAgent = id;
    step = 0;
    await tick();
    if (!card || !map) return;
    if (window.matchMedia("(max-width: 767.98px)").matches) {
      // phone sheet gets a history entry so back closes it (03 §3)
      await openOverlay({ agent: id });
      card.showModal();
    } else {
      const m = map.getBoundingClientRect();
      const n = trigger.getBoundingClientRect();
      const right = n.right - m.left + 8 + 300 <= m.width;
      cardPos = {
        top: n.top - m.top,
        left: right ? n.right - m.left + 8 : n.left - m.left - 8 - 300,
        side: right ? "right" : "left",
      };
      card.show();
    }
    card.querySelector<HTMLElement>("h3")?.focus();
  }

  function hide() {
    if (!openAgent) return;
    card?.close();
  }

  // back button: the history entry is gone while the sheet is still open
  $effect(() => {
    if (!page.state.agent && card?.open && card.matches(":modal")) card.close();
  });

  function onclose() {
    if (page.state.agent) history.back();
    openAgent = null;
    trigger?.focus();
    trigger = null;
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && openAgent && card?.open && !card.matches(":modal")) hide();
  }
  function onpointerdown(e: PointerEvent) {
    if (!openAgent || !card?.open || card.matches(":modal")) return;
    const t = e.target as Node;
    if (!card.contains(t) && !trigger?.contains(t)) hide();
  }

  const agent = $derived(openAgent ? AGENTS[openAgent] : null);
</script>

<svelte:window {onkeydown} />
<svelte:document {onpointerdown} />

<div
  class="map"
  bind:this={map}
  data-step={step}
  class:running
  role="group"
  aria-label="How the fleet works"
  onpointerenter={(e) => e.pointerType === "mouse" && (hovering = true)}
  onpointerleave={() => (hovering = false)}
  onfocusin={() => (focusedWithin = true)}
  onfocusout={(e) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) focusedWithin = false;
  }}
>
  <div class="row top">
    <div class="node">
      <p class="n-title"><span class="glyph mono">#</span>Task</p>
      <p class="n-sub">issue · spec · idea</p>
    </div>
    <div class="h-link" data-label="trigger"><span class="packet p1"></span></div>
    <div class="node t3">
      <p class="n-title"><Logo name="t3code" size={18} />T3 Code</p>
      <p class="n-sub">control plane, local</p>
      <p class="logos"><Logo name="claude" size={12} /><Logo name="antigravity" size={12} /></p>
    </div>
    <div class="h-link" data-label="spec"></div>
    <div class="node gate">
      <p class="n-title"><img src="/images/profile-photo-2.webp" alt="" width="18" height="18" class="me" />You · phone</p>
      <p class="n-sub">approves spec and ship</p>
    </div>
  </div>

  <div class="v-link" data-label="run"><span class="packet p2"></span></div>

  <button type="button" class="node agent lead" aria-label="Open JARVIS card" onclick={(e) => show("JARVIS", e)}>
    <span class="n-title"><AgentAvatar id="JARVIS" size={24} active={step >= 2 && step < 4} />JARVIS<Icon name="arrow-up-right" size={12} class="open-ic" /></span>
    <span class="n-sub accent">lead · orchestrator</span>
    <span class="n-sub chips"><Logo name="claude" size={12} /><span>Opus</span><span>Matt Pocock skills</span></span>
  </button>

  <div class="branch" data-label="delegate_task">
    {#each WORKERS as w, i (w)}<span class="drop" style:--i={[0, 40, 70, 90][i]}><span class="packet p3"></span></span>{/each}
  </div>

  <div class="row agents">
    {#each WORKERS as w (w)}
      <button type="button" class="node agent" aria-label="Open {w} card" onclick={(e) => show(w, e)}>
        <span class="n-title"><AgentAvatar id={w} size={24} active={step === 3} />{w}<Icon name="arrow-up-right" size={12} class="open-ic" /></span>
        <span class="n-sub">{AGENTS[w].role}</span>
        <span class="logos">{#each AGENTS[w].logos as l (l)}<Logo name={l} size={12} />{/each}</span>
      </button>
    {/each}
  </div>

  <div class="merge" aria-hidden="true">
    {#each WORKERS as w (w)}<span class="rise"></span>{/each}
    <span class="join"><span class="packet p4"></span></span>
  </div>

  <div class="node check">
    <p class="n-title"><span class="glyph solid">✓</span>fleet check</p>
    <p class="n-sub">deterministic checks per area</p>
    <p class="chips">
      {#each ["lint", "types", "tests", "build"] as c, i (c)}<span class="chip" style:--i={i * 50}>{c}</span>{/each}
    </p>
    <p class="n-sub fail">fail → back to lead</p>
  </div>

  <div class="v-link pass" data-label="pass"><span class="packet p5"></span></div>

  <div class="node ship">
    <p class="n-title"><span class="glyph green">↑</span>Ship</p>
    <p class="n-sub">fleet-ship checks, then deploy</p>
    <p class="n-sub approve">approve ship · human gate</p>
    <p class="logos"><Logo name="docker" size={12} /><Logo name="easypanel" size={12} /></p>
  </div>

  {#if !reduced}
    <button
      type="button"
      class="icon-button map-pause"
      aria-label={paused ? "Play fleet animation" : "Pause fleet animation"}
      onclick={() => (paused = !paused)}
    >
      <Icon name={paused ? "play" : "pause"} size={12} />
    </button>
  {/if}

  <ul class="legend" aria-label="Legend">
    <li><span class="ln solid"></span>human gate</li>
    <li><span class="ln dashed"></span>retro: findings become new checks</li>
    <li><span class="ln green"></span>pass</li>
  </ul>

  <dialog
    class="agent-card"
    bind:this={card}
    style:--top="{cardPos.top}px"
    style:--left="{cardPos.left}px"
    data-side={cardPos.side}
    aria-labelledby="agent-title"
    {onclose}
    onclick={(e) => card?.matches(":modal") && isBackdropClick(e, card) && hide()}
    {@attach sheetDrag(hide)}
  >
    {#if agent}
      <div class="grab" aria-hidden="true"></div>
      <div class="c-head">
        <AgentAvatar id={agent.id} size={40} />
        <div>
          <h3 id="agent-title" tabindex="-1">{agent.id}</h3>
          <p class="n-sub">{agent.role}</p>
        </div>
        <button type="button" class="icon-button c-close" aria-label="Close {agent.id} card" onclick={hide}>
          <Icon name="close" size={14} />
        </button>
      </div>
      {#if agent.summary}<p class="c-text">{agent.summary}</p>{:else}<p class="c-text muted">Role notes coming soon.</p>{/if}
      <dl class="c-facts">
        {#if agent.model}<div><dt>Model</dt><dd>{agent.model}</dd></div>{/if}
        {#if agent.stack}<div><dt>Stack</dt><dd>{agent.stack.join(", ")}</dd></div>{/if}
        {#if agent.skills}<div><dt>Skills</dt><dd>{agent.skills.join(", ")}</dd></div>{/if}
      </dl>
      {#if agent.run}
        <p class="label-mono">Sample run</p>
        <pre class="c-run">{agent.run.join("\n")}</pre>
      {/if}
    {/if}
  </dialog>
</div>

<style>
  .map {
    position: relative;
    display: grid;
    justify-items: center;
    padding: 24px;
    border: 1px solid transparent;
    border-radius: var(--radius-stage);
    background: var(--surface-default);
    box-shadow: var(--shadow-ring-1);
  }
  .row { display: grid; width: 100%; }
  .top { grid-template-columns: 1fr 44px 1fr 44px 1fr; align-items: start; }
  .agents { grid-template-columns: repeat(4, 1fr); gap: 12px; }

  .node {
    position: relative;
    display: grid;
    gap: 6px;
    align-content: start;
    width: 100%;
    min-width: 0;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: var(--radius-node);
    background: var(--surface-default);
    box-shadow: var(--shadow-node);
    color: inherit;
    font: inherit;
    text-align: left;
    transition: box-shadow 240ms var(--ease-flow), background-color 240ms var(--ease-flow);
  }
  .node p { margin: 0; }
  .n-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; line-height: 20px; }
  .n-sub { font: 11px/16px var(--font-mono); color: var(--fg-muted); overflow-wrap: anywhere; }
  .accent { color: var(--fleet-text); }
  .logos, .chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .glyph {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--surface-muted);
    font-size: 11px;
  }
  .glyph.solid { background: var(--surface-inverse); color: var(--fg-on-inverse); }
  .glyph.green { background: var(--ci-solid); color: var(--fg-on-solid); }
  .me { border-radius: 50%; }
  .gate { border-color: var(--line-strong); }
  .lead { width: min(240px, 100%); margin: 0 auto; background: var(--fleet-subtle); }
  .check { width: min(280px, 100%); }
  .ship { width: min(280px, 100%); background: var(--ci-bg); box-shadow: 0 0 0 1px var(--ci-border); }
  .ship .n-sub { color: var(--ci-text); }
  .fail { color: var(--fleet-text); }
  .approve { font-weight: 500; }
  .chip {
    padding: 1px 6px;
    border-radius: var(--radius-tag);
    background: var(--surface-muted);
    font: 11px/16px var(--font-mono);
    color: var(--fg-secondary);
    transition: background-color 160ms var(--ease-flow), color 160ms var(--ease-flow);
  }
  :global(.open-ic) { margin-left: auto; color: var(--fg-faint); }

  /* agent nodes are buttons: overlay hover, 0.96 press */
  button.node::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--fg-default);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--dur-hover) var(--ease-out);
  }
  button.node { transition: scale var(--dur-release) var(--ease-out), box-shadow 240ms var(--ease-flow); }
  button.node:active { scale: 0.96; transition-duration: var(--dur-press); }
  @media (hover: hover) and (pointer: fine) {
    button.node:hover::before { opacity: 0.04; }
  }

  /* connectors */
  .h-link, .v-link, .branch, .merge { position: relative; }
  .h-link { align-self: center; height: 1px; margin-top: -10px; background: var(--line-default); }
  .h-link::after, .v-link::after, .branch::after {
    content: attr(data-label);
    position: absolute;
    font: 10px/1 var(--font-mono);
    color: var(--fg-faint);
    white-space: nowrap;
  }
  .h-link::after { left: 50%; bottom: 6px; translate: -50% 0; }
  .v-link { width: 1px; height: 44px; background: var(--line-default); }
  .v-link::after { left: 8px; top: 50%; translate: 0 -50%; }
  .v-link.pass { background: var(--ci-solid); }
  .v-link.pass::after { color: var(--ci-text); }
  .branch { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; height: 40px; }
  .branch::before { content: ""; position: absolute; top: 12px; left: 12.5%; right: 12.5%; height: 1px; background: var(--line-default); }
  .branch::after { left: 50%; top: 18px; translate: 8px 0; color: var(--fleet-text); }
  .drop { position: relative; justify-self: center; width: 1px; margin-top: 12px; background: var(--line-default); }
  .merge {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
    height: 40px;
  }
  .rise { justify-self: center; width: 1px; height: 14px; background: var(--line-default); }
  .merge::before { content: ""; position: absolute; top: 14px; left: 12.5%; right: 12.5%; height: 1px; background: var(--line-default); }
  .join { position: absolute; left: 50%; top: 14px; width: 1px; height: 26px; background: var(--line-default); }
  .agents { position: relative; }

  /* packets travel along the line; each plays once when its step starts */
  .packet {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--fleet-solid);
    opacity: 0;
    pointer-events: none;
  }
  .p1 { top: -3px; left: 0; }
  .p2, .p3, .p4, .p5 { left: -3px; top: 0; }
  .p5 { background: var(--ci-solid); }
  .map[data-step="1"] .p1 { animation: travel-x 320ms var(--ease-flow) both; }
  .map[data-step="2"] .p2 { animation: travel-y 360ms var(--ease-flow) both; --len: 44px; }
  .map[data-step="3"] .p3 { animation: travel-y 400ms var(--ease-flow) both; animation-delay: calc(var(--i) * 1ms); --len: 28px; }
  .map[data-step="4"] .p4 { animation: travel-y 360ms var(--ease-flow) both; --len: 26px; }
  .map[data-step="6"] .p5 { animation: travel-y 320ms var(--ease-flow) both; --len: 44px; }
  .map:not(.running) .packet { animation-play-state: paused; }
  .map-pause { position: absolute; top: 12px; right: 12px; z-index: 2; }
  @keyframes travel-x {
    0% { opacity: 0; translate: 0 0; }
    15% { opacity: 1; }
    100% { opacity: 0; translate: 44px 0; }
  }
  @keyframes travel-y {
    0% { opacity: 0; translate: 0 0; }
    15% { opacity: 1; }
    100% { opacity: 0; translate: 0 var(--len); }
  }
  /* T3 ring at +240 ms, active agents, check chips at 2200 + 50 ms each, ship at 2900 */
  .map[data-step="1"] .t3 { box-shadow: var(--shadow-node), 0 0 0 3px color-mix(in srgb, var(--fleet-solid) 30%, transparent); transition-delay: 240ms; }
  .map[data-step="5"] .chip, .map[data-step="6"] .chip { background: var(--ci-subtle); color: var(--ci-text); transition-delay: calc(var(--i) * 1ms); }
  .map[data-step="5"] .gate, .map[data-step="6"] .gate { box-shadow: var(--shadow-node), 0 0 0 3px color-mix(in srgb, var(--line-strong) 25%, transparent); }
  .map[data-step="6"] .ship { box-shadow: 0 0 0 2px var(--ci-solid), 0 8px 20px -8px color-mix(in srgb, var(--ci-solid) 40%, transparent); transition-duration: 320ms; }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    justify-self: start;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
    font: 10px/1.4 var(--font-mono);
    color: var(--fg-muted);
  }
  .legend li { display: flex; align-items: center; gap: 6px; }
  .ln { width: 16px; height: 0; border-top: 1px solid var(--line-strong); }
  .ln.dashed { border-top-style: dashed; border-color: var(--fleet-text); }
  .ln.green { border-color: var(--ci-solid); }

  /* agent card: popover beside the node on desktop, sheet on phones */
  .agent-card {
    padding: 16px;
    border: 1px solid transparent;
    border-radius: var(--radius-round);
    background: var(--surface-default);
    color: var(--fg-default);
    box-shadow: var(--shadow-modal);
    display: none;
    gap: 12px;
    opacity: 0;
    scale: 0.98;
    transition: opacity var(--dur-dialog-out) var(--ease-out), scale var(--dur-dialog-out) var(--ease-out),
      display var(--dur-dialog-out) allow-discrete, overlay var(--dur-dialog-out) allow-discrete;
  }
  .agent-card[open] { display: grid; opacity: 1; scale: 1; transition-duration: var(--dur-dialog); }
  @starting-style { .agent-card[open] { opacity: 0; scale: 0.98; } }
  @media (min-width: 768px) {
    .agent-card {
      position: absolute;
      inset: var(--top) auto auto var(--left);
      z-index: 5;
      width: 300px;
      margin: 0;
      transform-origin: left top;
    }
    .agent-card[data-side="left"] { transform-origin: right top; }
  }
  @media (max-width: 767.98px) {
    .agent-card {
      width: 100%;
      max-width: none;
      margin: auto 0 0;
      padding: 16px 24px calc(28px + env(safe-area-inset-bottom));
      border-radius: var(--radius-stage) var(--radius-stage) 0 0;
      opacity: 1;
      scale: 1;
      translate: 0 100%;
      transition: translate var(--dur-sheet) var(--ease-drawer), display var(--dur-sheet) allow-discrete,
        overlay var(--dur-sheet) allow-discrete;
      max-height: calc(100dvh - 48px);
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .grab, .c-head { touch-action: none; }
    .agent-card[open] { translate: 0 0; transition-duration: var(--dur-sheet); }
    @starting-style { .agent-card[open] { translate: 0 100%; } }
    .agent-card::backdrop {
      background: rgb(0 0 0 / calc(0.4 * var(--backdrop-a, 1)));
      transition: background var(--dur-sheet) var(--ease-out), overlay var(--dur-sheet) allow-discrete, display var(--dur-sheet) allow-discrete;
    }
    @starting-style { .agent-card[open]::backdrop { background: #0000; } }
    .agent-card:global(.dragging)::backdrop { transition: none; }
  }
  .grab { display: none; width: 36px; height: 4px; margin: 0 auto; border-radius: 2px; background: var(--line-soft); }
  @media (max-width: 767.98px) {
    .grab { display: block; }
  }
  .c-head { display: flex; align-items: center; gap: 12px; }
  .c-head h3 { margin: 0; font-size: 16px; font-weight: 600; }
  .c-head h3:focus { outline: none; }
  .c-close { margin-left: auto; }
  .c-close::after { content: ""; position: absolute; inset: -6px; }
  .c-text { margin: 0; font-size: 14px; line-height: 1.5; }
  .muted { color: var(--fg-muted); }
  .c-facts { display: grid; gap: 4px; margin: 0; font-size: 13px; }
  .c-facts div { display: grid; grid-template-columns: 56px 1fr; gap: 8px; }
  .c-facts dt { color: var(--fg-muted); }
  .c-facts dd { margin: 0; }
  .c-run {
    margin: 0;
    padding: 12px;
    border-radius: 8px;
    background: var(--stage-terminal-bg);
    color: var(--stage-terminal-fg);
    font: 12px/1.6 var(--font-mono);
    white-space: pre-wrap;
  }
  .agent-card :global(.label-mono) { margin: 0; }

  @media (max-width: 767.98px) {
    .map { padding: 16px; }
    .top { grid-template-columns: 1fr; justify-items: stretch; }
    .h-link { justify-self: center; width: 1px; height: 28px; margin: 0; }
    .h-link::after { left: 8px; bottom: auto; top: 50%; translate: 0 -50%; }
    .h-link .packet { display: none; }
    .agents { grid-template-columns: 1fr 1fr; }
    .branch { grid-template-columns: 1fr 1fr; }
    .branch .drop:nth-child(n + 3), .merge .rise:nth-child(n + 3) { display: none; }
    .branch, .merge { grid-template-columns: 1fr 1fr; }
    .branch::before, .merge::before { left: 25%; right: 25%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .packet { display: none; }
    button.node:active { scale: 1; }
    .agent-card, .agent-card[open] { scale: 1; translate: 0 0; transition-property: opacity, display, overlay; }
    .agent-card { opacity: 0; }
    .agent-card[open] { opacity: 1; transition-duration: 200ms; }
    @starting-style { .agent-card[open] { opacity: 0; scale: 1; translate: 0 0; } }
  }
</style>
