import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint } from "@conform-to/zod";
import { Form } from "@remix-run/react";
import { z } from "zod";

const searchSchema = z.object({
  query: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(100, "Must be less than 100 characters"),
});

function Search() {
  const [form, fields] = useForm({
    id: "search-items-form",
    constraint: getFieldsetConstraint(searchSchema),
  });

  return (
    <Form method="get" {...form.props} className="border px-4 py-2">
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={fields.query.id} className="text-sm">
            Search for
          </label>
          <div className="flex gap-2">
            <input {...conform.input(fields.query)} className="border-2" />
            <button
              type="submit"
              className="border border-black bg-gray-300 hover:bg-gray-200 active:bg-gray-400 px-2"
            >
              Search
            </button>
          </div>
          {fields.query.error && (
            <p className="text-sm text-red-400">{fields.query.error}</p>
          )}
        </div>
      </div>
    </Form>
  );
}

export default Search;
