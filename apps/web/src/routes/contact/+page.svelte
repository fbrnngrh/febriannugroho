<script lang="ts">
  import { ArrowLeft, Mail } from "lucide-svelte";
  import SocialPill from "$lib/components/SocialPill.svelte";

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

  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight">Get in touch</h1>
      <p class="mt-2 text-muted">Let's build something great together.</p>
    </div>

    <!-- Email button -->
    <a
      href="mailto:fbrnngrh@gmail.com"
      class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
    >
      <Mail class="h-4 w-4" />
      fbrnngrh@gmail.com
    </a>

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
</div>

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
</style>
