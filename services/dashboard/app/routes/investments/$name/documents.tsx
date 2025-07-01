import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Plus, ChevronDown } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

const getDocumentsData = createServerFn({ method: "GET" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const documents = JSON.parse(raw)["documents"];
      
      const rows = documents.rows;
      const headers = documents.headers;
      return { rows, headers };
    } catch (error) {
      return { error: "No data found" };
    }
  });

export const Route = createFileRoute("/investments/$name/documents")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getDocumentsData({ data: { name: params.name } });
  },
});

interface DocRow {
  id: string;
  name: string;
  owner: string;
  modified: string; // ISO date
}

function RouteComponent() {
  const { rows, headers, error } = Route.useLoaderData() as {
    rows: DocRow[];
    headers: { id: string; label: string }[];
    error: string | null;
  };
  if (error) {
    return <div>Error loading documents data</div>;
  }
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
            {rows.map((doc: DocRow) => (
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
