import type { Component } from "svelte";
import { DECISIONS, PLANNED_POSTS } from "./site.ts";

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  slug: string;
  tags: string[];
  lead?: string;
  cover?: "ci-cd";
  coverImage?: string;
  legacy?: boolean;
};

export type PostSummary = PostMetadata & { planned?: boolean };

type PostModule = { default: Component; metadata: PostMetadata };

const modules = import.meta.glob("/src/content/blog/*.md", { eager: true }) as Record<string, PostModule>;

const published = Object.values(modules).filter((m) => DECISIONS.showLegacyPosts || !m.metadata.legacy);

export function getPost(slug: string) {
  return published.find((m) => m.metadata.slug === slug);
}

export function publishedSlugs() {
  return published.map((m) => m.metadata.slug);
}

/** Published posts plus planned ones (no page yet), newest first. */
export function allPosts(): PostSummary[] {
  return [
    ...published.map((m) => m.metadata),
    ...PLANNED_POSTS.map((p) => ({ ...p, tags: [...p.tags], planned: true })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

export function postHref(slug: string) {
  return `${DECISIONS.writingPath}/${slug}`;
}

export function formatDate(iso: string, style: "long" | "short" = "long") {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: style === "long" ? "2-digit" : "numeric",
    ...(style === "long" ? { year: "numeric" } : {}),
  });
}

/** "6 min read" -> "6 min" */
export function shortReadingTime(t: string) {
  return t.replace(/\s*read$/i, "");
}
