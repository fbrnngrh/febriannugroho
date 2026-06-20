import { z } from "zod";
import { publicProcedure } from "../index";
import { db } from "@febriannugroho/db";
import { posts } from "@febriannugroho/db/schema";
import { desc, eq } from "drizzle-orm";

export const blogRouter = {
  list: publicProcedure.handler(async () => {
    return db.select().from(posts).orderBy(desc(posts.date));
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      return result[0] ?? null;
    }),
};
