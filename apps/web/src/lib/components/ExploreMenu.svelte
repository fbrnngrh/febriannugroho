<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { NAV, PERSON } from "#lib/content/site.ts";
  import { scrollToElement } from "#lib/motion.ts";
  import { closeOverlay, openOverlay } from "#lib/overlay.ts";
  import StatusDot from "./StatusDot.svelte";

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  const open = $derived(!!page.state.explore);

  // page.state is the single source: back button, Esc and Close all flow through it
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) {
      dialog.close();
      // Safari never focuses a clicked button, so close() alone may leave focus on <body> (03 §3)
      trigger?.focus();
    }
  });

  function oncancel(e: Event) {
    e.preventDefault();
    closeOverlay("explore");
  }

  async function choose(e: MouseEvent, href: string) {
    if (href.startsWith("mailto:")) {
      closeOverlay("explore");
      return;
    }
    e.preventDefault();
    const hash = href.split("#")[1];
    const onHome = page.url.pathname === "/";
    if (hash && onHome) {
      await closeOverlay("explore");
      const el = document.getElementById(hash);
      if (el)
        setTimeout(() => {
          scrollToElement(el);
          el.tabIndex = -1;
          el.focus({ preventScroll: true });
        }, 160);
      return;
    }
    // replace the shallow "menu open" entry so back doesn't land on a closed-menu duplicate
    await goto(href, { replace: true });
  }
</script>

<button
  type="button"
  class="explore-button"
  bind:this={trigger}
  aria-expanded={open}
  aria-controls="explore-menu"
  onclick={() => openOverlay({ explore: true })}
>
  Explore
</button>

<dialog id="explore-menu" class="explore lock-scroll" bind:this={dialog} {oncancel} aria-label="Explore">
  <div class="panel">
    <button type="button" class="explore-button close" onclick={() => closeOverlay("explore")}>Close</button>
    <nav aria-label="Main">
      <ul>
        {#each NAV as item, i (item.key)}
          <li>
            <!-- svelte-ignore a11y_autofocus -->
            <a href={item.href} autofocus={i === 0} onclick={(e) => choose(e, item.href)}>{item.label}</a>
          </li>
        {/each}
      </ul>
    </nav>
    <div class="meta">
      <StatusDot />
      <a class="mail" href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
    </div>
  </div>
</dialog>

<style>
  .explore-button {
    position: fixed;
    top: calc(16px + env(safe-area-inset-top));
    right: calc(16px + env(safe-area-inset-right));
    z-index: 45;
    height: 35px;
    min-width: 81px;
    padding: 0 18px;
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    background: var(--surface-default);
    box-shadow: var(--shadow-button);
    color: var(--fg-default);
    font: 500 14px/1 var(--font-sans);
    view-transition-name: explore-button;
    transition: scale var(--dur-release) var(--ease-out);
    isolation: isolate;
  }
  .explore-button::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--fg-default);
    opacity: 0;
    transition: opacity var(--dur-press) var(--ease-out);
    z-index: -1;
  }
  /* 44 px touch target around a 35 px pill */
  .explore-button::after {
    content: "";
    position: absolute;
    inset: -5px -2px;
  }
  .explore-button:active { scale: 0.96; transition-duration: var(--dur-press); }
  .explore-button:active::before { opacity: 0.06; }
  .close { view-transition-name: none; }
  @media (min-width: 768px) {
    .explore-button:not(.close) { display: none; }
  }

  dialog.explore {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--bg-page);
    color: var(--fg-default);
    opacity: 0;
    transition: opacity var(--dur-menu-out) var(--ease-out), overlay var(--dur-menu-out) allow-discrete,
      display var(--dur-menu-out) allow-discrete;
  }
  dialog.explore[open] { opacity: 1; transition-duration: var(--dur-menu-in); }
  @starting-style { dialog.explore[open] { opacity: 0; } }
  dialog.explore::backdrop { background: transparent; }
  .panel {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: calc(96px + env(safe-area-inset-top)) 24px calc(32px + env(safe-area-inset-bottom));
    translate: 0 8px;
    transition: translate var(--dur-menu-out) var(--ease-out);
  }
  dialog.explore[open] .panel { translate: 0 0; transition-duration: var(--dur-menu-in); }
  @starting-style { dialog.explore[open] .panel { translate: 0 8px; } }
  ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
  ul a {
    display: inline-block;
    font-size: 44px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--fg-default);
    text-decoration: none;
    transition: opacity var(--dur-press) var(--ease-out);
  }
  ul a:active, .mail:active { opacity: 0.64; }
  .meta { margin-top: auto; display: grid; gap: 8px; }
  .mail { font-size: 15px; color: var(--fg-muted); text-decoration: none; }
  @media (prefers-reduced-motion: reduce) {
    .panel, dialog.explore[open] .panel { translate: none; }
    .explore-button:active { scale: 1; }
  }
</style>
