import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ArrowUpDown, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/investments/$name/deal-team-highlights")(
  {
    component: RouteComponent,
  }
);

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

const logs: LogEntry[] = [
  {
    id: "log1",
    title: "Call with new CEO",
    description:
      "Positive feedback from the new CEO Oscar Garcia Maceiras, on Q1 performance. He was appointed CEO of Inditex on December 2024, succeding Carlos Crespo, as part of the broader leadership reshuffle aimed at ensuring continuity and accelerating Inditex´s global expansion and digital transformation.",
    tags: [{ label: "Other", color: "gray" }],
    author: "Monica Gomez Acebo",
    date: "2025-01-01",
  },
  {
    id: "log2",
    title: "Integration for greater efficiency",
    description:
      "Positive feedback from the new CEO Oscar Garcia Maceiras, on Q1 performance. He was appointed CEO of Inditex on December 2024, succeding Carlos Crespo, as part of the broader leadership reshuffle aimed at ensuring continuity and accelerating Inditex´s global expansion and digital transformation.",
    tags: [
      { label: "Competition", color: "blue" },
      { label: "Global Economy", color: "purple" },
      { label: "Other", color: "gray" },
    ],
    author: "Monica Gomez Acebo",
    date: "2024-10-20",
  },
  {
    id: "log3",
    title: "Internal Meeting",
    description:
      "Positive feedback from the new CEO Oscar Garcia Maceiras, on Q1 performance. He was appointed CEO of Inditex on December 2024, succeding Carlos Crespo, as part of the broader leadership reshuffle aimed at ensuring continuity and accelerating Inditex´s global expansion and digital transformation.",
    tags: [{ label: "Other", color: "gray" }],
    author: "Monica Gomez Acebo",
    date: "2024-06-10",
  },
  {
    id: "log4",
    title: "Bank of America approach",
    description:
      "Positive feedback from the new CEO Oscar Garcia Maceiras, on Q1 performance. He was appointed CEO of Inditex on December 2024, succeding Carlos Crespo, as part of the broader leadership reshuffle aimed at ensuring continuity and accelerating Inditex´s global expansion and digital transformation.",
    tags: [{ label: "Exit Strategy", color: "yellow" }],
    author: "Monica Gomez Acebo",
    date: "2024-03-23",
  },
];

function TagBadge({ tag }: { tag: LogTag }) {
  const bg = `${tag.color}-100`;
  const text = `${tag.color}-800`;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium bg-${bg} text-${text}`}
    >
      {tag.label}
    </span>
  );
}

function RouteComponent() {
  return (
    <div className="p-6 space-y-6">
      {/* Top right button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <Plus className="w-4 h-4" /> Add Comment
        </button>
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
        {logs.map((log) => (
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
                {log.tags.map((t) => (
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
    </div>
  );
}
