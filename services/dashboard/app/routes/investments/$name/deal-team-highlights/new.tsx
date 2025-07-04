import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";
import Drawer from "../../../../components/Drawer";
import { CommentLabel, Comment } from "../deal-team-highlights";

const getLabels = createServerFn({ method: "GET" }).handler(async () => {
  const labels: CommentLabel[] = JSON.parse(
    await fs.readFile("app/data/labels.json", "utf8")
  );
  return { labels };
});

const addComment = createServerFn({ method: "POST" })
  .validator((payload: { company: string; comment: Comment }) => payload)
  .handler(async ({ data: { company, comment } }) => {
    const file = `app/data/${company}/general-data.json`;

    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      json = {};
    }

    const highlights: Comment[] = Array.isArray(json["deal-team-highlights"])
      ? (json["deal-team-highlights"] as Comment[])
      : [];

    json["deal-team-highlights"] = [comment, ...highlights];

    await fs.writeFile(file, JSON.stringify(json, null, 2));

    return { success: true };
  });

export const Route = createFileRoute(
  "/investments/$name/deal-team-highlights/new"
)({
  loader: async () => {
    const { labels } = await getLabels();
    return { labels } as { labels: CommentLabel[] };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { labels } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { name } = Route.useParams();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") || "").toString();
    const description = (formData.get("description") || "").toString();
    const selectedIds = formData.getAll("labels").map((v) => Number(v));

    const newComment: Comment = {
      title,
      content: description,
      date: new Date().toISOString(),
      author: "Alvaro Bernar",
      labels: labels.filter((l) => selectedIds.includes(l.id)),
    };
    try {
      await addComment({ data: { company: name, comment: newComment } });

      navigate({ to: ".." });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      open={true}
      onClose={() => navigate({ to: ".." })}
      title="Add Comment"
    >
      <form className="space-y-4" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Comment title"
            required
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Write your comment..."
            required
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Labels</label>
          <div className="flex flex-col flex-wrap gap-2 max-h-52 overflow-auto">
            {labels.map((l) => (
              <label key={l.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  name="labels"
                  value={l.id}
                  className="accent-blue-600"
                />
                {l.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate({ to: ".." })}
            className="rounded-md border hover:cursor-pointer border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md hover:cursor-pointer bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1 text-sm hover:opacity-90"
          >
            Save
          </button>
        </div>
      </form>
    </Drawer>
  );
}
