<script lang="ts">
  import { tick } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { PROJECTS, type Project, type ProjectId } from "#lib/content/site.ts";
  import { closeOverlay, isBackdropClick, openOverlay } from "#lib/overlay.ts";
  import { sheetDrag } from "#lib/sheet.ts";
  import ArrowLink from "../ArrowLink.svelte";
  import Icon from "../Icon.svelte";
  import Logo from "../Logo.svelte";
  import WorkCover from "./WorkCover.svelte";

  // Project detail: modal on desktop, sheet on phones (Figma 67:2607 / 67:3226, 213:10640, 213:12031).
  // URL hash /#work/<id> makes it shareable; back closes it.
  let dialog = $state<HTMLDialogElement>();
  let heading = $state<HTMLHeadingElement>();
  let trigger: HTMLElement | null = null;
  let deepLinked = false;

  const id = $derived(page.state.project as ProjectId | undefined);
  const project = $derived(PROJECTS.find((p) => p.id === id && p.detail));
  // keep the last project rendered while the close transition plays
  let shown = $state<Project>();
  $effect(() => {
    if (project) shown = project;
  });

  const TECH_LOGO: Record<string, string> = { Docker: "docker", EasyPanel: "easypanel", Bun: "bun" };

  // trigger passed explicitly: Safari does not focus buttons on click
  export function open(projectId: ProjectId, from?: HTMLElement | null) {
    trigger = from ?? (document.activeElement as HTMLElement | null);
    deepLinked = false;
    openOverlay({ project: projectId }, `work/${projectId}`);
  }

  // shared links: /#work/ci-cd opens the dialog on load
  $effect(() => {
    const m = /^#work\/([\w-]+)$/.exec(window.location.hash);
    if (m && PROJECTS.some((p) => p.id === m[1] && p.detail)) {
      deepLinked = true;
      const url = new URL(window.location.href);
      goto(url.href, { shallow: true, replace: true, state: { project: m[1] }, reset: false });
    }
  });

  $effect(() => {
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      tick().then(() => heading?.focus());
    } else if (!project && dialog.open) {
      dialog.close();
    }
  });

  function close() {
    if (deepLinked) {
      deepLinked = false;
      const url = new URL(page.url.href);
      url.hash = "";
      goto(url.href, { shallow: true, replace: true, state: {}, reset: false });
    } else {
      closeOverlay("project");
    }
  }

  function onclose() {
    // return focus to the card that opened it
    trigger?.focus();
    trigger = null;
  }

  function onclick(e: MouseEvent) {
    if (isBackdropClick(e, dialog)) close();
  }
</script>

<dialog
  class="modal lock-scroll project"
  bind:this={dialog}
  aria-labelledby="project-title"
  oncancel={(e) => {
    e.preventDefault();
    close();
  }}
  {onclose}
  {onclick}
  {@attach sheetDrag(close)}
>
  {#if shown?.detail}
    {@const d = shown.detail}
    <div class="grab" aria-hidden="true"></div>
    <div class="cover"><WorkCover project={shown} variant="detail" /></div>
    <button type="button" class="close icon-button" aria-label="Close" onclick={close}>
      <Icon name="close" size={14} />
    </button>
    <div class="content" data-sheet-scroll>
      <p class="kicker">
        <span class="tag accent" style:--a="var(--{shown.accent}-text)"><span aria-hidden="true">●</span> {d.tag}</span>
        <span class="label-mono">{d.meta}</span>
        {#if d.draft}<span class="label-mono">· draft</span>{/if}
      </p>
      <h2 id="project-title" tabindex="-1" bind:this={heading}>{d.title}</h2>
      <p class="summary">{d.summary}</p>
      <dl class="facts">
        <div><dt class="label-mono">Problem</dt><dd>{d.problem}</dd></div>
        <div><dt class="label-mono">What I built</dt><dd>{d.built}</dd></div>
        <div><dt class="label-mono">Result</dt><dd>{d.result}</dd></div>
      </dl>
      <ul class="tech" aria-label="Technologies">
        {#each d.tech as t (t)}
          <li class="tag">{#if TECH_LOGO[t]}<Logo name={TECH_LOGO[t]} size={12} />{/if}{t}</li>
        {/each}
      </ul>
      {#if d.writeUp}
        <div><ArrowLink href={d.writeUp} label="Read the full write-up" /></div>
      {/if}
    </div>
  {/if}
</dialog>

<style>
  .project { overflow: hidden; display: none; }
  .project[open] { display: flex; flex-direction: column; }
  .grab {
    display: none;
    width: 36px;
    height: 4px;
    margin: 8px auto 0;
    border-radius: 2px;
    background: var(--line-soft);
  }
  .cover {
    flex: none;
    margin: 8px 8px 0;
    border-radius: 16px;
    overflow: hidden;
    touch-action: none;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
    width: 32px;
    height: 32px;
  }
  .close::after { content: ""; position: absolute; inset: -6px; }
  .content {
    display: grid;
    gap: 16px;
    padding: 24px 32px 32px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .kicker { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0; }
  .accent { color: var(--a); background: color-mix(in srgb, var(--a) 12%, transparent); }
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  h2:focus { outline: none; }
  .summary { margin: 0; font-size: 17px; line-height: 1.5; color: var(--fg-muted); }
  .facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    margin: 8px 0 0;
  }
  .facts div { display: grid; gap: 6px; align-content: start; }
  dd { margin: 0; font-size: 15px; line-height: 1.5; }
  .tech { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
  @media (max-width: 767.98px) {
    .grab { display: block; touch-action: none; }
    .cover { margin-top: 12px; }
    .close { top: 28px; right: 16px; width: 44px; height: 44px; border-radius: 22px; }
    .content { padding: 20px 24px 32px; touch-action: pan-y; }
    .facts { grid-template-columns: 1fr; gap: 16px; }
  }
</style>
