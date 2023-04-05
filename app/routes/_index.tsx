import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link } from "react-router-dom";

import stylesUrl from "~/styles/index.css";

export const meta: MetaFunction = () => ({
  title: "Remix: So great, it's funny!",
  description: "Remix jokes app. Learn Remix and laugh at the same time!",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Homepage() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
