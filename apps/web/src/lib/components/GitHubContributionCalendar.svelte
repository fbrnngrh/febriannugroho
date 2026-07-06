<script lang="ts">
  import defaultData from "$lib/data/github-contributions.json";

  let { data = defaultData } = $props<{
    data?: typeof defaultData;
  }>();

  // Selected year state (defaults to rolling last year)
  let selectedYear = $state<string>("lastYear");

  // Get available years from data (excluding 'lastYear') sorted in descending order
  let years = $derived(
    Object.keys(data)
      .filter((k) => k !== "lastYear")
      .sort((a, b) => b.localeCompare(a))
  );

  // Active calendar data based on selection
  let activeData = $derived((data as any)[selectedYear] || (data as any)["lastYear"]);

  // Bind element to auto-scroll
  let scrollContainer = $state<HTMLDivElement | null>(null);

  // Auto-scroll to the far right on mount or when selectedYear changes
  $effect(() => {
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    }
  });

  // Helper to format date for tooltips
  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Determine contribution level (0 to 4)
  function getLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  }

  // Helper to check if we should show a month label
  function shouldShowMonthLabel(week: any, index: number): boolean {
    if (index === 0) return true;
    const prevWeek = activeData.weeks[index - 1];
    if (!prevWeek || !prevWeek.contributionDays[0] || !week.contributionDays[0]) return false;

    const currentMonth = new Date(week.contributionDays[0].date).getMonth();
    const prevMonth = new Date(prevWeek.contributionDays[0].date).getMonth();
    return currentMonth !== prevMonth;
  }

  // Helper to get month name for a week's first day
  function getMonthName(dateStr: string): string {
    return new Date(dateStr).toLocaleString("en-US", { month: "short" });
  }
</script>

<div class="github-calendar-container select-none space-y-4">
  <!-- Header row: Title on left, Year selectors on right -->
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
    <div class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
      <span class="text-accent text-sm font-bold">{activeData.totalContributions}</span> contributions 
      {#if selectedYear === "lastYear"}
        in the last year
      {:else}
        in {selectedYear}
      {/if}
    </div>
    
    <!-- Year selectors (horizontal scrollable row) -->
    <div class="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 max-w-full">
      <button
        onclick={() => selectedYear = "lastYear"}
        class="px-2.5 py-1 text-[11px] rounded-md transition-colors cursor-pointer whitespace-nowrap {selectedYear === 'lastYear' ? 'bg-accent/15 text-accent font-semibold' : 'text-muted hover:text-fg hover:bg-secondary/50'}"
      >
        Last Year
      </button>
      {#each years as y}
        <button
          onclick={() => selectedYear = y}
          class="px-2.5 py-1 text-[11px] rounded-md transition-colors cursor-pointer whitespace-nowrap {selectedYear === y ? 'bg-accent/15 text-accent font-semibold' : 'text-muted hover:text-fg hover:bg-secondary/50'}"
        >
          {y}
        </button>
      {/each}
    </div>
  </div>

  <!-- Main calendar layout (Day labels on left, Scrollable Grid on right) -->
  <div class="grid grid-cols-[auto_1fr] gap-2 items-start">
    <!-- Day labels (Mon, Wed, Fri) aligned pixel-perfectly to the 88px tall grid -->
    <div class="grid grid-rows-7 h-[88px] mt-[18px] text-[10px] text-muted items-center pr-1.5 font-medium leading-[11px] select-none">
      <span></span>
      <span>Mon</span>
      <span></span>
      <span>Wed</span>
      <span></span>
      <span>Fri</span>
      <span></span>
    </div>

    <!-- Scrollable container for both Months and Grid -->
    <div 
      bind:this={scrollContainer}
      class="overflow-x-auto pb-2 scroll-container scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
    >
      <div class="flex flex-col gap-1.5 min-w-[620px] relative">
        <!-- Month labels row (inside scroll container so it scrolls together!) -->
        <div class="relative h-3 text-[9px] text-muted font-medium w-full">
          {#each activeData.weeks as week, i}
            {#if shouldShowMonthLabel(week, i)}
              <span class="absolute" style="left: {i * 13}px">
                {getMonthName(week.contributionDays[0].date)}
              </span>
            {/if}
          {/each}
        </div>

        <!-- Calendar Grid -->
        <div class="flex gap-[3px]">
          {#each activeData.weeks as week}
            <div class="flex flex-col gap-[3px] shrink-0">
              {#each week.contributionDays as day}
                {@const level = getLevel(day.contributionCount)}
                <div
                  class="h-2.5 w-2.5 rounded-[1.5px] contrib-day contrib-level-{level} transition-all duration-150 hover:scale-125"
                  title="{day.contributionCount} contributions on {formatDate(day.date)}"
                  aria-label="{day.contributionCount} contributions on {formatDate(day.date)}"
                ></div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="flex items-center justify-end gap-1.5 text-[9px] text-muted pt-1">
    <span>Less</span>
    <div class="h-2 w-2 rounded-[1px] contrib-level-0"></div>
    <div class="h-2 w-2 rounded-[1px] contrib-level-1"></div>
    <div class="h-2 w-2 rounded-[1px] contrib-level-2"></div>
    <div class="h-2 w-2 rounded-[1px] contrib-level-3"></div>
    <div class="h-2 w-2 rounded-[1px] contrib-level-4"></div>
    <span>More</span>
  </div>
</div>

<style>
  /* OKLCH Blue colors for contribution levels */
  .contrib-day {
    background-color: var(--color-bg-level-0);
    outline: 1px solid var(--color-border-level);
  }

  .contrib-level-0 {
    background-color: var(--color-bg-level-0);
  }
  .contrib-level-1 {
    background-color: var(--color-bg-level-1);
  }
  .contrib-level-2 {
    background-color: var(--color-bg-level-2);
  }
  .contrib-level-3 {
    background-color: var(--color-bg-level-3);
  }
  .contrib-level-4 {
    background-color: var(--color-bg-level-4);
  }

  :global(:root) {
    --color-bg-level-0: oklch(0.96 0 0); /* light gray */
    --color-bg-level-1: oklch(0.92 0.04 240);
    --color-bg-level-2: oklch(0.82 0.08 240);
    --color-bg-level-3: oklch(0.72 0.13 240);
    --color-bg-level-4: oklch(0.55 0.18 240);
    --color-border-level: oklch(0 0 0 / 0.03);
  }

  :global(.dark) {
    --color-bg-level-0: oklch(0.33 0 0); /* dark secondary gray */
    --color-bg-level-1: oklch(0.42 0.05 240);
    --color-bg-level-2: oklch(0.55 0.09 240);
    --color-bg-level-3: oklch(0.68 0.13 240);
    --color-bg-level-4: oklch(0.82 0.11 240);
    --color-border-level: oklch(1 0 0 / 0.05);
  }

  /* Hide scrollbar utility class */
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
