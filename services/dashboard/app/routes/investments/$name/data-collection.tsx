import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/investments/$name/data-collection")({
  component: RouteComponent,
});

interface DataRow {
  id: string;
  name: string;
  file: string;
  submittedBy: string;
  submittedAt: string; // ISO date-time string
}

const dataRows: DataRow[] = [
  {
    id: "row-1",
    name: "Fastned - Financial and operational information 31 March 2025",
    file: "External_ReportingMar25.xls",
    submittedBy: "Mariana Lopez Briales",
    submittedAt: "2025-04-02T22:30:00",
  },
  {
    id: "row-2",
    name: "Fastned - Quarterly Valuation 31 March 2025",
    file: "Valuation_Mar25.xls",
    submittedBy: "Mariana Lopez Briales",
    submittedAt: "2025-04-15T08:30:00",
  },
  {
    id: "row-3",
    name: "Fastned - Financial and operational information 28 February 2025",
    file: "External_ReportingFeb25.xls",
    submittedBy: "Mónica Gomez Acebo",
    submittedAt: "2025-03-08T15:45:00",
  },
  {
    id: "row-4",
    name: "Fastned - Financial and operational information 31 January 2025",
    file: "External_ReportingJan25.xls",
    submittedBy: "Mónica Gomez Acebo",
    submittedAt: "2025-02-08T15:30:00",
  },
  {
    id: "row-5",
    name: "Fastned - Quarterly Valuation 31 December 2024",
    file: "Valuation_Dec24.xls",
    submittedBy: "Mariana Lopez Briales",
    submittedAt: "2025-02-02T12:30:00",
  },
  {
    id: "row-6",
    name: "Fastned - Financial and operational information 31 December 2024",
    file: "External_ReportingDec24.xls",
    submittedBy: "Mónica Gomez Acebo",
    submittedAt: "2025-01-15T11:25:00",
  },
];

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
  return (
    <div className="relative flex-1 p-4">
      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-[40%] bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold">
                Name
              </th>
              <th className="sticky top-0 z-10 w-[20%] border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                File name
              </th>
              <th className="sticky top-0 z-10 w-[20%] border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                Submitted by
              </th>
              <th className="sticky top-0 z-10 w-[15%] border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold whitespace-nowrap">
                Last submission date
              </th>
              <th className="sticky top-0 z-10 w-[10%] border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row) => (
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
