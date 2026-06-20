import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  readingTime: text("reading_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
