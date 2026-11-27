<script lang="ts">
  import { sceneText } from "#lib/content/site.ts";
  import AgentAvatar from "../AgentAvatar.svelte";
  import Logo from "../Logo.svelte";

  // One shot of the video stage (Figma scenes 204:14062–14877). Text inside is data, not UI chrome.
  let { slide, shot }: { slide: number; shot: number } = $props();

  const workers = ["FRIDAY", "EDITH", "ULTRON", "KAREN"] as const;
  const workerTask: Record<(typeof workers)[number], string> = {
    FRIDAY: "build VideoStage",
    EDITH: "UI review · E2E",
    ULTRON: "code review",
    KAREN: "docs",
  };
</script>

{#if slide === 0}
  {#if shot === 0}
    <div class="win">
      <header class="bar">Issue · Open</header>
      <div class="body">
        <span class="pill open">Open</span>
        <p class="title">Add video stage to the home page</p>
        <p class="text">{sceneText("issueBody")}</p>
        <div class="row"><span class="chip">design</span><span class="chip">home</span></div>
        <div class="row"><AgentAvatar id="JARVIS" size={24} active /> <span class="text">{sceneText("assigned")}</span></div>
      </div>
    </div>
  {:else if shot === 1}
    <div class="win">
      <header class="bar"><AgentAvatar id="JARVIS" size={24} /> JARVIS · plan</header>
      <div class="body mono">
        <p class="line"><span class="muted">1</span> delegate_task <span class="accent">→ FRIDAY</span> build VideoStage.svelte</p>
        <p class="line"><span class="muted">2</span> delegate_task <span class="accent">→ EDITH</span> UI review</p>
        <p class="line"><span class="muted">3</span> delegate_task <span class="accent">→ ULTRON</span> code review</p>
        <p class="line"><span class="muted">4</span> fleet check, then ask for approval</p>
      </div>
    </div>
  {:else if shot === 2}
    <div class="win">
      <header class="bar mono">src/lib/components/VideoStage.svelte</header>
      <div class="body mono code">
        <p class="line add">+ let slide = $state(0);</p>
        <p class="line add">+ let paused = $state(false);</p>
        <p class="line add">+ const running = $derived(!paused &amp;&amp; visible);</p>
        <p class="line">&nbsp; &lt;section aria-label="Showcase"&gt;</p>
      </div>
      <div class="review"><AgentAvatar id="EDITH" size={24} /> <span><b>EDITH</b> · UI review: pause on hover works, focus ring visible.</span></div>
    </div>
  {:else}
    <div class="win">
      <header class="bar">Pull request</header>
      <div class="body">
        <p class="title">Add video stage to the home page</p>
        <div class="row"><span class="pill merged">{sceneText("merged")}</span><span class="text">JARVIS → main</span></div>
        <ul class="checks">
          <li><span class="ok">✓</span> check-types {sceneText("passed")}</li>
          <li><span class="ok">✓</span> build {sceneText("passed")}</li>
        </ul>
      </div>
    </div>
  {/if}
{:else if slide === 1}
  {#if shot === 0}
    <div class="win">
      <header class="bar">CI · check-types</header>
      <div class="body">
        <div class="row"><span class="pill fail">✕ {sceneText("failed")}</span><span class="text">push to main · 12s</span></div>
        <div class="term"><p>$ bun run check-types</p><p class="err">VideoStage.svelte:14 Type 'null' is not assignable</p></div>
      </div>
    </div>
  {:else if shot === 1}
    <div class="win">
      <header class="bar"><AgentAvatar id="FRIDAY" size={24} active /> FRIDAY</header>
      <div class="body">
        <p class="title mono">fix: types in VideoStage</p>
        <div class="term"><p>$ bun run check-types</p><p class="okline">✓ 0 errors</p></div>
      </div>
    </div>
  {:else if shot === 2}
    <div class="win">
      <header class="bar">CI · main</header>
      <div class="body">
        <div class="row"><span class="pill pass">✓ {sceneText("allPassed")}</span></div>
        <ul class="checks">
          <li><span class="ok">✓</span> lint</li>
          <li><span class="ok">✓</span> check-types</li>
          <li><span class="ok">✓</span> tests</li>
          <li><span class="ok">✓</span> docker build</li>
        </ul>
      </div>
    </div>
  {:else}
    <div class="win">
      <header class="bar"><Logo name="easypanel" size={14} /> EasyPanel · App Service</header>
      <div class="body">
        <p class="title">{sceneText("deployed")}</p>
        <div class="row"><span class="pill pass">● Live</span></div>
        <div class="term"><p class="muted">Starting container</p><p class="okline">GET /health 200</p></div>
      </div>
    </div>
  {/if}
{:else}
  {#if shot === 0}
    <div class="win">
      <header class="bar"><AgentAvatar id="JARVIS" size={24} active /> JARVIS</header>
      <div class="body">
        <p class="title">{sceneText("parallel")}</p>
        <ul class="checks">
          {#each workers as w (w)}<li><span class="muted">○</span> {w} · {workerTask[w]}</li>{/each}
        </ul>
      </div>
    </div>
  {:else if shot === 1 || shot === 2}
    <div class="grid4">
      {#each workers as w, i (w)}
        <div class="panel" style:--i={[0, 60, 100, 130][i]}>
          <div class="row"><AgentAvatar id={w} size={24} active={shot === 1} /><b>{w}</b></div>
          <p class="text">{workerTask[w]}</p>
          <span class={shot === 1 ? "pill running" : "pill pass"}>{shot === 1 ? sceneText("running") : `✓ ${sceneText("done")}`}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div class="win">
      <div class="term big"><p>$ fleet check <span class="okline">✓</span></p><p class="muted">lint · types · tests · build</p></div>
      <div class="body">
        <p class="title">{sceneText("ready")}</p>
      </div>
    </div>
  {/if}
{/if}

<style>
  .win {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 12px;
    background: var(--surface-default);
    box-shadow: var(--shadow-device);
    overflow: hidden;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-default);
    font-size: 13px;
    color: var(--fg-secondary);
  }
  .body {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 24px;
  }
  .title { margin: 0; font-size: clamp(17px, 2.2vw, 22px); font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; }
  .text { margin: 0; font-size: 14px; line-height: 1.5; color: var(--fg-secondary); }
  .row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  .mono, .term, .code { font-family: var(--font-mono); font-variant-ligatures: none; }
  .line { margin: 0; font-size: 13px; line-height: 1.6; color: var(--fg-secondary); overflow-wrap: anywhere; }
  .code .line { padding: 0 6px; border-radius: 4px; }
  .add { background: var(--stage-diff-add); color: var(--fg-default); }
  .muted { color: var(--fg-faint); }
  .accent { color: var(--accent); }
  .chip {
    padding: 2px 10px;
    border-radius: var(--radius-pill);
    background: var(--surface-muted);
    font-size: 12px;
    color: var(--fg-secondary);
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 500;
  }
  .open, .pass { background: var(--ci-subtle); color: var(--ci-text); }
  .merged { background: var(--stage-accent-merged); color: var(--stage-on-merged); }
  .fail { background: var(--stage-tint-fail); color: var(--stage-accent-fail); }
  .running { background: var(--stage-tint-claude); color: var(--stage-accent-claude-text); }
  .checks { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; font-size: 14px; color: var(--fg-secondary); }
  .ok, .okline { color: var(--stage-terminal-ok); }
  .checks .ok { color: var(--ci-text); }
  .term {
    padding: 14px 16px;
    border-radius: 8px;
    background: var(--stage-terminal-bg);
    color: var(--stage-terminal-fg);
    font-size: 12px;
    line-height: 1.7;
  }
  .term p { margin: 0; overflow-wrap: anywhere; }
  .term .muted { color: var(--stage-terminal-muted); }
  .term.big { margin: 24px 24px 0; font-size: 14px; }
  .err { color: var(--stage-accent-fail); }
  :global(.dark) .err { color: #ff8e88; }
  .review {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin: 0 24px 24px;
    padding: 12px;
    border-radius: 8px;
    background: var(--surface-muted);
    font-size: 13px;
    line-height: 1.5;
    color: var(--fg-secondary);
  }
  .grid4 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    height: 100%;
    align-content: center;
  }
  .panel {
    display: grid;
    gap: 10px;
    align-content: start;
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-default);
    box-shadow: var(--shadow-device);
    font-size: 14px;
    animation: panel-in 240ms var(--ease-out) both;
    animation-delay: calc(var(--i) * 1ms);
  }
  .panel .pill { justify-self: start; }
  @keyframes panel-in {
    from { opacity: 0; translate: 0 8px; }
  }
  @media (max-width: 767.98px) {
    .body { padding: 18px; gap: 12px; }
    .grid4 { grid-template-columns: 1fr; gap: 8px; }
    .panel { padding: 12px; gap: 6px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .panel { animation: none; }
  }
</style>
