import { redirect, type DataFunctionArgs } from "@remix-run/node";

export async function loader(args: DataFunctionArgs) {
  return redirect("/items");
}
