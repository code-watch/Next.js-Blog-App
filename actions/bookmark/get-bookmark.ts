"use server";

import { bookmarkSchema } from "@/lib/validation/bookmark";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function GetBookmark(
  context: z.infer<typeof bookmarkSchema>
): Promise<boolean> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const bookmark = bookmarkSchema.parse(context);

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .match({ id: bookmark.id, user_id: bookmark.user_id });

    if (error) {
      console.error("[GetBookmark Error]", error.message);
      return false;
    }
    return data && data.length > 0;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[GetBookmark Validation Error]", error.errors);
    } else {
      console.error("[GetBookmark Error]", error);
    }
    return false;
  }
}
