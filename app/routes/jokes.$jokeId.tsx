import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
} from "@remix-run/react";

import { JokeDisplay } from "~/components/joke";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
  };
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  return json({
    joke,
    isOwner: userId === joke.jokesterId,
  });
};

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(`The intent ${form.get("intent")} is not supported`, {
      status: 400,
    });
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response("Pssh, nice try. That's not your joke", { status: 403 });
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return <JokeDisplay isOwner={data.isOwner} joke={data.joke} />;
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  const params = useParams();
  const { jokeId } = useParams();

  if (
    isRouteErrorResponse(error) &&
    error instanceof Response &&
    error.status === 400
  ) {
    return (
      <div className="error-container">
        What you're trying to do is not allowed.
      </div>
    );
  } else if (
    isRouteErrorResponse(error) &&
    error instanceof Response &&
    error.status === 404
  ) {
    return (
      <div className="error-container">
        Huh? What the heck is {params.jokeId}?
      </div>
    );
  } else if (
    isRouteErrorResponse(error) &&
    error instanceof Response &&
    error.status === 403
  ) {
    return (
      <div className="error-container">
        Sorry, but {params.jokeId} is not your joke.
      </div>
    );
  } else if (
    isRouteErrorResponse(error) &&
    error instanceof Response &&
    error.status
  ) {
    throw new Error(`Unhandled error: ${error.status}`);
  }

  let errorMessage = "Unhandled error";
  if (error instanceof Response && error.status === 404) {
    errorMessage = error.statusText;
  }
  return (
    <div className="error-container">{`${errorMessage} There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}