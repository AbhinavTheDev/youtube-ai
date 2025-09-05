import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // useLoaderData, // No longer needed
} from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node"; // json is no longer needed

import "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// The loader function is no longer needed
// export async function loader() {
//   return json({
//     ENV: {
//       API_SECRET_KEY: process.env.API_SECRET_KEY,
//     },
//   });
// }

export default function App() {
  // const { ENV } = useLoaderData<typeof loader>(); // No longer needed
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {/* The script to expose ENV is no longer needed */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}
