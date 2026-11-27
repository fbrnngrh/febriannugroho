<script lang="ts">
  import BackLink from "#lib/components/BackLink.svelte";
  import ContactBlock from "#lib/components/ContactBlock.svelte";
  import { PERSON } from "#lib/content/site.ts";

  // Kept until Febrian decides (handoff §4.3): delete this route or redirect to /#contact.
  // Same content as the Contact section on Home, plus the existing mailto composer.
  let name = $state("");
  let email = $state("");
  let message = $state("");
  let status = $state("");

  function compose(e: SubmitEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[Contact] ${name}`);
    const body = encodeURIComponent(`Hi Febrian,\n\n${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${PERSON.email}?subject=${subject}&body=${body}`;
    status = "Mail app opened. If nothing happened, email the address above.";
  }
</script>

<svelte:head>
  <title>Contact · Febrian Bayu Nugroho</title>
  <meta name="description" content="The fastest way to reach Febrian Bayu Nugroho is email." />
</svelte:head>

<div class="page col-text">
  <BackLink href="/" label="Home" />
  <ContactBlock headingLevel={1} />

  <form class="form" onsubmit={compose} aria-labelledby="compose-h">
    <h2 id="compose-h" class="label-mono">Or write it here</h2>
    <label>
      <span>Your name</span>
      <input bind:value={name} name="name" autocomplete="name" required />
    </label>
    <label>
      <span>Your email</span>
      <input bind:value={email} name="email" type="email" autocomplete="email" required />
    </label>
    <label>
      <span>Message</span>
      <textarea bind:value={message} name="message" rows="5" required></textarea>
    </label>
    <button type="submit" class="submit">Open in mail app</button>
    <p class="status" role="status">{status}</p>
  </form>
</div>

<style>
  .page { display: grid; gap: 40px; justify-items: start; padding-top: 160px; }
  .form { display: grid; gap: 16px; width: 100%; }
  h2 { margin: 0; font-weight: 400; }
  label { display: grid; gap: 6px; font-size: 13px; color: var(--fg-secondary); }
  input, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-button);
    background: var(--surface-default);
    color: var(--fg-default);
    font: 16px/1.5 var(--font-sans); /* 16px: no iOS zoom on focus */
    transition: border-color var(--dur-hover) var(--ease-out);
  }
  input:focus-visible, textarea:focus-visible { border-color: var(--fg-default); outline-offset: 1px; }
  textarea { resize: vertical; }
  .submit {
    justify-self: start;
    height: 40px;
    padding: 0 16px;
    border: 1px solid transparent;
    border-radius: var(--radius-email);
    background: var(--surface-inverse);
    color: var(--fg-on-inverse);
    font: 500 14px/1 var(--font-sans);
    transition: scale var(--dur-release) var(--ease-out);
  }
  .submit:active { scale: 0.96; transition-duration: var(--dur-press); }
  .status { margin: 0; min-height: 1.4em; font-size: 13px; color: var(--fg-muted); }
  @media (max-width: 767.98px) {
    .page { padding-top: 64px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .submit:active { scale: 1; }
  }
</style>
