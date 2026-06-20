<script lang="ts">
  import { ArrowLeft, Send } from "lucide-svelte";
  import { enhance } from "$app/forms";
  import SocialPill from "$lib/components/SocialPill.svelte";
  import type { PageProps } from "./$types";

  let { form }: PageProps = $props();

  let loading = $state(false);
  let toastMessage = $state("");

  function clearToast() {
    setTimeout(() => {
      toastMessage = "";
    }, 5000);
  }

  const socialLinks = [
    { label: "GitHub", href: "https://github.com/", bgColor: "#181717" },
    { label: "LinkedIn", href: "https://linkedin.com/in/", bgColor: "#0A66C2" },
    { label: "X", href: "https://x.com/", bgColor: "#000000" },
  ];
</script>

<svelte:head>
  <title>Contact — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Get in touch with Febrian Bayu Nugroho. Let's build something great together."
  />
</svelte:head>

<div class="space-y-12">
  <!-- Back link -->
  <a
    href="/"
    class="inline-flex items-center gap-1 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <div class="grid gap-12 md:grid-cols-2">
    <!-- Left: Contact Info -->
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Get in touch</h1>
        <p class="mt-2 text-muted">Let's build something great together.</p>
      </div>

      <div>
        <a href="mailto:fbrnngrh@gmail.com" class="text-accent hover:underline">
          fbrnngrh@gmail.com
        </a>
      </div>

      <!-- Availability -->
      <div class="flex items-center gap-2">
        <span
          class="inline-block h-2.5 w-2.5 rounded-full bg-green-500 motion-safe:animate-[pulse_2s_ease-in-out_infinite]"
          aria-hidden="true"
        ></span>
        <span class="text-sm text-muted">
          Currently available for freelance work
        </span>
      </div>

      <!-- Social pills -->
      <div class="flex flex-wrap gap-3">
        {#each socialLinks as link (link.label)}
          <SocialPill
            href={link.href}
            label={link.label}
            bgColor={link.bgColor}
          />
        {/each}
      </div>
    </div>

    <!-- Right: Form -->
    <div>
      <form
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            loading = false;
            if (result.type === "success") {
              toastMessage = "Message sent! I'll get back to you soon.";
              clearToast();
            }
          };
        }}
        class="space-y-4"
      >
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.name ?? ""}
          />
          {#if form?.errors?.name}
            <p class="mt-1 text-sm text-destructive">{form.errors.name[0]}</p>
          {/if}
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.email ?? ""}
          />
          {#if form?.errors?.email}
            <p class="mt-1 text-sm text-destructive">{form.errors.email[0]}</p>
          {/if}
        </div>

        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
            value={form?.values?.subject ?? ""}
          />
          {#if form?.errors?.subject}
            <p class="mt-1 text-sm text-destructive">{form.errors.subject[0]}</p>
          {/if}
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            class="w-full rounded-lg border border-border bg-bg px-3 py-3 text-sm focus:ring-2 focus:ring-accent focus:outline-none transition-shadow resize-y"
          >{form?.values?.message ?? ""}</textarea>
          {#if form?.errors?.message}
            <p class="mt-1 text-sm text-destructive">{form.errors.message[0]}</p>
          {/if}
        </div>

        <!-- DB / Server error -->
        {#if form?.error}
          <p class="text-sm text-destructive">{form.error}</p>
        {/if}

        <!-- Server-rendered success (non-JS fallback) -->
        {#if form?.success}
          <p class="text-sm text-green-500">
            Message sent! I'll get back to you soon.
          </p>
        {/if}

        <!-- Submit -->
        <button
          type="submit"
          disabled={loading}
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {#if loading}
            Sending...
          {:else}
            <Send class="h-4 w-4" />
            Send Message
          {/if}
        </button>
      </form>
    </div>
  </div>
</div>

<!-- Toast -->
{#if toastMessage}
  <div
    class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-6 py-3 text-sm text-bg shadow-lg motion-safe:animate-[fadeIn_0.3s_ease-out]"
  >
    {toastMessage}
  </div>
{/if}

<style>
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.7;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
</style>
