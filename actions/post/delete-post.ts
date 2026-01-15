"use server";

import { postDeleteSchema } from "@/lib/validation/post";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function DeletePost(
  context: z.infer<typeof postDeleteSchema>
): Promise<ActionResult<boolean>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const post = postDeleteSchema.parse(context);

    const { data, error } = await supabase
      .from("drafts")
      .delete()
      .match({ id: post.id, author_id: post.user_id })
      .select();

    if (error) {
      console.error("[DeletePost Error]", error.message);
      return actionError(error.message);
    }
    if (data && data.length > 0) {
      return actionSuccess(true);
    }
    return actionError("Post not found");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[DeletePost Validation Error]", error.errors);
      return actionError("Invalid input data");
    }
    console.error("[DeletePost Error]", error);
    return actionError("Failed to delete post");
  }
}
