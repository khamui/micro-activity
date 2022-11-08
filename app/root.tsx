import React from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import type { LinksFunction } from "remix";
import { SSRProvider } from "@primer/react"

export const links: LinksFunction = () => {
  return [
    // add a favicon
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/png",
    },
  ];
};

export const meta: MetaFunction = () => {
  return { title: "Kha's contribution activities" };
};

export default function App() {
  return (
    <SSRProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    </SSRProvider>
  );
}
