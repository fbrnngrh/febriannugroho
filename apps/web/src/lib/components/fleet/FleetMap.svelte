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

  // Fleet map (Figma 67:1511 / 104:2817, phone 103:2047, review §6 · 04-motion.md §10).
  // A 10 s loop: phases set data-step / data-check for the CSS states (rings, avatars, chips);
  // packets ride the SVG connectors with the Web Animations API, so pausing is anim.pause().
  // Every third loop takes the fail path: "tests" goes red and the packet returns to JARVIS.
  type Phase = { at: number; step: number; check?: "pass" | "fail"; edges?: string[] };
  type Packet = { edge: string; at: number; dur: number; tone?: "fail" | "pass" | "gate" };
  const STAGGER = [0, 80, 140, 180];
  const START: Phase[] = [
    { at: 0, step: 1, edges: ["trigger"] },
    { at: 800, step: 2 },
    { at: 1400, step: 2, edges: ["run"] },
    { at: 2300, step: 3, edges: ["d0", "d1", "d2", "d3"] },
    { at: 3400, step: 4 },
    { at: 5600, step: 5, edges: ["m0", "m1", "m2", "m3", "trunk"] },
  ];
  const START_PACKETS: Packet[] = [
    { edge: "trigger", at: 0, dur: 800 },
    { edge: "run", at: 1400, dur: 900 },
    ...STAGGER.map((s, i) => ({ edge: `d${i}`, at: 2400 + s, dur: 1000 })),
    ...STAGGER.map((_, i) => ({ edge: `mp${i}`, at: 5600, dur: 900 })),
  ];
  const LOOPS = {
    pass: {
      length: 10000,
      phases: [
        ...START,
        { at: 6500, step: 6, check: "pass" },
        { at: 7300, step: 7, check: "pass", edges: ["approve", "pass"] },
        { at: 8000, step: 8, check: "pass" },
        { at: 9200, step: 0 },
      ] as Phase[],
      packets: [...START_PACKETS, { edge: "pass", at: 7200, dur: 800, tone: "pass" }, { edge: "approve", at: 7300, dur: 700, tone: "gate" }] as Packet[],
    },
    fail: {
      length: 11500,
      phases: [
        ...START,
        { at: 6500, step: 6, check: "fail" },
        { at: 6900, step: 9, check: "fail", edges: ["fail"] },
        { at: 7800, step: 3 },
        { at: 8200, step: 6, check: "pass" },
        { at: 8800, step: 7, check: "pass", edges: ["approve", "pass"] },
        { at: 9500, step: 8, check: "pass" },
        { at: 10700, step: 0 },
      ] as Phase[],
      packets: [
        ...START_PACKETS,
        { edge: "fail", at: 6900, dur: 900, tone: "fail" },
        { edge: "pass", at: 8700, dur: 800, tone: "pass" },
        { edge: "approve", at: 8800, dur: 700, tone: "gate" },
      ] as Packet[],
    },
  };
  const PACKET_EDGES = ["trigger", "run", "d0", "d1", "d2", "d3", "mp0", "mp1", "mp2", "mp3", "fail", "pass", "approve"];
  const WORKERS: AgentId[] = ["FRIDAY", "ULTRON", "EDITH", "KAREN"];

  let step = $state(0);
  let check = $state<"" | "pass" | "fail">("");
  let activeEdges = $state<string[]>([]);
  let wires = $state<Record<string, string>>({});
  let size = $state({ w: 0, h: 0 });
  let labels = $state({ fail: { x: 0, y: 0 }, approve: { x: 0, y: 0 } });
  const packetEls: Record<string, HTMLElement> = {};
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

  // Connectors: one SVG behind the cards, measured from the cards themselves (orthogonal, 8 px corners).
  function measure() {
    if (!map) return;
    const m = map.getBoundingClientRect();
    const ox = m.left + map.clientLeft;
    const oy = m.top + map.clientTop;
    const q = (k: string) => map!.querySelector<HTMLElement>(`[data-node="${k}"]`);
    const box = (el: HTMLElement | null) => {
      const r = el!.getBoundingClientRect();
      return { l: r.left - ox, r: r.right - ox, t: r.top - oy, b: r.bottom - oy, cx: (r.left + r.right) / 2 - ox, cy: (r.top + r.bottom) / 2 - oy };
    };
    const task = box(q("task")), t3 = box(q("t3")), gate = box(q("gate")), jarvis = box(q("jarvis"));
    const chk = box(q("check")), ship = box(q("ship"));
    const agents = WORKERS.map((w) => box(q(w)));
    const w = map.clientWidth, h = map.clientHeight;
    // phones stack the top row and wrap the agents in two rows
    const link = (a: typeof task, b: typeof task) => (b.l >= a.r ? path([a.r, a.cy], [b.l, a.cy]) : path([a.cx, a.b], [a.cx, b.t]));
    const stacked = t3.l < task.r;
    const firstRow = agents.filter((a) => Math.abs(a.t - agents[0]!.t) < 4);
    const lastRow = agents.filter((a) => Math.abs(a.t - agents[agents.length - 1]!.t) < 4);
    const busD = (jarvis.b + firstRow[0]!.t) / 2;
    const busM = (lastRow[0]!.b + chk.t) / 2;
    const leftX = Math.min(task.l, chk.l, jarvis.l) - 12;
    const rightX = Math.max(gate.r, ship.r) + 12;
    const next: Record<string, string> = {
      trigger: link(task, t3),
      spec: link(t3, gate),
      run: stacked ? path([gate.cx, gate.b], [gate.cx, jarvis.t]) : path([t3.cx, t3.b], [t3.cx, jarvis.t]),
      trunk: path([chk.cx, busM], [chk.cx, chk.t]),
      pass: path([chk.cx, chk.b], [ship.cx, ship.t]),
      fail: path([chk.l, chk.cy], [leftX, chk.cy], [leftX, jarvis.cy], [jarvis.l, jarvis.cy]),
      approve: path([gate.r, gate.cy], [rightX, gate.cy], [rightX, ship.cy], [ship.r, ship.cy]),
    };
    agents.forEach((a, i) => {
      if (firstRow.includes(a)) next[`d${i}`] = path([jarvis.cx, jarvis.b], [jarvis.cx, busD], [a.cx, busD], [a.cx, a.t]);
      if (lastRow.includes(a)) {
        next[`m${i}`] = path([a.cx, a.b], [a.cx, busM], [chk.cx, busM]);
        next[`mp${i}`] = path([a.cx, a.b], [a.cx, busM], [chk.cx, busM], [chk.cx, chk.t]);
      }
    });
    wires = next;
    size = { w, h };
    labels = { fail: { x: leftX + 6, y: chk.cy - 7 }, approve: { x: rightX - 6, y: ship.cy - 7 } };
  }

  /** Orthogonal polyline with 8 px rounded corners. */
  function path(...pts: [number, number][]) {
    const R = 8;
    let d = `M${pts[0]![0]} ${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i]!;
      const nxt = pts[i + 1];
      if (!nxt) {
        d += ` L${x} ${y}`;
        break;
      }
      const [px, py] = pts[i - 1]!;
      const r1 = Math.min(R, Math.hypot(x - px, y - py) / 2, Math.hypot(nxt[0] - x, nxt[1] - y) / 2);
      const ax = x - Math.sign(x - px) * r1, ay = y - Math.sign(y - py) * r1;
      const bx = x + Math.sign(nxt[0] - x) * r1, by = y + Math.sign(nxt[1] - y) * r1;
      d += ` L${ax} ${ay} Q${x} ${y} ${bx} ${by}`;
    }
    return d;
  }

  $effect(() => {
    if (!map) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(map);
    return () => ro.disconnect();
  });

  // One clock: phases switch CSS states, packets are WAAPI animations started with the loop and paused with it.
  let clock = 0;
  let loopIndex = 0;
  let anims: Animation[] = [];
  const currentLoop = () => (loopIndex % 3 === 2 ? LOOPS.fail : LOOPS.pass);

  function startLoop() {
    anims.forEach((a) => a.cancel());
    const loop = currentLoop();
    anims = loop.packets.flatMap(({ edge, at, dur, tone }) => {
      const el = packetEls[edge];
      if (!el || !wires[edge]) return [];
      el.dataset.tone = tone ?? "";
      return [
        el.animate(
          [
            { offsetDistance: "0%", opacity: 0 },
            { opacity: 1, offset: 0.12 },
            { opacity: 1, offset: 0.88 },
            { offsetDistance: "100%", opacity: 0 },
          ],
          { duration: dur, delay: at, easing: "cubic-bezier(0.645, 0.045, 0.355, 1)", fill: "backwards" },
        ),
      ];
    });
  }

  function applyPhase(t: number) {
    const phase: Phase = currentLoop().phases.findLast((p) => p.at <= t) ?? { at: 0, step: 0 };
    step = phase.step;
    check = phase.check ?? "";
    activeEdges = phase.edges ?? [];
  }

  $effect(() => {
    if (!running) return;
    if (clock === 0) startLoop();
    else anims.forEach((a) => a.play());
    let last = performance.now();
    let raf = requestAnimationFrame(function frame(now) {
      clock += now - last;
      last = now;
      if (clock >= currentLoop().length) {
        clock = 0;
        loopIndex++;
        startLoop();
      }
      applyPhase(clock);
      raf = requestAnimationFrame(frame);
    });
    return () => {
      cancelAnimationFrame(raf);
      anims.forEach((a) => a.pause());
    };
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
  data-check={check}
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
  <!-- connectors and packets, measured from the cards (Figma 67:1511); decorative, the cards carry the text -->
  <svg class="wires" width={size.w} height={size.h} viewBox="0 0 {size.w} {size.h}" aria-hidden="true">
    <defs>
      {#each ["base", "pass", "fail"] as m (m)}
        <marker id="fm-arrow-{m}" class="arrow-{m}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0.5 L5.5 3 L0 5.5 Z" />
        </marker>
      {/each}
    </defs>
    {#each Object.entries(wires) as [k, d] (k)}
      {#if !k.startsWith("mp")}
        {@const kind = k === "pass" ? "pass" : k === "fail" ? "fail" : "base"}
        <path class="wire {kind}" class:gate={k === "approve"} {d} marker-end={/^m\d/.test(k) ? undefined : `url(#fm-arrow-${kind})`} />
        <path class="flow {kind}" class:on={activeEdges.includes(k)} {d} />
      {/if}
    {/each}
    <text class="wl fail" x={labels.fail.x} y={labels.fail.y}>fail → back to lead</text>
    <text class="wl gate" x={labels.approve.x} y={labels.approve.y} text-anchor="end">approve ship</text>
  </svg>
  {#each PACKET_EDGES as k (k)}
    <span class="pk" bind:this={packetEls[k]} style:offset-path={wires[k] ? `path("${wires[k]}")` : "none"} aria-hidden="true"></span>
  {/each}

  <div class="row top">
    <div class="node" data-node="task">
      <p class="n-title"><span class="glyph mono">#</span>Task</p>
      <p class="n-sub">issue · spec · idea</p>
    </div>
    <div class="h-link" data-label="trigger"></div>
    <div class="node t3" data-node="t3">
      <p class="n-title"><Logo name="t3code" size={18} />T3 Code</p>
      <p class="n-sub">control plane, local</p>
      <p class="logos"><Logo name="claude" size={12} /><Logo name="antigravity" size={12} /></p>
    </div>
    <div class="h-link" data-label="spec"></div>
    <div class="node gate" data-node="gate">
      <p class="n-title"><img src="/images/profile-photo-2.webp" alt="" width="18" height="18" class="me" />You · phone</p>
      <p class="n-sub">approves spec and ship</p>
    </div>
  </div>

  <div class="v-link" data-label="run"></div>

  <button type="button" class="node agent lead" data-node="jarvis" aria-label="Open JARVIS card" onclick={(e) => show("JARVIS", e)}>
    <span class="n-title"><AgentAvatar id="JARVIS" size={24} active={step === 3} />JARVIS<Icon name="arrow-up-right" size={12} class="open-ic" /></span>
    <span class="n-sub accent">lead · orchestrator</span>
    <span class="n-sub chips"><Logo name="claude" size={12} /><span>Opus</span><span>Matt Pocock skills</span></span>
  </button>

  <div class="branch" data-label="delegate_task">
    {#each WORKERS as w (w)}<span class="drop"></span>{/each}
  </div>

  <div class="row agents">
    {#each WORKERS as w (w)}
      <button type="button" class="node agent" data-node={w} aria-label="Open {w} card" onclick={(e) => show(w, e)}>
        <span class="n-title"><AgentAvatar id={w} size={24} active={step === 4} />{w}<Icon name="arrow-up-right" size={12} class="open-ic" /></span>
        <span class="n-sub">{AGENTS[w].role}</span>
        <span class="logos">{#each AGENTS[w].logos as l (l)}<Logo name={l} size={12} />{/each}</span>
      </button>
    {/each}
  </div>

  <div class="merge" aria-hidden="true">
    {#each WORKERS as w (w)}<span class="rise"></span>{/each}
    <span class="join"></span>
  </div>

  <div class="node check" data-node="check">
    <p class="n-title"><span class="glyph solid">✓</span>fleet check</p>
    <p class="n-sub">deterministic checks per area</p>
    <p class="chips">
      {#each ["lint", "types", "tests", "build"] as c, i (c)}<span class="chip" data-label={c} style:--i={i * 120}><span class="chip-t">{c}</span></span>{/each}
    </p>
    <p class="n-sub fail">fail → back to lead</p>
  </div>

  <div class="v-link pass" data-label="pass"></div>

  <div class="node ship" data-node="ship">
    <p class="n-title"><span class="glyph green">↑</span>Ship</p>
    <p class="n-sub">fleet-ship checks, then deploy</p>
    <p class="n-sub approve">approve ship · human gate</p>
    <p class="logos"><Logo name="github-actions" size={12} /><Logo name="docker" size={12} /><Logo name="easypanel" size={12} /></p>
  </div>


  <!-- pause sits in the legend row, clear of the nodes -->
  <div class="map-foot">
    <ul class="legend" aria-label="Legend">
      <li><span class="ln solid"></span>human gate</li>
      <li><span class="ln dashed"></span>retro: findings become new checks</li>
      <li><span class="ln green"></span>pass</li>
    </ul>
    {#if !reduced}
      <button
        type="button"
        class="icon-button map-pause"
        aria-label={paused ? "Play fleet animation" : "Pause fleet animation"}
        aria-pressed={paused}
        onclick={() => (paused = !paused)}
      >
        <Icon name={paused ? "play" : "pause"} size={12} />
      </button>
    {/if}
  </div>

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
  }
  /* step rings (T3, gate, ship) fade in as a layer: no box-shadow transition */
  .node::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    box-shadow: var(--ring, none);
    opacity: 0;
    pointer-events: none;
    transition: opacity 240ms var(--ease-flow);
  }
  .t3 { --ring: 0 0 0 3px color-mix(in srgb, var(--fleet-solid) 30%, transparent); }
  .gate { --ring: 0 0 0 3px color-mix(in srgb, var(--line-strong) 25%, transparent); }
  .ship { --ring: 0 0 0 2px var(--ci-solid), 0 8px 20px -8px color-mix(in srgb, var(--ci-solid) 40%, transparent); }
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
  @media (min-width: 768px) {
    .n-sub.fail, .n-sub.approve { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  }
  @media (max-width: 767.98px) {
    .wl { display: none; }
  }
  .approve { font-weight: 500; }
  .chip {
    padding: 1px 6px;
    border-radius: var(--radius-tag);
    background: var(--surface-muted);
    font: 11px/16px var(--font-mono);
    color: var(--fg-secondary);
  }
  /* passed: green fill and text crossfade in over the grey ones */
  .chip { position: relative; isolation: isolate; }
  .chip::before, .chip::after {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 160ms var(--ease-flow);
  }
  .chip::before { content: ""; z-index: -1; background: var(--ci-subtle); }
  .chip::after { content: attr(data-label); padding: inherit; color: var(--ci-text); }
  .chip-t { transition: opacity 160ms var(--ease-flow); }
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
  button.node { transition: scale var(--dur-release) var(--ease-out); }
  button.node:active { scale: 0.96; transition-duration: var(--dur-press); }
  @media (hover: hover) and (pointer: fine) {
    button.node:hover::before { opacity: 0.04; }
  }

  /* connectors */
  .h-link, .v-link, .branch, .merge { position: relative; }
  .h-link { align-self: center; height: 1px; margin-top: -10px; }
  .h-link::after, .v-link::after, .branch::after {
    content: attr(data-label);
    position: absolute;
    z-index: 1;
    padding: 2px 4px;
    /* sits on its wire like the Figma labels: the surface masks the line behind the text */
    background: var(--surface-default);
    font: 10px/1 var(--font-mono);
    color: var(--fg-faint);
    white-space: nowrap;
  }
  .h-link::after { left: 50%; bottom: 6px; translate: -50% 0; }
  .v-link { width: 1px; height: 44px; }
  .v-link::after { left: 8px; top: 50%; translate: 0 -50%; }
  .v-link.pass::after { color: var(--ci-text); }
  .branch { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; height: 40px; }
  .branch::after { left: 50%; top: 18px; translate: 8px 0; color: var(--fleet-text); }
  .drop { justify-self: center; width: 1px; }
  .merge {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
    height: 40px;
  }
  .rise, .join { width: 1px; }
  .agents { position: relative; }

  /* SVG connectors: thin lines with 6 × 6 arrows; the active one carries a dashed flow (0 → -16, 900 ms) */
  .node, .lead, .agents, .row { position: relative; z-index: 1; }
  .wires { position: absolute; top: 0; left: 0; z-index: 0; overflow: visible; pointer-events: none; }
  .wire { fill: none; stroke: var(--line-default); stroke-width: 1.25; }
  .wire.pass { stroke: var(--ci-solid); }
  .wire.fail { stroke: var(--fleet-text); stroke-dasharray: 3 3; }
  .wire.gate { stroke: var(--line-strong); }
  .arrow-base path { fill: var(--line-default); }
  .arrow-pass path { fill: var(--ci-solid); }
  .arrow-fail path { fill: var(--fleet-text); }
  .flow { fill: none; stroke: var(--fleet-solid); stroke-width: 1.5; stroke-dasharray: 4 4; opacity: 0; transition: opacity 200ms var(--ease-out); }
  .flow.pass { stroke: var(--ci-solid); }
  .flow.on { opacity: 1; animation: flow 900ms linear infinite; }
  .map:not(.running) .flow.on { animation-play-state: paused; }
  @keyframes flow { to { stroke-dashoffset: -16; } }
  .wl { font: 11px var(--font-mono); }
  .wl.fail { fill: var(--fleet-text); }
  .wl.gate { fill: var(--fg-secondary); }

  /* packet: 10 px head with a 24 px tail, riding offset-path along its wire */
  .pk {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 24px;
    height: 10px;
    border-radius: 5px;
    background: linear-gradient(to right, transparent, color-mix(in oklab, var(--pk) 55%, transparent));
    offset-anchor: 19px 5px;
    offset-rotate: auto;
    opacity: 0;
    pointer-events: none;
    --pk: var(--fleet-solid);
  }
  .pk::after { content: ""; position: absolute; right: 0; top: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--pk); }
  /* data-tone is set per run in startLoop() */
  .pk:global([data-tone="pass"]) { --pk: var(--ci-solid); }
  .pk:global([data-tone="gate"]) { --pk: var(--line-strong); }

  /* agents at work (3.4–5.6 s): a slow 1 → 1.04 breath on each avatar */
  .map[data-step="3"] .lead :global(.avatar),
  .map[data-step="4"] .agents :global(.avatar) { animation: work 1200ms var(--ease-in-out) infinite alternate; }
  @keyframes work { to { scale: 1.04; } }
  .map:not(.running) :global(.avatar) { animation-play-state: paused; }

  /* T3 ring 0.8 s, chips light one by one (120 ms), approve ring 7.3 s, Ship 8 s */
  .map[data-step="2"] .t3::after { opacity: 1; }
  .map[data-check="pass"] .chip::before,
  .map[data-check="pass"] .chip::after { opacity: 1; transition-delay: calc(var(--i) * 1ms); }
  .map[data-check="pass"] .chip-t { opacity: 0; transition-delay: calc(var(--i) * 1ms); }
  /* fail path (every third loop): lint and types pass, tests goes red, build never runs */
  .map[data-check="fail"] .chip:nth-child(-n + 3)::before,
  .map[data-check="fail"] .chip:nth-child(-n + 3)::after { opacity: 1; transition-delay: calc(var(--i) * 1ms); }
  .map[data-check="fail"] .chip:nth-child(-n + 3) .chip-t { opacity: 0; transition-delay: calc(var(--i) * 1ms); }
  .map[data-check="fail"] .chip:nth-child(3)::before { background: var(--danger-subtle); }
  .map[data-check="fail"] .chip:nth-child(3)::after { color: var(--danger-text); }
  .map[data-step="7"] .gate::after { opacity: 1; }
  .map[data-step="8"] .ship::after { opacity: 1; transition-duration: 320ms; }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    font: 10px/1.4 var(--font-mono);
    color: var(--fg-muted);
  }
  .map-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; margin-top: 28px; }
  .map-pause { flex: none; }
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
    .agents { grid-template-columns: 1fr 1fr; }
    .branch { grid-template-columns: 1fr 1fr; }
    .branch, .merge { grid-template-columns: 1fr 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pk { display: none; }
    button.node:active { scale: 1; }
    .agent-card, .agent-card[open] { scale: 1; translate: 0 0; transition-property: opacity, display, overlay; }
    .agent-card { opacity: 0; }
    .agent-card[open] { opacity: 1; transition-duration: 200ms; }
    @starting-style { .agent-card[open] { opacity: 0; scale: 1; translate: 0 0; } }
  }
</style>
