import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  json,
  type DataFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";

const addItemsSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters"),
});

const items: z.infer<typeof addItemsSchema>[] = [];

export async function loader(args: DataFunctionArgs) {
  return json({ items });
}

export async function action(args: DataFunctionArgs) {
  const { request } = args;
  const formData = await request.formData();
  const submission = parse(formData, { schema: addItemsSchema });

  if (typeof submission.value !== "undefined" && submission.value !== null) {
    items.push(submission.value);
    return json({ status: "success", submission });
  }

  return json({ status: "error", submission });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const [form, fields] = useForm({
    id: "create-items-form",
    onValidate: (args) => {
      return parse(args.formData, { schema: addItemsSchema });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Items</h1>
      <Form method="post" {...form.props}>
        <label htmlFor={fields.name.id}>Name</label>
        <input {...conform.input(fields.name)} />
        {fields.name.error && <p>{fields.name.error}</p>}
        <button type="submit">Add</button>
      </Form>
      <ul>
        {loaderData.items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
