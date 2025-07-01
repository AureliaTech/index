import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import React from "react";
import * as fs from "node:fs/promises";

const getDataCollectionData = createServerFn({ method: "GET" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const dataCollection = JSON.parse(raw)["data-collection"];
      const rows = dataCollection.rows;
      const headers = dataCollection.headers;
      return { rows, headers };
    } catch (error) {
      return { error: "No data found" };
    }
  });

export const Route = createFileRoute("/investments/$name/data-collection")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getDataCollectionData({ data: { name: params.name } });
  },
});

interface DataRow {
  id: string;
  name: string;
  file: string;
  submittedBy: string;
  submittedAt: string; // ISO date-time string
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function RouteComponent() {
  const { rows, headers, error } = Route.useLoaderData() as {
    rows: DataRow[];
    headers: { id: string; label: string }[];
    error: string | null;
  };

  if (error) {
    return <div>Error loading data collection data</div>;
  }

  return (
    <div className="relative flex-1 p-4">
      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.id}
                  className="sticky left-0 top-0 z-30 w-[40%] bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold border-b border-neutral-200 dark:border-neutral-700"
                >
                  {header.label}
                </th>
              ))}
            </tr>

          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="sticky left-0 z-20 w-[40%] bg-neutral-50 dark:bg-neutral-900 py-3 px-4 border-b border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="w-[20%] border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {row.file}
                </td>
                <td className="w-[20%] border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {row.submittedBy}
                </td>
                <td className="w-[15%] border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {formatDate(row.submittedAt)}
                </td>
                <td className="w-[10%] border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center">
                  <button className="rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-1 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:cursor-pointer">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
