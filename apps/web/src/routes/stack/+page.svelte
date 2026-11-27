<script lang="ts">
  import { inview } from "#lib/actions/inview.ts";
  import BackLink from "#lib/components/BackLink.svelte";
  import FleetMap from "#lib/components/fleet/FleetMap.svelte";
  import Logo from "#lib/components/Logo.svelte";
  import { KIT } from "#lib/content/site.ts";
</script>

<svelte:head>
  <title>Stack · Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="My home software factory: agents in T3 Code build, review and ship. I approve the spec and the release."
  />
</svelte:head>

<div class="page">
  <header class="col-text head">
    <div data-reveal use:inview><BackLink href="/" label="Home" /></div>
    <h1 data-reveal use:inview style:--reveal-delay="100ms">Stack</h1>
    <p class="body-text muted" data-reveal use:inview style:--reveal-delay="200ms">
      My home software factory: agents in T3 Code build, review and ship. I approve the spec and the release.
    </p>
  </header>

  <section class="fleet" aria-labelledby="fleet-h">
    <div class="col-text intro" data-reveal="lift" use:inview style:--reveal-duration="400ms">
      <h2 id="fleet-h" class="label-mono">How the fleet works</h2>
      <p class="body-text muted">
        One lead agent delegates, deterministic checks gate every change, and nothing ships without my OK.
      </p>
    </div>
    <div class="col-wide" data-reveal="lift" use:inview style:--reveal-duration="400ms" style:--reveal-delay="100ms">
      <FleetMap />
      <div class="captions">
        <p>Click an agent for its role, skills and a run.</p>
        <p>Roles after T3 Code and Matt Pocock's software factory.</p>
      </div>
    </div>
  </section>

  <section class="col-text kit" aria-labelledby="kit-h">
    <h2 id="kit-h" class="label-mono">Also in the kit</h2>
    <ul>
      {#each KIT as k, i (k.name)}
        <li data-reveal use:inview style:--reveal-delay="{i * 40}ms">
          <span class="tool"><Logo name={k.logo} size={16} />{k.name}</span>
          <span class="note">{k.note}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .page { display: grid; gap: 80px; padding-top: 120px; }
  .head { display: grid; gap: 12px; justify-items: start; }
  h1 { margin: 8px 0 0; font-size: 32px; font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; }
  h2 { margin: 0; font-weight: 400; }
  .head p, .intro p { margin: 0; }
  .muted { color: var(--fg-muted); }
  .fleet { display: grid; gap: 24px; }
  .intro { display: grid; gap: 8px; }
  .captions { display: grid; gap: 4px; margin-top: 16px; font-size: 13px; line-height: 1.4; color: var(--fg-muted); }
  .captions p { margin: 0; }
  .kit { display: grid; gap: 12px; }
  .kit ul { display: grid; margin: 0; padding: 0; list-style: none; }
  .kit li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 6px 0;
    font-size: 15px;
    line-height: 1.4;
  }
  .tool { display: inline-flex; align-items: center; gap: 10px; font-weight: 500; }
  .note { color: var(--fg-muted); text-align: right; }
  @media (max-width: 767.98px) {
    .page { padding-top: 64px; gap: 64px; }
    h1 { font-size: 28px; }
    .kit li { align-items: flex-start; flex-direction: column; gap: 2px; }
    .note { text-align: left; }
  }
</style>
