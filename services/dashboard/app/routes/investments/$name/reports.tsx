import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Plus, ChevronDown } from "lucide-react";
import React, { useState, Fragment } from "react";
import * as fs from "node:fs/promises";

export const Route = createFileRoute("/investments/$name/reports")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getReportsData({ data: { name: params.name } });
  },
});

interface ChildReport {
  id: string;
  title: string;
}

interface ReportRow {
  id: string;
  name: string;
  owner: string;
  modified: string; // ISO date string
  children?: ChildReport[];
}

const reports: ReportRow[] = [
  {
    id: "q1-2025",
    name: "Q1 2025",
    owner: "Financial Inc",
    modified: "2025-04-04",
    children: [
      {
        id: "q1-2025-quarterly",
        title: "Fastned - Quarterly Report 31 March 25",
      },
      {
        id: "q1-2025-monthly",
        title: "Fastned - Monthly Report 31 March 25",
      },
    ],
  },
  {
    id: "fy-2024",
    name: "FY 2024",
    owner: "Financial Inc",
    modified: "2024-11-15",
  },
  {
    id: "q4-2024",
    name: "Q4 2024",
    owner: "Financial Inc",
    modified: "2024-05-20",
  },
  {
    id: "q3-2024",
    name: "Q3 2024",
    owner: "Financial Inc",
    modified: "2024-04-22",
  },
  {
    id: "q2-2024",
    name: "Q2 2024",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "q1-2024",
    name: "Q1 2024",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "fy-2023",
    name: "FY 2023",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "q4-2023",
    name: "Q4 2023",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "q3-2023",
    name: "Q3 2023",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "q2-2023",
    name: "Q2 2023",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "q1-2023",
    name: "Q1 2023",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
  {
    id: "fy-2022",
    name: "FY 2022",
    owner: "Financial Inc",
    modified: "2024-03-11",
  },
];

const getReportsData = createServerFn({ method: "GET" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const rows = JSON.parse(raw)["reports"]["rows"];
      const headers = JSON.parse(raw)["reports"]["headers"];
      return { rows, headers };
    } catch (error) {
      return { error: "No data found" };
    }
  });

function RouteComponent() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { rows, headers, error } = Route.useLoaderData() as {
    rows: ReportRow[];
    headers: { id: string; label: string }[];
    error: string | null;
  };

  if (error) {
    return <div>Error loading reports data</div>;
  }

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative flex-1 p-4">
      {/* Header controls */}
      <div className="mb-4 flex justify-end">
        <button className="flex items-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700  hover:cursor-pointer">
          <Plus className="h-4 w-4" />
          Create Report
        </button>
      </div>

      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header.id} className="sticky left-0 top-0 z-30 w-56 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((report) => (
              <Fragment key={report.id}>
                <tr>
                  <td
                    className="sticky left-0 z-20 w-56 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer"
                    onClick={() => toggle(report.id)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openId === report.id ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      {report.name}
                    </div>
                  </td>
                  <td className="w-48 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center">
                    {report.owner}
                  </td>
                  <td className="w-40 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center whitespace-nowrap">
                    {Intl.DateTimeFormat("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    }).format(new Date(report.modified))}
                  </td>
                  <td className="w-32 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center" />
                </tr>

                {openId === report.id &&
                  report.children?.map((child) => (
                    <tr key={child.id}>
                      <td className="sticky left-0 z-10 max-w-40 bg-white dark:bg-neutral-800 py-3 px-8 border-b border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                        <a
                          href="#"
                          className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {child.title}
                        </a>
                      </td>
                      <td className="w-48 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4" />
                      <td className="w-40 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4" />
                      <td className="w-32 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center">
                        <button className="rounded-md border px-4 py-1 text-sm border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700  hover:cursor-pointer">
                          View or Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
