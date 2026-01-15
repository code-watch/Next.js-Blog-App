"use server";

import { commentSchema } from "@/lib/validation/comment";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function PostComment(
  context: z.infer<typeof commentSchema>
): Promise<ActionResult<boolean>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const comment = commentSchema.parse(context);
    const { error } = await supabase
      .from("comments")
      .insert({
        post_id: comment.postId,
        user_id: comment.userId,
        comment: comment.comment,
      })
      .single();

    if (error) {
      console.error("[PostComment Error]", error.message);
      return actionError(error.message);
    }
    return actionSuccess(true);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[PostComment Validation Error]", error.errors);
      return actionError("Invalid comment data");
    }
    console.error("[PostComment Error]", error);
    return actionError("Failed to post comment");
  }
}
