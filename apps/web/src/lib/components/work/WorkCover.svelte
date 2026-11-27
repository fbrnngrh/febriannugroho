<script lang="ts">
  import type { Project } from "#lib/content/site.ts";
  import AgentAvatar from "../AgentAvatar.svelte";
  import Logo from "../Logo.svelte";

  // Showcase covers (Figma 19:940). Fake data only, labelled (06-build-notes §5).
  let { project, variant = "card" }: { project: Project; variant?: "card" | "detail" } = $props();

  const leads = [
    { name: "A. Pratama", status: "Follow-up" },
    { name: "R. Sari", status: "Test ride" },
    { name: "D. Halim", status: "Closed" },
    { name: "M. Yusuf", status: "New lead" },
  ];
  const steps = [
    { name: "Install", time: "40s" },
    { name: "Lint & test", time: "45s" },
    { name: "Build image", time: "47s" },
  ];
</script>

<div class="cover" class:detail={variant === "detail"} style:--glow={project.glow} aria-hidden="true">
  {#if project.coverLabel}<span class="label">{project.coverLabel}</span>{/if}

  {#if project.id === "dealer"}
    <div class="device">
      <div class="dots"><i></i><i></i><i></i></div>
      <div class="stats">
        <div><span>Leads</span><b>128</b></div>
        <div><span>Follow-up</span><b>42</b></div>
        <div><span>Closed</span><b>17</b></div>
      </div>
      {#each leads as l (l.name)}
        <div class="lead"><span>{l.name}</span><em>{l.status}</em></div>
      {/each}
    </div>
  {:else if project.id === "ci-cd" && variant === "detail"}
    <div class="device">
      <div class="dots"><i></i><i></i><i></i></div>
      {#each steps as s (s.name)}
        <div class="step"><span class="tick">✓</span><span>{s.name}</span><em>{s.time}</em></div>
      {/each}
      <div class="step active"><span class="spin"></span><span>Deploy to staging</span><em>running…</em></div>
    </div>
  {:else if project.id === "ci-cd"}
    <div class="device">
      <div class="bar"><Logo name="easypanel" size={12} /> EasyPanel · App Service</div>
      <div class="pad">
        <b class="big">Deployed from main</b>
        <span class="live">● Live</span>
        <span class="small">Source GitHub · Dockerfile at root</span>
        <div class="term"><span>Starting container</span><span class="ok">GET /health 200</span></div>
      </div>
    </div>
  {:else if project.id === "fleet"}
    <div class="device">
      <div class="bar">Pull request</div>
      <div class="pad">
        <b class="big">Add video stage</b>
        <span class="row"><span class="merged">Merged</span><span class="small">EDITH review</span></span>
        <span class="small">✓ check-types</span>
        <span class="small">✓ build</span>
        <span class="row"><AgentAvatar id="JARVIS" size={24} /><AgentAvatar id="FRIDAY" size={24} /><AgentAvatar id="EDITH" size={24} /></span>
      </div>
    </div>
  {:else}
    <div class="phone">
      <span class="small">Today</span>
      <b class="big">6 follow-ups</b>
      <div class="meter"><span style:width="64%"></span></div>
      <span class="small">64% of monthly target</span>
      <div class="lead"><span>Prospect visit</span><em>09:30</em></div>
      <div class="lead"><span>Call back</span><em>13:00</em></div>
    </div>
  {/if}
</div>

<style>
  .cover {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 420 / 300;
    padding: 28px 40px 0;
    overflow: hidden;
    border-radius: inherit;
    background:
      radial-gradient(120% 90% at 85% 10%, color-mix(in srgb, var(--glow) calc(var(--glow-opacity) * 200%), transparent), transparent 70%),
      color-mix(in srgb, var(--glow) calc(var(--glow-opacity) * 100%), var(--surface-cover));
  }
  .detail { aspect-ratio: 580 / 280; padding: 48px 56px 0; }
  .label {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    background: var(--surface-default);
    font: 10px/1.6 var(--font-mono);
    color: var(--fg-secondary);
    z-index: 1;
  }
  .device, .phone {
    align-self: end;
    width: 100%;
    display: grid;
    gap: 6px;
    padding: 10px;
    border-radius: 10px 10px 0 0;
    background: var(--surface-default);
    box-shadow: var(--shadow-device);
    font-size: 10px;
    color: var(--fg-default);
    min-height: 82%;
    align-content: start;
  }
  .phone { width: 52%; border-radius: 16px 16px 0 0; padding: 14px; }
  .dots { display: flex; gap: 4px; }
  .dots i { width: 5px; height: 5px; border-radius: 50%; background: var(--line-soft); }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .stats div { display: grid; gap: 2px; padding: 6px; border-radius: 6px; background: var(--blue-subtle); }
  .stats span { font-size: 8px; color: var(--fg-muted); }
  .stats b { font-size: 12px; font-weight: 600; }
  .lead, .step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 4px 2px;
    border-bottom: 1px solid var(--border-default);
  }
  .lead em, .step em {
    font-style: normal;
    font-size: 8px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--blue-subtle);
    color: var(--blue-text);
  }
  .step { justify-content: flex-start; padding: 6px 4px; border: 0; font-size: 11px; }
  .step em { margin-left: auto; background: none; color: var(--fg-muted); font-family: var(--font-mono); }
  .step.active { border-radius: 6px; background: var(--ci-subtle); }
  .tick { color: var(--ci-text); }
  .spin {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid var(--ci-text);
    border-right-color: transparent;
  }
  .bar { display: flex; align-items: center; gap: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--border-default); color: var(--fg-muted); }
  .pad { display: grid; gap: 6px; justify-items: start; padding: 4px 2px; }
  .big { font-size: 13px; font-weight: 600; }
  .small { font-size: 9px; color: var(--fg-muted); }
  .live { padding: 1px 8px; border-radius: 999px; background: var(--ci-subtle); color: var(--ci-text); font-size: 9px; }
  .merged { padding: 1px 8px; border-radius: 999px; background: var(--stage-accent-merged); color: var(--stage-on-merged); font-size: 9px; }
  .row { display: flex; gap: 6px; align-items: center; }
  .term {
    display: grid;
    gap: 2px;
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    background: var(--stage-terminal-bg);
    color: var(--stage-terminal-muted);
    font: 9px/1.5 var(--font-mono);
  }
  .ok { color: var(--stage-terminal-ok); }
  .meter { height: 6px; border-radius: 3px; background: var(--surface-muted); overflow: hidden; }
  .meter span { display: block; height: 100%; background: var(--orange-text); }
  .detail .device { font-size: 12px; min-height: 86%; }
  @media (max-width: 767.98px) {
    .detail { aspect-ratio: auto; min-height: 220px; padding: 44px 20px 0; }
    .detail .device { min-height: 170px; }
  }
</style>
