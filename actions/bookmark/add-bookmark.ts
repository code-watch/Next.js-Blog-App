"use server";

import { bookmarkSchema } from "@/lib/validation/bookmark";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function AddBookmark(
  context: z.infer<typeof bookmarkSchema>
): Promise<ActionResult<boolean>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const bookmark = bookmarkSchema.parse(context);
    const { error } = await supabase
      .from("bookmarks")
      .insert({
        id: bookmark.id,
        user_id: bookmark.user_id,
      })
      .single();

    if (error) {
      console.error("[AddBookmark Error]", error.message);
      return actionError(error.message);
    }
    return actionSuccess(true);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[AddBookmark Validation Error]", error.errors);
      return actionError("Invalid bookmark data");
    }
    console.error("[AddBookmark Error]", error);
    return actionError("Failed to add bookmark");
  }
}
