import { json, type DataFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getItemsById, getItemsCount, searchForItems } from "~/data/items";

export async function loader(args: DataFunctionArgs) {
  const { request } = args;

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const itemsCount = getItemsCount();

  const query = searchParams.get("query");
  const ids = searchParams.getAll("id");
  if (query !== null) {
    const result = searchForItems(query);
    return json({ items: result, itemsCount });
  }
  if (ids.length > 0) {
    const result = getItemsById(ids.map((id) => parseInt(id, 10)));
    return json({ items: result, itemsCount });
  }

  return json({ items: [], itemsCount });
}

export default function Items() {
  const loaderData = useLoaderData<typeof loader>();

  const getNavLinkClasses = (props: { isActive: boolean }) => {
    return props.isActive ? "" : "text-blue-400 underline hover:no-underline";
  };

  return (
    <div className="m-4 font-sans leading-relaxed flex flex-col gap-4">
      <h1 className="text-xl font-bold">
        Items{" "}
        <span className="text-gray-400 italic font-normal">
          ({loaderData.itemsCount})
        </span>
      </h1>
      <div className="flex gap-2">
        <NavLink to="./search" className={getNavLinkClasses}>
          Search
        </NavLink>
        <NavLink to="./add" className={getNavLinkClasses}>
          Add
        </NavLink>
      </div>
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
