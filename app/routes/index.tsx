import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  json,
  type DataFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import React from "react";
import { z } from "zod";

const addItemsSchema = z.object({
  id: z.number(),
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
    items.push({ ...submission.value, id: items.length });
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
  const formRef = React.useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "create-items-form",
    ref: formRef,
    constraint: getFieldsetConstraint(addItemsSchema),
    onValidate: (args) => {
      return parse(args.formData, { schema: addItemsSchema });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
    lastSubmission:
      typeof actionData !== "undefined" ? actionData.submission : undefined,
  });

  React.useEffect(() => {
    if (
      navigation.state === "idle" &&
      formRef.current !== null &&
      typeof actionData !== "undefined" &&
      actionData.status === "success"
    ) {
      formRef.current.reset();
    }
  }, [actionData, navigation.state]);

  return (
    <div className="m-4 font-sans leading-relaxed flex flex-col gap-4">
      <h1 className="text-xl font-bold">Items</h1>
      <Form method="post" {...form.props} className="border px-4 py-2">
        <input
          {...conform.input(fields.id)}
          hidden
          value={loaderData.items.length}
        />
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor={fields.name.id} className="text-sm">
              Name
            </label>
            <div className="flex gap-2">
              <input {...conform.input(fields.name)} className="border-2" />
              <button
                type="submit"
                className="border border-black bg-gray-300 hover:bg-gray-200 active:bg-gray-400 px-2"
              >
                Add
              </button>
            </div>
            {fields.name.error && (
              <p className="text-sm text-red-400">{fields.name.error}</p>
            )}
          </div>
          <div className="self-center"></div>
        </div>
      </Form>
      <ul className="flex flex-col gap-1">
        {loaderData.items.map((item) => (
          <li key={`item-${item.id}`} className="px-4 py-2 border-2">
            <span className="text-gray-400 italic">#{item.id}</span> {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
