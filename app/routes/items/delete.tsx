import { parse } from "@conform-to/zod";
import { json, type DataFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { deleteItem } from "~/data/items";

const deleteSchema = z.object({
  id: z.number().int().positive("Must be a positive integer"),
  redirect_url: z
    .string()
    .regex(
      /^\/items\/?(\/add|\/search)?(\?.*)?$/i,
      "Must redirect to /items and its subroutes"
    ),
});

export async function action(args: DataFunctionArgs) {
  const { request } = args;

  const formData = await request.formData();
  const submission = parse(formData, { schema: deleteSchema });

  if (typeof submission.value !== "undefined" && submission.value !== null) {
    deleteItem(submission.value.id);
    return redirect(submission.value.redirect_url);
  }

  return json({ status: "error", submission });
}
