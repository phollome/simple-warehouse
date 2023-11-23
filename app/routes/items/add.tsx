import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import React from "react";
import { addItem, itemSchema } from "~/data/items";

export async function action(args: DataFunctionArgs) {
  const { request } = args;
  const formData = await request.formData();
  const submission = parse(formData, { schema: itemSchema });

  if (typeof submission.value !== "undefined" && submission.value !== null) {
    addItem(submission.value);
    return json({ status: "success", submission });
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
    constraint: getFieldsetConstraint(itemSchema),
    onValidate: (args) => {
      return parse(args.formData, { schema: itemSchema });
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
    <Form method="post" {...form.props} className="border px-4 py-2">
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
      </div>
    </Form>
  );
}

export default Add;
