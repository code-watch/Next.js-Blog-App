"use server";

import { commentDeleteSchema } from "@/lib/validation/comment";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function DeleteComment(
  context: z.infer<typeof commentDeleteSchema>
): Promise<ActionResult<boolean>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const comment = commentDeleteSchema.parse(context);

    const { data, error } = await supabase
      .from("comments")
      .delete()
      .match({ id: comment.id, user_id: comment.userId })
      .select();

    if (error) {
      console.error("[DeleteComment Error]", error.message);
      return actionError(error.message);
    }
    if (data && data.length > 0) {
      return actionSuccess(true);
    }
    return actionError("Comment not found");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[DeleteComment Validation Error]", error.errors);
      return actionError("Invalid input data");
    }
    console.error("[DeleteComment Error]", error);
    return actionError("Failed to delete comment");
  }
}
