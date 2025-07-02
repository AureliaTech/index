import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

const getInvestments = createServerFn({ method: "GET" })
  .validator((data: { fundId: string }) => data)
  .handler(async ({ data: { fundId } }) => {
    const file = `app/data/${fundId}/general-data.json`;
    try {
      return JSON.parse(await fs.readFile(file, "utf8"))["investments"];
    } catch {
      return { rows: [], error: "No data found" };
    }
  });

export const Route = createFileRoute("/funds/$name/investments")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { name } = params;
    return await getInvestments({ data: { fundId: name } });
  },
});

/* ----------------------------- component -------------------------------- */
function RouteComponent() {
  const { name: fundId } = Route.useParams();
  const { rows, error } = Route.useLoaderData() as {
    rows: any[];
    error?: string;
  };

  /* medir ancho de wrapper para header pegajoso */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4" ref={wrapperRef}>
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Investments</h1>
        <div className="flex gap-2">
          <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
            <ArrowDownToLine className="w-4 h-4" />
            Download
          </button>
          <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
            <ArrowUpToLine className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* tabla */}
      <div
        className="w-96 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-auto"
        style={{ width }}
      >
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <HeaderCell sticky>Fund</HeaderCell>
            {[
              "Investment year",
              "Exit year",
              "Status",
              "Country",
              "Sector",
              "Ownership",
              "Capital committed",
              "Capital invested",
            ].map((h) => (
              <HeaderCell key={h}>{h}</HeaderCell>
            ))}
          </thead>

          <tbody>
            {rows.map((inv) => (
              <tr key={inv.id}>
                <DataCell sticky>
                  <Link
                    to="/investments/$name"
                    params={{ name: inv.id }}
                    className="underline text-blue-700 dark:text-blue-300"
                  >
                    {inv.name}
                  </Link>
                </DataCell>

                <DataCell>{inv.investmentYear}</DataCell>
                <DataCell>{inv.exitYear ?? "—"}</DataCell>
                <DataCell>{inv.status}</DataCell>
                <DataCell>{inv.country}</DataCell>
                <DataCell>{inv.sector}</DataCell>
                <DataCell>{`${inv.ownershipPct}%`}</DataCell>
                <DataCell>{inv.capitalCommitedM}</DataCell>
                <DataCell>{inv.capitalInvestedM ?? "—"}</DataCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------- helpers de celda -------------------------- */
function HeaderCell({
  children,
  sticky = false,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  const base =
    "py-2 px-4 whitespace-nowrap font-semibold bg-neutral-100 dark:bg-neutral-800";
  return (
    <th
      className={
        sticky
          ? `sticky left-0 top-0 z-30 min-w-48 ${base}`
          : `sticky top-0 z-10 min-w-32 text-right ${base}`
      }
    >
      {children}
    </th>
  );
}

function DataCell({
  children,
  sticky = false,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  const base =
    "py-3 px-4 whitespace-nowrap border-b border-neutral-200 dark:border-neutral-700";
  return (
    <td
      className={
        sticky
          ? `sticky left-0 z-20 min-w-48 text-left bg-neutral-50 dark:bg-neutral-900 ${base}`
          : `text-right ${base}`
      }
    >
      {children}
    </td>
  );
}
