import { createFileRoute } from "@tanstack/react-router";
import { getDealTeamHighlightById } from "../../functions/deal-team-highlights";

export const Route = createFileRoute("/mobile/$id")({
  component: DealTeamHighlightPage,
  loader: async ({ params }) => {
    const id = params["id"];
    const { highlight } = await getDealTeamHighlightById({ data: { id } });
    return {
      highlight,
    };
  },
});

function DealTeamHighlightPage() {
  const { highlight } = Route.useLoaderData() as {
    highlight: {
      id: number;
      title: string;
      description: string;
      authorUsername: string;
      createdAt: string | Date;
      labels: any;
    } | null;
  };

  if (!highlight) {
    return <div className="p-4 text-red-500">Highlight not found.</div>;
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-neutral-100" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={highlight.title}
            disabled
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white opacity-80"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-neutral-100" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={highlight.description}
            readOnly
            rows={6}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white opacity-80 resize-none"
          />
        </div>

        {/* Labels */}
        {Array.isArray(highlight.labels) && highlight.labels.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-900 dark:text-neutral-100">Labels</label>
            <div className="flex gap-2 flex-wrap">
              {highlight.labels.map((l: any) => (
                <span
                  key={l.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-100"
                >
                  {l.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author & Date */}
        <div className="text-xs text-neutral-500 dark:text-neutral-300">
          {highlight.authorUsername} – {new Date(highlight.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
