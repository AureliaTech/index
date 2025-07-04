import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ArrowUpDown, MoreVertical } from "lucide-react";
import { Outlet, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

const getDealTeamHighlightsData = createServerFn({ method: "GET" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const dealTeamHighlights = JSON.parse(raw)["deal-team-highlights"];

      const logs: LogEntry[] = dealTeamHighlights.map((log, idx) => ({
        id: `log${idx}`,
        title: log.title,
        description: log.content,
        tags: log.labels.map((l) => ({
          label: l.name,
          color: l.color === "grey" ? "gray" : l.color,
        })),
        author: log.author,
        date: log.date,
      }));

      return { logs };
    } catch (error) {
      return { logs: [], error: "No data found" };
    }
  });

export type CommentLabel = {
  id: number;
  name: string;
  color: string;
};

export interface Comment {
  title: string;
  date: string; // ISO date
  content: string;
  author: string;
  labels: CommentLabel[];
}

type LogTag = {
  label: string;
  color: string; // Tailwind bg text classes prefix e.g. blue
};

interface LogEntry {
  id: string;
  title: string;
  description: string;
  tags: LogTag[];
  author: string;
  date: string; // ISO date
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100  text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  gray: "bg-gray-200  text-gray-800",
  red: "bg-red-100 text-red-800",
};

function TagBadge({ tag }: { tag: LogTag }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[tag.color]}`}
    >
      {tag.label}
    </span>
  );
}

export const Route = createFileRoute("/investments/$name/deal-team-highlights")(
  {
    loader: async ({ params }) => {
      return await getDealTeamHighlightsData({ data: { name: params.name } });
    },
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { logs, error } = Route.useLoaderData();

  if (error) {
    return <div>Error loading deal team highlights data</div>;
  }

  const { name } = Route.useParams();

  return (
    <div className="p-6 space-y-6">
      {/* Top right button */}
      <div className="flex justify-end">
        <Link
          to="/investments/$name/deal-team-highlights/new"
          params={{ name }}
          className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Comment
        </Link>
      </div>

      {/* Search & filters row */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by keyword"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none"
          />
        </div>

        {/* Year filter */}
        <select className="rounded-full border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm bg-white dark:bg-neutral-900">
          <option>Year</option>
          <option>2025</option>
          <option>2024</option>
        </select>

        {/* Item filter */}
        <select className="rounded-full border border-neutral-200 dark:border-neutral-700 py-2 px-3 text-sm bg-white dark:bg-neutral-900">
          <option>Item</option>
          <option>Meeting</option>
          <option>Update</option>
          <option>Decision</option>
        </select>

        {/* Sort */}
        <button className="rounded-full border border-neutral-200 dark:border-neutral-700 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <ArrowUpDown className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>

      {/* Logs list */}
      <div className="space-y-6">
        {logs.map((log: LogEntry) => (
          <div
            key={log.id}
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
          >
            {/* Title row */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {log.title}
                </h3>
                {/* tags inline */}
                {log.tags.map((t: LogTag) => (
                  <TagBadge key={t.label} tag={t} />
                ))}
              </div>
              <MoreVertical className="w-4 h-4 text-neutral-400" />
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 mb-3 text-sm">
              {log.description}
            </p>

            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {log.author} -{" "}
              {Intl.DateTimeFormat("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              }).format(new Date(log.date))}
            </div>
          </div>
        ))}
      </div>

      {/* Nested overlay route */}
      <Outlet />
    </div>
  );
}
