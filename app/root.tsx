import { json, MetaArgs, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import config from "~/config";

import styles from "./tailwind.css";

export type RootOutletContext = {
  baseURL: string;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

// TODO: fix type issues and remove ts-ignore
export async function loader() {
  const app = config.get("app");

  return json({
    baseURL: config.get("baseURL"),
    app: {
      // @ts-ignore
      name: app.name,
      // @ts-ignore
      description: app.description,
    },
  } as const);
}

export function meta(args: MetaArgs<typeof loader>) {
  const { data } = args;

  const basicMeta = {
    viewport: "width=device-width, initial-scale=1",
  };

  if (typeof data === "undefined") {
    return [basicMeta];
  }

  return [
    basicMeta,
    {
      title: data.app.name,
    },
    {
      name: "description",
      description: data.app.description,
    },
  ];
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={loaderData} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
