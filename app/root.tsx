import {
  Outlet,
  LiveReload,
  Links,
  useRouteError,
  isRouteErrorResponse,
  Scripts,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import globalUrl from "~/styles/globals.css";
import globalMediumUrl from "~/styles/globals-medium.css";
import globalLargeUrl from "~/styles/globals-large.css";

export const meta: MetaFunction = () => {
  const description = `Learn Remix and laugh at the same time!`;
  return {
    charset: "utf-8",
    description,
    keywords: "Remix,jokes",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Jokes",
    "twitter:description": description,
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumUrl,
      media: "print, (min-width:640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};

export default function App() {
  return (
    <Document title="Remix: so great Its Funny">
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <title>{!title ? "My Remix Blog" : title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document title="{`${error.status} ${error.statusText}`}">
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (error instanceof Response && error.status === 404) {
    errorMessage = error.statusText;
  }

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
};
type LayoutProps = {
  children: React.ReactNode;
};
