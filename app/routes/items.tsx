import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import config from "~/config";
import {
  getItems,
  getItemsByIDs,
  getItemsCount,
  searchForItems,
} from "~/data/items";
import { type RootOutletContext } from "~/root";
import { action as deleteAction } from "./items/delete";

export async function loader(args: DataFunctionArgs) {
  const { request } = args;

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const query = searchParams.get("query");
  const ids = searchParams.getAll("id");
  const sort = searchParams.get("sort");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const take = config.get("app.numberOfItemsPerPage"); // TODO: fix type never
  const skip = (page - 1) * take;

  if (query !== null) {
    const itemsCount = await getItemsCount({ query });

    const result = await searchForItems(query, { sort, skip, take });

    if (page > 1 && result.length === 0) {
      const prevPage = page - 1;
      url.searchParams.set("page", prevPage.toString());
      return redirect(`${url.pathname}${url.search}`);
    }

    const numberOfPages = Math.ceil(itemsCount / take);
    return json({ items: result, itemsCount, page, numberOfPages });
  }
  if (ids.length > 0) {
    const parsedIDs = ids.map((id) => parseInt(id, 10));
    const result = await getItemsByIDs(parsedIDs, { sort, skip, take });

    if (page > 1 && result.length === 0) {
      const prevPage = page - 1;
      url.searchParams.set("page", prevPage.toString());
      return redirect(`${url.pathname}${url.search}`);
    }

    const itemsCount = await getItemsCount({ ids: parsedIDs });

    const numberOfPages = Math.ceil(itemsCount / take);
    return json({ items: result, itemsCount, page, numberOfPages });
  }
  const result = await getItems({ skip, take, sort });

  const itemsCount = await getItemsCount();
  const numberOfPages = Math.ceil(itemsCount / take);

  if (page > 1 && result.length === 0) {
    const prevPage = page - 1;
    url.searchParams.set("page", prevPage.toString());
    return redirect(`${url.pathname}${url.search}`);
  }

  return json({ items: result, itemsCount, page, numberOfPages });
}

export default function Items() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof deleteAction>({ key: "delete-item" });
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const context = useOutletContext<RootOutletContext>();

  const getNavLinkClasses = (props: { isActive: boolean }) => {
    return props.isActive ? "" : "text-blue-400 underline hover:no-underline";
  };

  return (
    <div className="m-4 font-sans leading-relaxed flex flex-col gap-4">
      <Link to="./" className="underline hover:no-underline">
        <h1 className="text-xl font-bold">
          Items{" "}
          <span className="text-gray-400 italic font-normal">
            ({loaderData.itemsCount})
          </span>
        </h1>
      </Link>
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
        {loaderData.items.map((item) => {
          const redirectURL = new URL(`${context.baseURL}${location.pathname}`);

          const idsWithoutCurrent = searchParams.getAll("id").filter((id) => {
            return parseInt(id, 10) !== item.id;
          });
          idsWithoutCurrent.forEach((id) => {
            redirectURL.searchParams.append("id", id);
          });

          const query = searchParams.get("query");
          if (query !== null) {
            redirectURL.searchParams.append("query", query);
          }

          const page = searchParams.get("page");
          if (page !== null) {
            redirectURL.searchParams.append("page", page);
          }

          const redirectPath = `${redirectURL.pathname}${redirectURL.search}`;

          return (
            <li
              key={`item-${item.id}`}
              className="px-4 py-2 border-2"
              data-testid="item"
            >
              <fetcher.Form method="post" action="./delete">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="redirect_url" value={redirectPath} />
                <div className="w-full flex gap-2">
                  <p className="grow">
                    <span className="text-gray-400 italic">#{item.id}</span>{" "}
                    {item.name}
                  </p>
                  <button
                    type="submit"
                    className="border border-black bg-gray-300 hover:bg-gray-200 active:bg-gray-400 px-2"
                  >
                    Delete
                  </button>
                </div>
              </fetcher.Form>
              {typeof fetcher.data !== "undefined" &&
                fetcher.data.status === "error" &&
                typeof fetcher.data.submission.payload.id === "string" &&
                parseInt(fetcher.data.submission.payload.id, 10) ===
                  item.id && (
                  <div className="text-sm text-red-400 my-1">
                    {Object.entries(fetcher.data.submission.error).map(
                      ([key, value]) => {
                        return (
                          <p key={`error-${key}`}>
                            {key}: {value}
                          </p>
                        );
                      }
                    )}
                  </div>
                )}
            </li>
          );
        })}
      </ul>
      {loaderData.numberOfPages > 1 && (
        <ul className="w-full flex gap-4 justify-center">
          {Array.from({ length: loaderData.numberOfPages }).map((_, index) => {
            const page = index + 1;
            const url = new URL(`${context.baseURL}${location.pathname}`);

            url.searchParams.set("page", page.toString());
            searchParams.getAll("id").forEach((id) => {
              url.searchParams.append("id", id);
            });
            const query = searchParams.get("query");
            if (query !== null) {
              url.searchParams.append("query", query);
            }

            const pageLinkClasses =
              page !== loaderData.page
                ? "text-blue-400 underline hover:no-underline"
                : "cursor-default";
            return (
              <li key={`page-${page}`}>
                <Link
                  to={url.pathname + url.search}
                  className={pageLinkClasses}
                >
                  {page}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
