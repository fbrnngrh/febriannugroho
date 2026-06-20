<script lang="ts">
  let { title, description, href } = $props<{
    title: string;
    description: string;
    href: string;
  }>();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="block rounded-lg border border-border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/50"
>
  <span class="font-medium text-accent">{title}</span>
  <span class="mx-2 text-muted">—</span>
  <span class="text-sm text-muted">{description}</span>
</a>
