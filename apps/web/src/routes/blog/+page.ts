import type { PageLoad } from "./$types";

type PostMetadata = {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  slug: string;
};

const posts = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
}) as Record<string, { metadata: PostMetadata }>;

export const load: PageLoad = async () => {
  const allPosts = Object.values(posts)
    .map((mod) => mod.metadata)
    .sort((a, b) => b.date.localeCompare(a.date));

  return { posts: allPosts };
};
