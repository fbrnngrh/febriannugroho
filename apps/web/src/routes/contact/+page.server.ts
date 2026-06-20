import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { db } from "@febriannugroho/db";
import { contacts } from "@febriannugroho/db/schema";
import type { Actions } from "./$types";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = contactSchema.safeParse(data);

    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: data,
      });
    }

    try {
      await db.insert(contacts).values(result.data);
      return { success: true };
    } catch {
      return fail(500, {
        error: "Failed to send message. Please try again.",
      });
    }
  },
};
