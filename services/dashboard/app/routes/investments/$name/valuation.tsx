import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpToLine, Check } from "lucide-react";

export const Route = createFileRoute("/investments/$name/valuation")({
  component: RouteComponent,
});

const headers = [
  "Q2 2024",
  "Q3 2024",
  "Q4 2024",
  "Q1 2025",
  "Previous quarter",
  "Previous year",
] as const;

type Header = (typeof headers)[number];

interface MetricRow {
  id: string;
  name: string;
  units: string;
  values: Record<Header, string | number>;
}

const metrics: MetricRow[] = [
  {
    id: "capital-committed",
    name: "Capital committed",
    units: "EUR million",
    values: {
      "Q2 2024": 100,
      "Q3 2024": 100,
      "Q4 2024": 100,
      "Q1 2025": 100,
      "Previous quarter": "-",
      "Previous year": "-",
    },
  },
  {
    id: "invested-capital",
    name: "Invested capital",
    units: "EUR million",
    values: {
      "Q2 2024": 50,
      "Q3 2024": 50,
      "Q4 2024": 50,
      "Q1 2025": 75,
      "Previous quarter": 25,
      "Previous year": 25,
    },
  },
  {
    id: "realized-investment",
    name: "Realized investment",
    units: "EUR million",
    values: {
      "Q2 2024": "-",
      "Q3 2024": "-",
      "Q4 2024": "-",
      "Q1 2025": "-",
      "Previous quarter": "-",
      "Previous year": "-",
    },
  },
  {
    id: "unrealized-investment",
    name: "Unrealized investment",
    units: "EUR million",
    values: {
      "Q2 2024": 50,
      "Q3 2024": 50,
      "Q4 2024": 50,
      "Q1 2025": 75,
      "Previous quarter": 25,
      "Previous year": 25,
    },
  },
  {
    id: "gross-irr",
    name: "Gross IRR",
    units: "%",
    values: {
      "Q2 2024": "32.0%",
      "Q3 2024": "31.0%",
      "Q4 2024": "30.0%",
      "Q1 2025": "33.0%",
      "Previous quarter": "3.0%",
      "Previous year": "1.0%",
    },
  },
  {
    id: "net-irr",
    name: "Net IRR",
    units: "%",
    values: {
      "Q2 2024": "29.0%",
      "Q3 2024": "28.0%",
      "Q4 2024": "27.0%",
      "Q1 2025": "30.0%",
      "Previous quarter": "3.0%",
      "Previous year": "1.0%",
    },
  },
  {
    id: "gross-money-multiple",
    name: "Gross money multiple",
    units: "x",
    values: {
      "Q2 2024": "5.0x",
      "Q3 2024": "4.5x",
      "Q4 2024": "4.0x",
      "Q1 2025": "5.5x",
      "Previous quarter": "1.5x",
      "Previous year": "0.5x",
    },
  },
  {
    id: "net-money-multiple",
    name: "Net money multiple",
    units: "x",
    values: {
      "Q2 2024": "4.3x",
      "Q3 2024": "3.8x",
      "Q4 2024": "3.3x",
      "Q1 2025": "4.8x",
      "Previous quarter": "1.5x",
      "Previous year": "0.5x",
    },
  },
];

function RouteComponent() {
  return (
    <div className="relative flex-1 p-4">
      <div className="flex justify-end mb-4 gap-2">
        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
          <ArrowDownToLine className="w-4 h-4" />
          Download
        </button>
        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
          <ArrowUpToLine className="w-4 h-4" />
          Upload
        </button>
      </div>

      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          {/* HEADER ROW */}
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-40 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold"></th>
              <th className="sticky top-0 z-10 w-40 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-right font-semibold">
                Units
              </th>
              {headers.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-10 w-28 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-right font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
            {/* VALIDATED ROW */}
            <tr>
              <th className="sticky left-0 z-30 w-40 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-left font-medium">
                Validated
              </th>
              <th className="sticky left-0 z-20 w-40 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4" />

              {["2024-06-15", "2024-10-21", "2025-01-13", "2025-04-04"].map(
                (date) => (
                  <th
                    key={date}
                    className="w-28 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-right font-semibold"
                  >
                    <span className="inline-flex items-center gap-1 rounded bg-green-500/25 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-800/50 dark:text-green-300">
                      <Check className="h-3 w-3" />
                      {Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "2-digit",
                      }).format(new Date(date))}
                    </span>
                  </th>
                )
              )}

              {/* empty cells for previous quarter & year */}
              <th className="w-28 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4" />
              <th className="w-28 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4" />
            </tr>
          </thead>

          {/* DATA ROWS */}
          <tbody>
            {metrics.map((row) => (
              <tr key={row.id}>
                <td className="sticky left-0 z-20 w-40 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-left whitespace-nowrap border-b border-neutral-200 dark:border-neutral-700">
                  {row.name}
                </td>
                <td className="w-40 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap bg-neutral-50 dark:bg-neutral-900 font-semibold">
                  {row.units}
                </td>
                {headers.map((h) => (
                  <td
                    key={h}
                    className="w-28 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap"
                  >
                    {row.values[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
