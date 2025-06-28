import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/funds/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold capitalize">Funds List</h1>
        <Link
          to="/funds/new"
          className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Fund
        </Link>
      </div>
    </div>
  );
}
