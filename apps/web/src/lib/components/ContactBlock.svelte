<script lang="ts">
  import { inview } from "#lib/actions/inview.ts";
  import { PERSON, SOCIALS } from "#lib/content/site.ts";
  import CopyButton from "./CopyButton.svelte";
  import EmailMeButton from "./EmailMeButton.svelte";
  import Icon from "./Icon.svelte";
  import LinkPreview from "./LinkPreview.svelte";

  let { headingLevel = 2 }: { headingLevel?: 1 | 2 } = $props();

  let emailEl = $state<HTMLElement>();
  // WITA clock is client-only: prerendered HTML shows no time rather than a wrong one
  let time = $state("");
  $effect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" });
    const tick = () => (time = fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  });
</script>

<div class="contact">
  <svelte:element this={`h${headingLevel}`} class="label-mono heading" data-reveal use:inview>Contact</svelte:element>
  <p class="body-text lead" data-reveal use:inview>The fastest way to reach me is email.</p>
  <div class="email-row" data-reveal use:inview style:--reveal-delay="100ms">
    <a class="email" href="mailto:{PERSON.email}" bind:this={emailEl}>{PERSON.email}</a>
    <EmailMeButton />
    <CopyButton value={PERSON.email} label="Copy email" selectOnFail={() => emailEl} />
  </div>
  <ul class="socials" data-reveal use:inview style:--reveal-delay="200ms">
    {#each SOCIALS as s (s.label)}
      <li>
        {#if "preview" in s}
          <LinkPreview
            href={s.href}
            label={s.label}
            meta={new URL(s.href).hostname.replace(/^www\./, "")}
            image="/images/previews/{s.preview}.webp"
            class="link social"
            external
          >
            {s.label}<Icon name="external" size={14} />
          </LinkPreview>
        {:else}
          <a class="link social" href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}<Icon name="external" size={14} />
            <span class="sr-only">(opens in a new tab)</span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
  <p class="where tabular">{PERSON.location}{#if time}{" · "}<time>{time}</time> WITA{/if}</p>
</div>

<style>
  .contact { display: grid; gap: 16px; justify-items: start; }
  .heading { margin: 0; font-weight: 400; }
  .lead { margin: 0; }
  .email-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
  /* same paper-plane button as the profile card, compacted to the Copy chip: 32 px, 13 px label, 12 px plane */
  .email-row :global(.email-me) {
    width: auto;
    height: 32px;
    gap: 6px;
    padding-inline: 11px 10px;
    border-radius: var(--radius-button);
    font-size: 13px;
    font-weight: 400;
  }
  .email-row :global(.email-me svg) { width: 12px; height: 12px; }
  .email {
    font-size: 17px;
    color: var(--fg-default);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-color: var(--line-soft);
    transition: text-decoration-color var(--dur-hover) var(--ease-out), opacity var(--dur-press) var(--ease-out);
    overflow-wrap: anywhere;
  }
  .email:active { opacity: 0.64; }
  @media (hover: hover) and (pointer: fine) {
    .email:hover { text-decoration-color: currentColor; }
  }
  .socials { display: flex; flex-wrap: wrap; gap: 8px 24px; margin: 0; padding: 0; list-style: none; }
  .socials :global(.social) { display: inline-flex; align-items: center; gap: 4px; font-size: 15px; line-height: 21px; }
  /* 44 px touch target on phones without changing the 21 px line */
  @media (pointer: coarse) {
    .socials :global(.social::before) { content: ""; position: absolute; inset: -12px -6px; }
  }
  .where { margin: 0; font-size: 13px; color: var(--fg-muted); }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
