<script lang="ts">
  import { page } from "$app/state";
</script>

<div
  class="flex min-h-[50vh] flex-col items-center justify-center text-center"
>
  <h1 class="text-6xl font-semibold tracking-tight">{page.status}</h1>
  <p class="mt-4 text-muted">{page.error?.message}</p>
  <a
    href="/"
    class="mt-8 link-underline text-muted hover:text-fg inline-block"
  >
    Go back home
  </a>
</div>
