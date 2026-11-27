<script lang="ts" module>
  // Hero entrance plays on the first load only, not when coming back through client navigation.
  let heroPlayed = false;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { inview } from "#lib/actions/inview.ts";
  import ArrowLink from "#lib/components/ArrowLink.svelte";
  import ContactBlock from "#lib/components/ContactBlock.svelte";
  import GitHubContributionCalendar from "#lib/components/GitHubContributionCalendar.svelte";
  import LinkPreview from "#lib/components/LinkPreview.svelte";
  import Logo from "#lib/components/Logo.svelte";
  import SiteNav from "#lib/components/SiteNav.svelte";
  import StatusDot from "#lib/components/StatusDot.svelte";
  import VideoStage from "#lib/components/stage/VideoStage.svelte";
  import ProjectDialog from "#lib/components/work/ProjectDialog.svelte";
  import WorkCarousel from "#lib/components/work/WorkCarousel.svelte";
  import WritingFan from "#lib/components/writing/WritingFan.svelte";
  import WritingRow from "#lib/components/writing/WritingRow.svelte";
  import { allPosts, getPost, postHref, shortReadingTime } from "#lib/content/posts.ts";
  import { ABOUT, DECISIONS, PERSON, TOOLS, WRITING_INTRO } from "#lib/content/site.ts";

  let { data } = $props();

  const enter = !heroPlayed;
  onMount(() => {
    heroPlayed = true;
  });

  let dialog = $state<ProjectDialog>();

  const posts = allPosts();

  const ciPost = getPost("from-manual-pulls-to-ci-cd")?.metadata;

  function openDealer(e: MouseEvent) {
    e.preventDefault();
    dialog?.open("dealer", e.currentTarget as HTMLElement);
  }
</script>

<svelte:head>
  <title>Febrian Bayu Nugroho · Software engineer</title>
  <meta
    name="description"
    content="Febrian Bayu Nugroho, software engineer in Banjarmasin. By day I ship business systems for a motorcycle dealer network; by night I run a small fleet of coding agents."
  />
</svelte:head>

<section class="hero" class:enter aria-labelledby="hero-name">
  <div class="hero-nav"><SiteNav /></div>

  <div class="intro col-hero">
    <div class="identity step s0">
      <img src={PERSON.photo} alt={PERSON.name} width="40" height="40" class="avatar" />
      <!-- the "Now" status is the third line of the same block, on the name's left edge -->
      <div class="who">
        <h1 id="hero-name" class="name">{PERSON.name}</h1>
        <p class="role">{PERSON.role} · {PERSON.location}</p>
        <StatusDot />
      </div>
    </div>
    <p class="hero-line step s1">
      <!-- phones drop the identity block, so the full name moves into the greeting -->
      <span class="strong">Hi, I'm Febrian<span class="phone-name">{" Bayu Nugroho"}</span>.</span> By day I
      <a class="text-link" href="/#work/dealer" onclick={openDealer}>ship business systems</a>
      for a motorcycle dealer network. By night I run
      <a class="text-link" href="/stack">a small fleet of coding agents</a>
      that build software with me.
    </p>
  </div>

  <div class="scroll-hint step s3" aria-hidden="true">
    <span class="label-mono-sm">Scroll</span>
    <span class="scroll-line"></span>
  </div>
</section>

<div class="sections">
  <VideoStage />

  <section id="work" aria-label="Selected work">
    <WorkCarousel onopen={(id, from) => dialog?.open(id, from)} />
  </section>

  <section class="col-text about" aria-labelledby="about-h">
    <h2 id="about-h" class="label-mono" data-reveal use:inview>About</h2>
    <p class="body-text" data-reveal use:inview>
      I'm a software engineer in Banjarmasin, Indonesia. I joined
      <LinkPreview
        href="https://triomotor.co.id"
        label="Trio Motor"
        meta="triomotor.co.id"
        image="/images/previews/triomotor.webp"
        external
      /> as an intern and have spent about three years
      there, now owning several of the systems the business runs on every day.
    </p>
    <p class="body-text" data-reveal use:inview style:--reveal-delay="80ms">
      Most of my recent work is about shipping safely. I moved our deploys from manual pulls on the server to
      <LinkPreview
        href={postHref("from-manual-pulls-to-ci-cd")}
        label="CI/CD pipelines"
        meta="Case study · {ciPost ? shortReadingTime(ciPost.readingTime) : '6 min'} read"
      />, and I'm splitting authentication into one shared service.
    </p>
    <p class="body-text" data-reveal use:inview style:--reveal-delay="160ms">
      Outside work I run a home software factory: agents that plan, build, review and test code while I orchestrate. I'm
      also learning interface design, which is why this site looks the way it does.
    </p>
    <dl class="experience" data-reveal use:inview style:--reveal-delay="240ms">
      {#each ABOUT.experience as row (row.years)}
        <div>
          <dt class="tabular">{row.years}</dt>
          <dd><span class="exp-role">{row.role}</span> <span class="exp-company">{row.company}</span></dd>
        </div>
      {/each}
    </dl>
  </section>

  {#if posts.length > 0}
    <section class="writing" aria-labelledby="writing-h">
      <h2 id="writing-h" class="label-mono col-text" data-reveal use:inview>Writing</h2>
      <!-- phones: a swipeable deck of every post; wider screens: a Molly-style row of every post -->
      <div class="col-wide phone-only"><WritingFan {posts} /></div>
      <div class="wide-only"><WritingRow {posts} /></div>
      <div class="col-text writing-foot">
        <p class="body-text muted">{WRITING_INTRO}</p>
        <ArrowLink href={DECISIONS.writingPath} label="All writing" />
      </div>
    </section>
  {/if}

  <section class="col-text" aria-label="Shipping in public" data-reveal use:inview>
    <GitHubContributionCalendar weeks={data.contributions} />
  </section>

  <section class="col-text tools" aria-labelledby="tools-h">
    <h2 id="tools-h" class="label-mono" data-reveal use:inview>Tools I use</h2>
    <ul class="tool-list" data-reveal="noblur" use:inview>
      {#each TOOLS as t (t.name)}
        <li>
          <LinkPreview
            href={t.href}
            label={t.name}
            meta={new URL(t.href).hostname.replace(/^www\./, "")}
            image="/images/previews/{t.preview}.webp"
            class="tool"
            external
          >
            <Logo name={t.logo} size={16} />
            {#if "logo2" in t}<Logo name={t.logo2} size={16} />{/if}
            <span>{t.name}</span>
          </LinkPreview>
        </li>
      {/each}
    </ul>
    <ArrowLink href="/stack" label="Full stack" />
  </section>

  <section id="contact" class="col-text" aria-label="Contact">
    <ContactBlock />
  </section>
</div>

<ProjectDialog bind:this={dialog} />

<style>
  .hero {
    position: relative;
    display: grid;
    /* full screen, as on Molly: the stage stays below the fold and only its glow tints the bottom of the first view */
    min-height: 100dvh;
    padding: 0 0 120px;
    isolation: isolate;
    overflow: clip;
    /* the stage glow climbs up behind the hero; this keeps the hero text above it */
    z-index: 1;
  }
  .hero-nav { position: absolute; top: 32px; right: 40px; z-index: 2; }
  .intro {
    align-self: center;
    display: grid;
    justify-items: center;
    gap: 28px;
    padding-top: 96px;
    text-align: center;
  }
  /* avatar sits beside the name and role; the status line runs under them */
  .identity { display: flex; align-items: flex-start; gap: 12px; text-align: left; }
  .who { display: grid; justify-items: start; }
  .who :global(.status) { margin-top: 6px; }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    outline: 1px solid var(--image-outline);
    outline-offset: -1px;
  }
  .name { margin: 0; font-size: 15px; font-weight: 500; line-height: 1.4; letter-spacing: 0; }
  .role { margin: 0; font-size: 15px; line-height: 1.4; color: var(--fg-muted); }
  .hero-line {
    margin: 0;
    /* ~26px on a 390px phone, ~36px at 768px, 40px from ~920px */
    font-size: clamp(1.625rem, 1rem + 2.6vw, 2.5rem);
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.015em;
    color: var(--fg-muted);
    /* balance: even lines, no lone "with me." at the end or stray "a" at a line end */
    text-wrap: balance;
  }
  .strong { color: var(--fg-default); }
  @media (min-width: 1100px) {
    .hero-line { line-height: 1.2; letter-spacing: -0.02em; }
  }
  .scroll-hint {
    position: absolute;
    left: 50%;
    bottom: 32px;
    display: grid;
    justify-items: center;
    gap: 8px;
    translate: -50% 0;
  }
  /* the stage glow reaches up behind it: --fg-muted drops to ~3:1 there */
  .scroll-hint .label-mono-sm { color: var(--fg-default); }
  .scroll-line {
    width: 1px;
    height: 28px;
    background: var(--line-strong);
    transform-origin: top;
    animation: scroll-line 2.4s var(--ease-in-out) 3; /* stops after 3 runs: WCAG 2.2.2 */
  }
  @keyframes scroll-line {
    0% { scale: 1 0; }
    45% { scale: 1 1; transform-origin: top; }
    55% { scale: 1 1; transform-origin: bottom; }
    100% { scale: 1 0; transform-origin: bottom; }
  }

  /* first-load entrance (Figma 88:5425): 0 / 100 ms (links sit inside the sentence), "Scroll" at 500 ms */
  .enter .step { animation: hero-in 300ms var(--ease-out) both; }
  .enter .s1 { animation-delay: 100ms; }
  .enter .s3 { animation: hero-fade 300ms var(--ease-out) 500ms both; }
  @keyframes hero-in {
    from { opacity: 0; translate: 0 12px; filter: blur(4px); }
  }
  @keyframes hero-fade {
    from { opacity: 0; }
  }

  .sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 120px;
  }
  .about { display: grid; gap: 16px; }
  .about :global(p), .about h2 { margin: 0; }
  .about h2, .tools h2, .writing h2 { font-weight: 400; }
  /* quiet timeline: tabular years, a dot per role joined by a hairline, newest dot filled */
  .experience { display: grid; gap: 20px; margin: 0; padding-top: 16px; }
  .experience div { display: grid; grid-template-columns: 88px minmax(0, 1fr); column-gap: 16px; line-height: 1.4; }
  .experience dt { padding-top: 2px; font-size: 13px; color: var(--fg-muted); }
  .experience dd { position: relative; display: grid; margin: 0; padding-inline-start: 20px; }
  .experience dd::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    top: 6px;
    width: 9px;
    height: 9px;
    border: 1px solid var(--line-default);
    border-radius: var(--radius-pill);
    background: var(--bg-page);
  }
  .experience div:first-child dd::before { border-color: var(--fg-default); background: var(--fg-default); }
  .experience dd::after {
    content: "";
    position: absolute;
    inset-inline-start: 4px;
    top: 18px;
    bottom: -23px;
    width: 1px;
    background: var(--border-default);
  }
  .experience div:last-child dd::after { content: none; }
  .exp-role { font-size: 15px; font-weight: 500; color: var(--fg-default); }
  .exp-company { font-size: 14px; color: var(--fg-muted); }
  /* the side cards of the fan peek past the viewport on phones: clip at the page edge */
  /* minmax(0, 1fr): the scrolling row must not widen the track and push the text column off-centre */
  .writing { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; overflow-x: clip; }
  .writing h2 { margin: 0 auto; }
  .wide-only { display: none; }
  @media (min-width: 768px) {
    .phone-only { display: none; }
    .wide-only { display: block; }
  }
  .writing-foot { display: grid; gap: 20px; justify-items: start; }
  .writing-foot p { margin: 0; }
  .muted { color: var(--fg-muted); }
  .tools { display: grid; gap: 16px; justify-items: start; }
  .tools h2 { margin: 0; }
  .tool-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tool-list li { display: inline-flex; font-size: 15px; line-height: 1.4; }
  /* the pill bleeds 8 px past the text so names stay on the column edge; 29 px tall hit area */
  .tool-list :global(.tool) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: -4px -8px;
    padding: 4px 8px;
    border-radius: var(--radius-button);
    color: var(--fg-default);
    text-decoration: none;
    transition: background-color var(--dur-hover) var(--ease-out), scale var(--dur-release) var(--ease-out);
  }
  .tool-list :global(.tool:active) { scale: 0.96; transition-duration: var(--dur-press); }
  @media (hover: hover) and (pointer: fine) {
    .tool-list :global(.tool:hover) { background: var(--surface-muted); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tool-list :global(.tool:active) { scale: 1; }
  }

  .phone-name { display: none; }
  @media (max-width: 767.98px) {
    .hero-nav { display: none; }
    .intro { gap: 24px; padding-top: 64px; }
    /* phones: the greeting carries the full name; photo, role and status step aside. The <h1> stays
       in the page for screen readers and headings navigation, only hidden from view. */
    .phone-name { display: inline; }
    .identity .avatar, .identity .role, .identity :global(.status) { display: none; }
    .identity {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .sections { gap: 80px; }
    .experience div { grid-template-columns: 76px minmax(0, 1fr); column-gap: 12px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .enter .step, .enter .s3 { animation: hero-fade 200ms ease-out both; }
    .scroll-line { animation: none; }
  }
</style>
