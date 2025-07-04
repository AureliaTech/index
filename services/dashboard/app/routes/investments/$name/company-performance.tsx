import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Check,
  MessageCircleQuestion,
} from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

const getCompanyPerformance = createServerFn({ method: "GET" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/company-performance/data.json`;

    try {
      const companyPerformanceDataRaw = JSON.parse(
        await fs.readFile(filePath, "utf8")
      );

      const headers = companyPerformanceDataRaw.headers;

      const rows = companyPerformanceDataRaw.rows;

      const validatedDates = companyPerformanceDataRaw.validatedDates;

      return { headers, rows, validatedDates };
    } catch (error) {
      return {
        error: "No data found",
      };
    }
  });

export const Route = createFileRoute("/investments/$name/company-performance")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { name } = params;
    return await getCompanyPerformance({ data: { name } });
  },
});

function RouteComponent() {
  const { name: companyName } = Route.useParams();
  const { rows, validatedDates, headers, error } = Route.useLoaderData();

  if (error) {
    return <div>No data</div>;
  }

  const navigate = Route.useNavigate();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  /**
   * Contains a bug, when making screen smaller, the table doesn't resize.
   */
  useEffect(function updateWidth() {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex-1 p-4" ref={wrapperRef}>
      {error ? (
        <div>No data</div>
      ) : (
        <>
          <div className="flex justify-between mb-10 items-center">
            {/* Filters */}
            <div className=" flex gap-4 ">
              <select
                className="border rounded-full p-2  text-sm border-neutral-200 dark:border-neutral-700"
                defaultValue="monthly"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
              <select
                className="border rounded-full p-2 text-sm border-neutral-200 dark:border-neutral-700"
                defaultValue="last-year"
              >
                <option value="last-year">Last Year</option>
                <option value="last-2-years">Last 2 Years</option>
                <option value="last-5-years">Last 5 Years</option>
              </select>
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <button className=" bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
                <MessageCircleQuestion className="w-4 h-4" />
                Q&A
              </button>
              <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
                <ArrowDownToLine className="w-4 h-4" />
                Download
              </button>
              <Link
                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer"
                to="/investments/$name/company-performance/new"
                params={{ name: companyName }}
              >
                <ArrowUpToLine className="w-4 h-4" />
                Upload
              </Link>
            </div>
          </div>
          <div
            className="w-96 overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700"
            style={{ width }}
          >
            <table className="w-full border-collapse rounded-lg text-sm">
              {/* HEADER */}
              <thead>
                <tr>
                  <th className="sticky left-0 top-0 z-30 min-w-56 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold" />
                  <th className="sticky left-56 z-20 min-w-40 border-r bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-right font-semibold">
                    Units
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="sticky top-0 z-10 min-w-32 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-right font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
                {/* VALIDATED ROW */}
                <tr>
                  <th className="sticky left-0 z-30 min-w-56 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-left font-medium">
                    Validated
                  </th>
                  <th className="sticky left-56 z-10 min-w-40 border-b border-r border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4" />
                  {validatedDates.map((d, i) => {
                    const dateObj = new Date(d);
                    const isValid = d && !isNaN(dateObj.getTime());

                    return (
                      <th
                        key={i}
                        className="min-w-32 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-right font-semibold"
                      >
                        {isValid ? (
                          <span className="inline-flex items-center gap-1 rounded bg-green-500/25 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-800/50 dark:text-green-300">
                            <Check className="h-3 w-3" />
                            {Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "2-digit",
                            }).format(dateObj)}
                          </span>
                        ) : (
                          <button className="rounded border px-3 py-1 text-xs">
                            Validate
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {/* BODY */}
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="sticky left-0 z-20 min-w-56 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-left whitespace-nowrap border-b border-neutral-200 dark:border-neutral-700">
                      {row.name}
                    </td>
                    <td className="sticky left-56 z-10 min-w-40 border-b border-r border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap bg-neutral-50 dark:bg-neutral-900 font-semibold">
                      {row.units}
                    </td>
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="min-w-32 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap"
                      >
                        {row.values[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
}
