<script lang="ts">
  import { tick } from "svelte";
  import { PERSON, SOCIALS } from "#lib/content/site.ts";
  import CopyButton from "./CopyButton.svelte";
  import EmailMeButton from "./EmailMeButton.svelte";
  import Icon, { type IconName } from "./Icon.svelte";
  import StatusDot from "./StatusDot.svelte";

  const GLYPH: Record<(typeof SOCIALS)[number]["label"], IconName> = {
    GitHub: "github",
    LinkedIn: "linkedin",
    Threads: "threads",
    Instagram: "instagram",
  };
  // pill items: mail, 4 socials, open arrow. Shrinking gaps read as a wave; the arrow lands with the last icon.
  const STAGGER = ["0ms", "40ms", "75ms", "105ms", "135ms", "135ms"];

  let open = $state(false);
  let hovered = $state(false);
  let focused = $state(false);
  const peek = $derived((hovered || focused) && !open);
  let trigger = $state<HTMLButtonElement>();
  let root = $state<HTMLDivElement>();
  let emailEl = $state<HTMLElement>();
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => () => clearTimeout(leaveTimer));

  // the trigger stays visibility:hidden until the DOM drops data-open, so focus after the update
  async function close(returnFocus = true) {
    open = false;
    // a fresh pointerenter or keyboard focus brings the pill back, not the pointer resting where the card was
    hovered = false;
    focused = false;
    if (!returnFocus) return;
    await tick();
    trigger?.focus();
  }

  // the open card covers the trigger, so focus moves into it (Email me) and back on close
  async function show() {
    open = true;
    await tick();
    root?.querySelector<HTMLElement>(".card button")?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key !== "Escape") return;
    if (open) close(!!root?.contains(document.activeElement));
    else hovered = focused = false;
  }

  function onpointerdown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) close(false);
  }

  // mouse only: touch taps go straight to the card
  function onpointerenter(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(leaveTimer);
    hovered = true;
  }
  function onpointerleave(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    // grace so a diagonal move toward the far end of the pill doesn't drop it
    leaveTimer = setTimeout(() => (hovered = false), 120);
  }
  // keyboard focus shows the pill; a tap that focuses the trigger does not
  function onfocusin(e: FocusEvent) {
    if ((e.target as Element).matches(":focus-visible")) focused = true;
  }
  function onfocusout(e: FocusEvent) {
    if (!root?.contains(e.relatedTarget as Node)) focused = false;
  }
</script>

<svelte:window {onkeydown} />
<svelte:document {onpointerdown} />

<div class="floating-profile" bind:this={root} {onpointerenter} {onpointerleave} {onfocusin} {onfocusout} role="presentation">
  <div
    class="card"
    id="profile-card"
    data-open={open}
    data-peek={peek}
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
            <a href={s.href} target="_blank" rel="noopener noreferrer" class="icon-link" title={s.label}>
              <Icon name={GLYPH[s.label]} />
              <span class="sr-only">{s.label} (opens in a new tab)</span>
            </a>
          </li>
        {/each}
      </ul>
      <button type="button" class="close icon-link hit-44" aria-label="Close profile" onclick={() => close()}>
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

  <ul class="pill" data-open={peek} aria-label="Quick links">
    <li style:--delay={STAGGER[0]}>
      <a href="mailto:{PERSON.email}" class="icon-link" title="Email">
        <Icon name="mail" />
        <span class="sr-only">Email</span>
      </a>
    </li>
    {#each SOCIALS as s, i (s.label)}
      <li style:--delay={STAGGER[i + 1]}>
        <a href={s.href} target="_blank" rel="noopener noreferrer" class="icon-link" title={s.label}>
          <Icon name={GLYPH[s.label]} />
          <span class="sr-only">{s.label} (opens in a new tab)</span>
        </a>
      </li>
    {/each}
    <li style:--delay={STAGGER[5]}>
      <button
        type="button"
        class="icon-link"
        aria-label="Open profile card"
        title="Open profile card"
        aria-expanded={open}
        aria-controls="profile-card"
        onclick={show}
      >
        <Icon name="arrow-up-right" />
      </button>
    </li>
  </ul>
</div>

<style>
  .floating-profile {
    position: fixed;
    left: calc(16px + env(safe-area-inset-left));
    bottom: calc(16px + env(safe-area-inset-bottom));
    z-index: 40;
    width: 48px;
    height: 48px;
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
    z-index: 1;
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

  .icon-link {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--fg-secondary);
    text-decoration: none;
    transition: background-color var(--dur-hover) var(--ease-out), color var(--dur-hover) var(--ease-out),
      scale var(--dur-release) var(--ease-out);
  }
  .icon-link:active { scale: 0.96; transition-duration: var(--dur-press); }

  /* Hover pill: tucked behind the avatar (left edge at its centre), so it slides out from it and the
     pointer never crosses a gap between avatar and pill. Exits as one object, faster, no reverse stagger. */
  .pill {
    position: absolute;
    left: 24px;
    top: 4px;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 2px;
    margin: 0;
    padding: 0 5px 0 31px;
    list-style: none;
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    background: var(--surface-default);
    box-shadow: var(--shadow-profile);
    transform-origin: left center;
    opacity: 0;
    translate: -12px 0;
    scale: 0.92;
    visibility: hidden;
    transition: opacity var(--dur-menu-out) var(--ease-out), translate var(--dur-menu-out) var(--ease-out),
      scale var(--dur-menu-out) var(--ease-out), visibility 0s linear var(--dur-menu-out);
  }
  .pill[data-open="true"] {
    opacity: 1;
    translate: 0 0;
    scale: 1;
    visibility: visible;
    transition: opacity var(--dur-card) var(--ease-out), translate var(--dur-card) var(--ease-out),
      scale var(--dur-card) var(--ease-out), visibility 0s;
  }
  /* items stay visible while the pill fades out, then reset for the next stagger */
  .pill li {
    opacity: 0;
    translate: -6px 0;
    transition: opacity 0s linear var(--dur-menu-out), translate 0s linear var(--dur-menu-out);
  }
  .pill[data-open="true"] li {
    opacity: 1;
    translate: 0 0;
    transition: opacity var(--dur-press) var(--ease-out) var(--delay),
      translate var(--dur-press) var(--ease-out) var(--delay);
  }

  .card {
    position: absolute;
    z-index: 2;
    left: 0;
    bottom: 0;
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
    transition: opacity var(--dur-menu-in) var(--ease-out), scale var(--dur-menu-in) var(--ease-out), visibility 0s;
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
  .socials { display: flex; gap: 2px; margin: 0; padding: 0; list-style: none; }
  /* Dock morph: while the pill shows, the closed card's icon row waits exactly over the pill's
     social icons, so on open the row glides down-left into the dock while the pill fades under the
     growing card. Pill GitHub sits 86px in and 24px up; the dock's 17px in and 31px up, inside a card
     at scale 0.96: x = 86 / 0.96 - 17, y = 31 - 24 / 0.96. */
  .card[data-peek="true"] .socials { translate: 72.6px 6px; }
  .card[data-open="true"] .socials { transition: translate var(--dur-menu-in) var(--ease-out); }
  .close { color: var(--fg-muted); }

  @media (hover: hover) and (pointer: fine) {
    .icon-link:hover { background: var(--surface-muted); color: var(--fg-default); }
  }
  @media (prefers-reduced-motion: reduce) {
    .card, .card[data-open="true"], .pill, .pill[data-open="true"] { scale: 1; translate: none; }
    .trigger:active, .icon-link:active { scale: 1; }
    .pill li, .pill[data-open="true"] li { translate: none; }
    .pill[data-open="true"] li { transition-delay: 0s; }
    .card .socials, .card[data-peek="true"] .socials { translate: none; }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
