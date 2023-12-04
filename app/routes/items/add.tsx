import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import React from "react";
import { z } from "zod";
import { addItem } from "~/data/items";

const addItemSchema = z.object({
  name: z.string().min(3, "Must be at least 3 characters"),
});

export async function action(args: DataFunctionArgs) {
  const { request } = args;
  const formData = await request.formData();
  const submission = parse(formData, { schema: addItemSchema });

  if (typeof submission.value !== "undefined" && submission.value !== null) {
    const result = await addItem(submission.value);
    const url = new URL(request.url);

    const searchParams = url.searchParams;

    searchParams.set("sort", "desc");

    searchParams.append("id", result.id.toString());

    const path = url.pathname;
    const redirectUrl = `${path}?${searchParams.toString()}`;

    return redirect(redirectUrl);
  }

  return json({ status: "error", submission });
}

function Add() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  const actionData = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "create-items-form",
    ref: formRef,
    constraint: getFieldsetConstraint(addItemSchema),
    onValidate: (args) => {
      return parse(args.formData, { schema: addItemSchema });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
    lastSubmission:
      typeof actionData !== "undefined" ? actionData.submission : undefined,
  });

  React.useEffect(() => {
    if (navigation.state === "idle" && formRef.current !== null) {
      formRef.current.reset();
    }
  }, [navigation.state]);

  return (
    <Form method="post" {...form.props} className="border px-4 py-2">
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={fields.name.id} className="text-sm">
            Name
          </label>
          <div className="flex gap-2">
            <input {...conform.input(fields.name)} className="border-2 grow" />
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
      </div>
    </Form>
  );
}

export default Add;
