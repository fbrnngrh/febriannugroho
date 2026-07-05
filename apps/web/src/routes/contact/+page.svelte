<script lang="ts">
  import { ArrowLeft, Clock, Copy, Check, Send } from "lucide-svelte";

  // Form composer reactive state
  let name = $state("");
  let email = $state("");
  let subject = $state("Freelance Work");
  let message = $state("");
  let formStatus = $state(""); // "", "opening", "done"

  const subjects = [
    "Freelance Work",
    "Full-time Opportunity",
    "Collaboration",
    "Just Saying Hello",
    "Other"
  ];

  // Direct Email copy state
  let copiedEmail = $state(false);
  function copyEmail() {
    navigator.clipboard.writeText("fbrnngrh@gmail.com").then(() => {
      copiedEmail = true;
      setTimeout(() => copiedEmail = false, 2000);
    });
  }

  // Live Clock (Asia/Makassar for Banjarmasin WITA GMT+8)
  let localTime = $state("");
  $effect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      const formattedTime = new Intl.DateTimeFormat("en-US", options).format(new Date());
      localTime = `${formattedTime} WITA`;
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  // Compose structured email in client
  function handleCompose(e: Event) {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    formStatus = "opening";
    
    const emailTo = "fbrnngrh@gmail.com";
    const emailSubject = encodeURIComponent(`[Contact] ${subject} - ${name}`);
    const emailBody = encodeURIComponent(
      `Hi Febrian,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
    );
    
    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
    
    window.location.href = mailtoUrl;
    
    setTimeout(() => {
      formStatus = "done";
      name = "";
      email = "";
      message = "";
      subject = "Freelance Work";
      
      setTimeout(() => {
        formStatus = "";
      }, 3000);
    }, 1000);
  }
</script>

<svelte:head>
  <title>Contact — Febrian Bayu Nugroho</title>
  <meta
    name="description"
    content="Get in touch with Febrian Bayu Nugroho. Let's build something great together."
  />
</svelte:head>

<div class="space-y-10 reveal">
  <!-- Back Link -->
  <a
    href="/"
    class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>

  <!-- Header Section -->
  <div class="space-y-4">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Get in touch</h1>
      
      <!-- Integrated Status Line (Availability & Location/Clock) -->
      <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
        <div class="flex items-center gap-1.5">
          <span
            class="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-pulse"
            aria-hidden="true"
          ></span>
          <span>Available for work</span>
        </div>
        <span class="hidden sm:inline text-neutral-300 dark:text-neutral-700 font-normal">&bull;</span>
        <div class="flex items-center gap-1.5">
          <span>Banjarmasin, Indonesia (GMT+8)</span>
          {#if localTime}
            <span class="text-neutral-300 dark:text-neutral-700 font-normal">&bull;</span>
            <span class="font-mono text-accent dark:text-accent/90 tabular-nums">{localTime}</span>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Short intro description -->
    <p class="text-base text-muted/95 leading-relaxed max-w-lg">
      Have a freelance project, a full-time role opportunity, or just want to connect? Hit the composer below or email me directly at:
    </p>

    <!-- Email Address with fading copy feedback -->
    <div class="inline-flex items-center gap-2 group/email text-lg sm:text-xl font-medium">
      <a href="mailto:fbrnngrh@gmail.com" class="hover:text-accent transition-colors link-underline">
        fbrnngrh@gmail.com
      </a>
      <button
        onclick={copyEmail}
        class="p-1 rounded-lg hover:bg-secondary/40 text-muted hover:text-fg transition-all duration-200 cursor-pointer"
        title="Copy email to clipboard"
      >
        {#if copiedEmail}
          <Check class="h-4.5 w-4.5 text-green-500" />
        {:else}
          <Copy class="h-4 w-4 opacity-0 group-hover/email:opacity-100 transition-opacity" />
        {/if}
      </button>
    </div>
  </div>

  <hr class="border-border/60" />

  <!-- Form Message Composer -->
  <div class="space-y-6 pt-2">
    <div class="space-y-1">
      <h2 class="text-lg font-bold text-fg">Write a message</h2>
      <p class="text-xs text-muted">
        Fill this form to draft a structured email immediately.
      </p>
    </div>

    <form onsubmit={handleCompose} class="space-y-6">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Name Field -->
        <div class="space-y-1">
          <label for="name" class="text-[10px] font-bold tracking-wider uppercase text-muted">Your Name</label>
          <input
            type="text"
            id="name"
            bind:value={name}
            placeholder="Enter your name"
            required
            class="block w-full py-2 px-0 bg-transparent border-b border-border focus:border-accent text-fg text-sm placeholder:text-muted/50 focus:outline-none transition-colors duration-200 rounded-none"
          />
        </div>

        <!-- Email Field -->
        <div class="space-y-1">
          <label for="email" class="text-[10px] font-bold tracking-wider uppercase text-muted">Your Email</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="you@example.com"
            required
            class="block w-full py-2 px-0 bg-transparent border-b border-border focus:border-accent text-fg text-sm placeholder:text-muted/50 focus:outline-none transition-colors duration-200 rounded-none"
          />
        </div>
      </div>

      <!-- Subject select field -->
      <div class="space-y-1">
        <label for="subject" class="text-[10px] font-bold tracking-wider uppercase text-muted">Subject / Project Type</label>
        <div class="relative">
          <select
            id="subject"
            bind:value={subject}
            class="block w-full py-2 pr-8 pl-0 bg-transparent border-b border-border focus:border-accent text-fg text-sm focus:outline-none appearance-none cursor-pointer transition-colors duration-200 rounded-none"
          >
            {#each subjects as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-muted">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <!-- Message body field -->
      <div class="space-y-1">
        <label for="message" class="text-[10px] font-bold tracking-wider uppercase text-muted">Your Message</label>
        <textarea
          id="message"
          rows="4"
          bind:value={message}
          placeholder="Describe your project details or say hello..."
          required
          class="block w-full py-2 px-0 bg-transparent border-b border-border focus:border-accent text-fg text-sm placeholder:text-muted/50 focus:outline-none transition-colors duration-200 resize-none rounded-none"
        ></textarea>
      </div>

      <!-- Submit Button & Feedback -->
      <div class="space-y-3 pt-2">
        <button
          type="submit"
          disabled={formStatus === "opening"}
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-fg hover:bg-fg/90 disabled:bg-fg/50 text-bg px-6 py-3.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {#if formStatus === "opening"}
            <div class="h-3.5 w-3.5 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
            <span>Opening Client...</span>
          {:else}
            <Send class="h-3.5 w-3.5" />
            <span>Compose Email</span>
          {/if}
        </button>
        
        {#if formStatus === "done"}
          <p class="text-[11px] text-green-600 dark:text-green-400 font-medium animate-[fadeIn_0.3s_ease-out]">
            ✓ Email client opened. Please check your system email app.
          </p>
        {/if}
      </div>
    </form>
  </div>

  <hr class="border-border/60" />

  <!-- Simplified social connect line -->
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
    <span>Connect elsewhere:</span>
    <div class="flex items-center gap-3">
      <a 
        href="https://github.com/fbrnngrh" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="font-medium hover:text-fg transition-colors hover:underline"
      >
        GitHub
      </a>
      <span class="text-neutral-300 dark:text-neutral-700 font-normal">/</span>
      <a 
        href="https://linkedin.com/in/fbrnngrh" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="font-medium hover:text-fg transition-colors hover:underline"
      >
        LinkedIn
      </a>
      <span class="text-neutral-300 dark:text-neutral-700 font-normal">/</span>
      <a 
        href="https://x.com/fbrnngrh" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="font-medium hover:text-fg transition-colors hover:underline"
      >
        X
      </a>
    </div>
  </div>
</div>

<style>
  /* Dropdown option background overrides */
  select option {
    background-color: var(--color-bg);
    color: var(--color-fg);
  }
</style>
