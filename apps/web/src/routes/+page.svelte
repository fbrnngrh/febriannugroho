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
  import { allPosts, getPost, postHref, shortReadingTime } from "#lib/content/posts.ts";
  import { ABOUT, DECISIONS, PERSON, TOOLS, WRITING_INTRO } from "#lib/content/site.ts";

  const enter = !heroPlayed;
  onMount(() => {
    heroPlayed = true;
  });

  let dialog = $state<ProjectDialog>();

  const FAN_ORDER = ["redesigning-this-site-with-claude", "from-manual-pulls-to-ci-cd", "how-my-agent-fleet-ships-code"];
  const posts = allPosts();
  const fanPosts = FAN_ORDER.map((slug) => posts.find((p) => p.slug === slug)).filter((p) => p !== undefined);

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
  <div class="aura" aria-hidden="true"><span class="a1"></span><span class="a2"></span></div>
  <div class="hero-nav"><SiteNav /></div>

  <div class="intro col-hero">
    <div class="identity step s0">
      <img src={PERSON.photo} alt={PERSON.name} width="40" height="40" class="avatar" />
      <div>
        <h1 id="hero-name" class="name">{PERSON.name}</h1>
        <p class="role">{PERSON.role} · {PERSON.location}</p>
      </div>
    </div>
    <div class="step s1"><StatusDot /></div>
    <p class="hero-line step s1">
      <span class="strong">Hi, I'm Febrian.</span> By day I
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
  <div data-reveal="noblur" use:inview>
    <VideoStage />
  </div>

  <section id="work" aria-label="Selected work">
    <WorkCarousel onopen={(id, from) => dialog?.open(id, from)} />
  </section>

  <section class="col-text about" aria-labelledby="about-h">
    <h2 id="about-h" class="label-mono" data-reveal use:inview>About</h2>
    <p class="body-text" data-reveal use:inview>
      I'm a software engineer in Banjarmasin, Indonesia. I joined Trio Motor as an intern and have spent about three years
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
        <div><dt class="tabular">{row.years}</dt><dd>{row.role}</dd></div>
      {/each}
    </dl>
  </section>

  {#if fanPosts.length > 0}
    <section class="writing" aria-labelledby="writing-h">
      <h2 id="writing-h" class="label-mono col-text">Writing</h2>
      <div class="col-wide"><WritingFan posts={fanPosts} /></div>
      <div class="col-text writing-foot">
        <p class="body-text muted">{WRITING_INTRO}</p>
        <ArrowLink href={DECISIONS.writingPath} label="All writing" />
      </div>
    </section>
  {/if}

  <section class="col-text" aria-label="Shipping in public" data-reveal use:inview>
    <GitHubContributionCalendar />
  </section>

  <section class="col-text tools" aria-labelledby="tools-h">
    <h2 id="tools-h" class="label-mono">Tools I use</h2>
    <ul class="tool-list" data-reveal="noblur" use:inview>
      {#each TOOLS as t (t.name)}
        <li>
          <Logo name={t.logo} size={16} />
          {#if "logo2" in t}<Logo name={t.logo2} size={16} />{/if}
          <span>{t.name}</span>
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
    min-height: 100dvh;
    padding: 0 0 120px;
    isolation: isolate;
    overflow: clip;
  }
  .hero-nav { position: absolute; top: 32px; right: 40px; z-index: 2; }
  .aura {
    position: absolute;
    inset: auto 0 0;
    height: 58%;
    z-index: -1;
    pointer-events: none;
    /* fade to the page before the hero's bottom edge, no divider line */
    mask-image: linear-gradient(to bottom, transparent, #000 40%, #000 70%, transparent);
  }
  .aura span { position: absolute; border-radius: 50%; }
  .a1 {
    left: 8%;
    bottom: -12%;
    width: 76%;
    height: 70%;
    background: var(--stage-glow-merged);
    opacity: var(--stage-glow-opacity-2);
    filter: blur(90px);
  }
  .a2 {
    left: 33%;
    bottom: -10%;
    width: 53%;
    height: 58%;
    background: var(--stage-glow-merged-2);
    opacity: var(--stage-glow-opacity-3);
    filter: blur(160px);
  }
  .intro {
    align-self: center;
    display: grid;
    justify-items: center;
    gap: 28px;
    padding-top: 96px;
    text-align: center;
  }
  .identity { display: flex; align-items: center; gap: 12px; text-align: left; }
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
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
    letter-spacing: -0.01em;
    color: var(--fg-muted);
    text-wrap: balance;
  }
  .strong { color: var(--fg-default); }
  @media (min-width: 768px) {
    .hero-line { font-size: 30px; line-height: 1.24; letter-spacing: -0.015em; }
  }
  @media (min-width: 1100px) {
    .hero-line { font-size: 40px; line-height: 1.2; letter-spacing: -0.02em; }
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
  .scroll-line {
    width: 1px;
    height: 28px;
    background: var(--line-strong);
    transform-origin: top;
    animation: scroll-line 2.4s var(--ease-in-out) infinite;
  }
  @keyframes scroll-line {
    0% { scale: 1 0; }
    45% { scale: 1 1; transform-origin: top; }
    55% { scale: 1 1; transform-origin: bottom; }
    100% { scale: 1 0; transform-origin: bottom; }
  }

  /* first-load entrance (Figma 88:5425): 0 / 100 ms (links sit inside the sentence), "Scroll" at 500 ms, aura fades 500 ms */
  .enter .step { animation: hero-in 300ms var(--ease-out) both; }
  .enter .s1 { animation-delay: 100ms; }
  .enter .s3 { animation: hero-fade 300ms var(--ease-out) 500ms both; }
  .enter .aura { animation: hero-fade 500ms var(--ease-out) both; }
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
  .experience { display: grid; gap: 8px; margin: 0; padding-top: 16px; }
  .experience div { display: grid; grid-template-columns: 120px 1fr; gap: 16px; font-size: 15px; line-height: 1.4; }
  .experience dt { color: var(--fg-muted); }
  .experience dd { margin: 0; }
  /* the side cards of the fan peek past the viewport on phones: clip at the page edge */
  .writing { display: grid; gap: 20px; overflow-x: clip; }
  .writing h2 { margin: 0 auto; }
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
  .tool-list li { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; line-height: 1.4; }

  @media (max-width: 767.98px) {
    .hero-nav { display: none; }
    .intro { gap: 24px; padding-top: 64px; }
    .identity { text-align: left; }
    .sections { gap: 80px; }
    .experience div { grid-template-columns: 96px 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .enter .step, .enter .s3 { animation: hero-fade 200ms ease-out both; }
    .scroll-line { animation: none; }
  }
</style>
