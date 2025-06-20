import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Plus, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/investments/$name/documents")({
  component: RouteComponent,
});

interface DocRow {
  id: string;
  name: string;
  owner: string;
  modified: string; // ISO date
}

const docs: DocRow[] = [
  {
    id: "board-meeting",
    name: "Board Meeting Documentation",
    owner: "Financial Inc",
    modified: "2025-04-04",
  },
  {
    id: "transaction-dd",
    name: "Transaction Due Diligence Reports",
    owner: "Financial Inc",
    modified: "2024-11-15",
  },
  {
    id: "debt-docs",
    name: "Debt Documents",
    owner: "Financial Inc",
    modified: "2024-05-20",
  },
  {
    id: "legal-docs",
    name: "Legal Documents",
    owner: "Financial Inc",
    modified: "2024-04-22",
  },
  {
    id: "broker-reports",
    name: "Broker Reports",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
];

function RouteComponent() {
  return (
    <div className="relative flex-1 p-4">
      {/* Top right action */}
      <div className="mb-4 flex justify-end">
        <button className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:cursor-pointer">
          <Plus className="h-4 w-4" />
          Create Folder
        </button>
      </div>

      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-72 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold">
                Name
              </th>
              <th className="sticky top-0 z-10 w-48 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                Owner
              </th>
              <th className="sticky top-0 z-10 w-40 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold whitespace-nowrap">
                Last modified
              </th>
              <th className="sticky top-0 z-10 w-32 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td className="sticky left-0 z-20 w-72 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    {doc.name}
                  </div>
                </td>
                <td className="w-48 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center">
                  {doc.owner}
                </td>
                <td className="w-40 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center whitespace-nowrap">
                  {Intl.DateTimeFormat("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(doc.modified))}
                </td>
                <td className="w-32 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
