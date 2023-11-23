import { type DataFunctionArgs, redirect } from "@remix-run/node";

export async function loader(args: DataFunctionArgs) {
  return redirect("./add");
}
