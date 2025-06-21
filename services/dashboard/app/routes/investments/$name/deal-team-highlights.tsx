import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ArrowUpDown, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import Drawer from "../../../components/Drawer";
// Server-side helpers
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

// ---------------------------------------------------------------------------
// Server functions -----------------------------------------------------------
// ---------------------------------------------------------------------------

const getLabels = createServerFn({ method: "GET" }).handler(async () => {
  const labels = JSON.parse(await fs.readFile("app/data/labels.json", "utf8"));
  return labels;
});

const getComments = createServerFn({ method: "GET" }).handler(async () => {
  const comments = JSON.parse(
    await fs.readFile("app/data/comments.json", "utf8")
  );
  return comments;
});

// Add a new comment helper ----------------------------------------------------------
const addComment = createServerFn({ method: "POST" })
  .validator((payload: { data: Comment }) => payload)
  .handler(async ({ data }) => {
    const file = "app/data/comments.json";
    const comments: Comment[] = JSON.parse(await fs.readFile(file, "utf8"));

    // Prepend new comment for recency (optional)
    const updated = [data, ...comments];

    await fs.writeFile(file, JSON.stringify(updated, null, 2));

    return data;
  });

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------

type CommentLabel = {
  id: number;
  name: string;
  color: string;
};

interface Comment {
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

const colourClasses: Record<string, string> = {
  blue: "bg-blue-100  text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  gray: "bg-gray-200  text-gray-800",
  red: "bg-red-100 text-red-800",
};

function TagBadge({ tag }: { tag: LogTag }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colourClasses[tag.color]}`}
    >
      {tag.label}
    </span>
  );
}

type LoaderData = {
  labels: CommentLabel[];
  comments: Comment[];
};

export const Route = createFileRoute("/investments/$name/deal-team-highlights")(
  {
    //Load data from server
    loader: async (): Promise<LoaderData> => {
      const [labels, comments] = await Promise.all([
        getLabels(),
        getComments(),
      ]);

      return { labels, comments };
    },
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { comments, labels } = Route.useLoaderData() as LoaderData;

  // Local state to support optimistic updates (by now) --------------------------------
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);

  // Form refs (avoid re-renders)
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);

  const resetForm = () => {
    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    setSelectedLabelIds([]);
  };

  const toggleLabel = (id: number) => {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment: Comment = {
      title: titleRef.current?.value || "",
      content: descriptionRef.current?.value || "",
      date: new Date().toISOString(),
      author: "Alvaro Bernar",
      labels: labels.filter((l) => selectedLabelIds.includes(l.id)),
    };

    try {
      await addComment({ data: newComment } as any);
      setCommentsList((prev) => [newComment, ...prev]);
      setDrawerOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      // Handle error (we could display toast)
    }
  };

  // Transform comments to LogEntry format expected by UI
  const logs: LogEntry[] = commentsList.map((comment, idx) => ({
    id: `log${idx}`,
    title: comment.title,
    description: comment.content,
    tags: comment.labels.map((l) => ({
      label: l.name,
      color: l.color === "grey" ? "gray" : l.color,
    })),
    author: comment.author,
    date: comment.date,
  }));

  const [drawerOpen, setDrawerOpen] = useState(false);

  // -------------------------------------------------------------------------
  // Tag multi-select component ----------------------------------------------
  // -------------------------------------------------------------------------

  function TagMultiSelect({
    allLabels,
    selected,
    onToggle,
  }: {
    allLabels: CommentLabel[];
    selected: number[];
    onToggle: (id: number) => void;
  }) {
    const [open, setOpen] = useState(false);

    // Close dropdown on outside click ---------------------------------------
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabels = allLabels.filter((l) => selected.includes(l.id));

    return (
      <div className="relative" ref={containerRef}>
        {/* Input area */}
        <div
          className="min-h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 flex flex-wrap gap-1 items-center cursor-pointer"
          onClick={() => setOpen((o) => !o)}
        >
          {selectedLabels.length === 0 ? (
            <span className="text-sm text-neutral-500">Select labels</span>
          ) : (
            selectedLabels.map((l) => {
              const color = l.color === "grey" ? "gray" : l.color;
              return (
                <span
                  key={l.id}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
                >
                  {l.name}
                </span>
              );
            })
          )}
        </div>

        {/* Dropdown list */}
        {open && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg max-h-52 overflow-auto p-1">
            {allLabels.map((l) => {
              const isSel = selected.includes(l.id);
              const color = l.color === "grey" ? "gray" : l.color;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onToggle(l.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                    isSel ? "bg-neutral-100 dark:bg-neutral-700" : ""
                  }`}
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
                  >
                    {l.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top right button */}
      <div className="flex justify-end">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Comment
        </button>
      </div>

      {/* Drawer for adding a comment */}
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          resetForm();
        }}
        title="Add Comment"
      >
        {/* Simple form layout */}
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Comment title"
              ref={titleRef}
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
              rows={4}
              placeholder="Write your comment..."
              ref={descriptionRef}
              required
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Labels multi-select */}
          <div>
            <label className="block text-sm font-medium mb-1">Labels</label>
            <TagMultiSelect
              allLabels={labels}
              selected={selectedLabelIds}
              onToggle={toggleLabel}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-md border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1 text-sm hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </Drawer>

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
