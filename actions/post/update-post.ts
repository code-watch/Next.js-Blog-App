"use server";

import { postUpdateSchema } from "@/lib/validation/post";
import { ActionResult, actionError, actionSuccess } from "@/types/action";
import { Draft } from "@/types/collection";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function UpdatePost(
  context: z.infer<typeof postUpdateSchema>
): Promise<ActionResult<Draft>> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const post = postUpdateSchema.parse(context);

    const { data, error } = await supabase
      .from("drafts")
      .update({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category_id: post.categoryId,
        description: post.description,
        image: post.image,
        content: post.content,
      })
      .match({ id: post.id })
      .select()
      .single();

    if (error) {
      console.error("[UpdatePost Error]", error.message);
      return actionError(error.message);
    }
    return actionSuccess(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[UpdatePost Validation Error]", error.errors);
      return actionError("Invalid input data");
    }
    console.error("[UpdatePost Error]", error);
    return actionError("Failed to update post");
  }
}
