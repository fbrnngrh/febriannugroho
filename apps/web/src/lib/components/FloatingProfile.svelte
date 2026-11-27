<script lang="ts">
  import { tick } from "svelte";
  import { PERSON, SOCIALS } from "#lib/content/site.ts";
  import CopyButton from "./CopyButton.svelte";
  import EmailMeButton from "./EmailMeButton.svelte";
  import Icon from "./Icon.svelte";
  import StatusDot from "./StatusDot.svelte";

  let open = $state(false);
  let trigger = $state<HTMLButtonElement>();
  let root = $state<HTMLDivElement>();
  let emailEl = $state<HTMLElement>();

  function close(returnFocus = true) {
    open = false;
    if (returnFocus) trigger?.focus();
  }

  // the open card covers the trigger, so focus moves into it (Email me) and back on close
  async function show() {
    open = true;
    await tick();
    root?.querySelector<HTMLElement>(".card button")?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") close(!!root?.contains(document.activeElement));
  }

  function onpointerdown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) close(false);
  }
</script>

<svelte:window {onkeydown} />
<svelte:document {onpointerdown} />

<div class="floating-profile" bind:this={root}>
  <div
    class="card"
    id="profile-card"
    data-open={open}
    inert={!open}
    role="region"
    aria-label="Profile"
  >
    <div class="head">
      <img src={PERSON.photo} alt="" width="40" height="40" class="photo" />
      <div>
        <p class="name">{PERSON.name}</p>
        <p class="role">{PERSON.role} · {PERSON.city}</p>
      </div>
    </div>
    <StatusDot />
    <EmailMeButton />
    <div class="email-row">
      <span class="email" bind:this={emailEl}>{PERSON.email}</span>
      <CopyButton value={PERSON.email} selectOnFail={() => emailEl} />
    </div>
    <div class="foot">
      <ul class="socials">
        {#each SOCIALS as s (s.label)}
          <li>
            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label="{s.short}, {s.label} (opens in a new tab)" class="social">{s.short}</a>
          </li>
        {/each}
      </ul>
      <button type="button" class="close hit-44" aria-label="Close profile" onclick={() => close()}>
        <Icon name="close" size={14} />
      </button>
    </div>
  </div>

  <button
    type="button"
    class="trigger"
    bind:this={trigger}
    aria-expanded={open}
    aria-controls="profile-card"
    aria-label={open ? "Close profile" : "Open profile"}
    onclick={() => (open ? close() : show())}
  >
    <img src={PERSON.photo} alt="" width="48" height="48" />
    <span class="online" aria-hidden="true"></span>
  </button>
</div>

<style>
  .floating-profile {
    position: fixed;
    left: calc(16px + env(safe-area-inset-left));
    bottom: calc(16px + env(safe-area-inset-bottom));
    z-index: 40;
    view-transition-name: floating-profile;
  }
  @media (min-width: 768px) {
    .floating-profile {
      left: calc(24px + env(safe-area-inset-left));
      bottom: calc(24px + env(safe-area-inset-bottom));
    }
  }

  .trigger {
    position: relative;
    display: block;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 50%;
    background: var(--surface-default);
    box-shadow: var(--shadow-profile);
    transition: scale var(--dur-release) var(--ease-out);
  }
  .trigger:active { scale: 0.96; transition-duration: var(--dur-press); }
  .trigger img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    outline: 1px solid var(--image-outline);
    outline-offset: -1px;
  }
  .online {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--ci-solid);
    border: 2px solid var(--bg-page);
  }

  .card {
    position: absolute;
    left: 0;
    bottom: calc(100% - 48px);
    width: min(208px + 32px, calc(100vw - 32px));
    display: grid;
    gap: 14px;
    padding: 16px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: var(--surface-default);
    box-shadow: var(--shadow-profile);
    transform-origin: bottom left;
    opacity: 0;
    scale: 0.96;
    visibility: hidden;
    transition: opacity var(--dur-dialog-out) var(--ease-out), scale var(--dur-dialog-out) var(--ease-out),
      visibility 0s linear var(--dur-dialog-out);
  }
  .card[data-open="true"] {
    opacity: 1;
    scale: 1;
    visibility: visible;
    transition: opacity var(--dur-dialog) var(--ease-out), scale var(--dur-dialog) var(--ease-out), visibility 0s;
  }
  /* the card covers the trigger while open; its own × closes it */
  .card[data-open="true"] ~ .trigger { visibility: hidden; }

  .head { display: flex; align-items: center; gap: 10px; }
  .photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    outline: 1px solid var(--image-outline);
    outline-offset: -1px;
  }
  .name { margin: 0; font-size: 14px; font-weight: 500; line-height: 1.4; }
  .role { margin: 0; font-size: 12px; line-height: 1.4; color: var(--fg-muted); }
  .email-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-default);
  }
  .email {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--fg-secondary);
    user-select: all;
    overflow-wrap: anywhere;
  }
  .foot { display: flex; align-items: center; justify-content: space-between; }
  .socials { display: flex; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .social {
    display: grid;
    place-items: center;
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border-radius: var(--radius-button);
    background: var(--surface-muted);
    color: var(--fg-secondary);
    font: 11px/1 var(--font-mono);
    text-decoration: none;
    transition: background-color var(--dur-hover) var(--ease-out), opacity var(--dur-press) var(--ease-out);
  }
  .social:active { opacity: 0.64; }
  .close {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--fg-muted);
    transition: color var(--dur-hover) var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .social:hover { background: var(--surface-placeholder); color: var(--fg-default); }
    .close:hover { color: var(--fg-default); }
  }
  @media (prefers-reduced-motion: reduce) {
    .card, .card[data-open="true"] { scale: 1; }
    .trigger:active { scale: 1; }
  }
</style>
