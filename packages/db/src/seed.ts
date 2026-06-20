import dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: "../../apps/web/.env" });

const { db } = await import("./index");
const { posts } = await import("./schema/blog");

const seedPosts = [
  {
    slug: "building-a-saas-with-nextjs-16",
    title: "Building a SaaS with Next.js 16",
    description:
      "Lessons learned from building a production SaaS application with the latest Next.js features.",
    content:
      "## Getting Started\n\nNext.js 16 brings significant improvements to the developer experience.\n\n### Server Components\n\nServer Components are now the default, which means better performance out of the box.\n\n### Key Takeaways\n\n- Use Server Components by default\n- Add 'use client' only when needed\n- Leverage streaming for optimal UX",
    date: "2025-06-15",
    readingTime: "4 min read",
  },
  {
    slug: "a-practical-guide-to-react-19-actions",
    title: "A Practical Guide to React 19 Actions",
    description:
      "How to use React 19 Actions and useActionState for forms, mutations, and more.",
    content:
      "## What Are Actions?\n\nActions provide a way to handle form submissions and data mutations with built-in pending states.\n\n### Basic Example\n\n```tsx\nconst [state, formAction] = useActionState(submitForm, initialState);\n```\n\n### Benefits\n\n- Automatic pending states\n- Progressive enhancement\n- Works without JavaScript",
    date: "2025-05-20",
    readingTime: "6 min read",
  },
  {
    slug: "mastering-tailwind-css-v4-with-oklch",
    title: "Mastering Tailwind CSS v4 with OKLCH",
    description:
      "Deep dive into OKLCH color space and how to leverage it in Tailwind CSS v4.",
    content:
      "## Why OKLCH?\n\nOKLCH provides perceptually uniform colors that look consistent across different hues.\n\n### Setting Up\n\nTailwind v4 supports OKLCH natively through CSS-first configuration.\n\n### Dark Mode\n\nOKLCH makes dark mode color balancing much simpler because lightness is separated from chroma and hue.",
    date: "2025-03-10",
    readingTime: "5 min read",
  },
];

async function main() {
  console.log("Seeding blog posts...");

  for (const post of seedPosts) {
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, post.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(posts).values(post);
      console.log(`  Inserted: ${post.slug}`);
    } else {
      console.log(`  Skipped (exists): ${post.slug}`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
