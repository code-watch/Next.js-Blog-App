"use server";

import { bookmarkSchema } from "@/lib/validation/bookmark";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function DeleteBookmark(
  context: z.infer<typeof bookmarkSchema>
): Promise<ActionResult<boolean>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const bookmark = bookmarkSchema.parse(context);

    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .match({ id: bookmark.id, user_id: bookmark.user_id })
      .select();

    if (error) {
      console.error("[DeleteBookmark Error]", error.message);
      return actionError(error.message);
    }
    if (data && data.length > 0) {
      return actionSuccess(true);
    }
    return actionError("Bookmark not found");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[DeleteBookmark Validation Error]", error.errors);
      return actionError("Invalid bookmark data");
    }
    console.error("[DeleteBookmark Error]", error);
    return actionError("Failed to delete bookmark");
  }
}
