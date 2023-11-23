import { json, type DataFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getItems } from "~/data/items";

export async function loader(args: DataFunctionArgs) {
  const items = getItems();

  return json({ items });
}

export default function Items() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="m-4 font-sans leading-relaxed flex flex-col gap-4">
      <h1 className="text-xl font-bold">Items</h1>
      <Outlet />

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
