import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Check,
  CheckCircle,
  MessageCircleQuestion,
} from "lucide-react";

export const Route = createFileRoute("/investments/$name/company-performance")({
  component: RouteComponent,
});

function RouteComponent() {
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
      {/* <div className="absolute inset-0 top-0 bottom-0 left-0 right-0 overflow-scroll">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 z-10 border border-gray-200 bg-gray-50 p-2 text-left font-semibold w-48">
              </th>
              {Array.from({ length: 24 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (23 - i));
                return (
                  <th key={i} className="sticky top-0 z-10 border border-gray-200 bg-gray-50 p-2 text-center font-semibold">
                    {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Revenue', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000000) + 500000) },
              { label: 'Cost of Goods Sold', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 600000) + 300000) },
              { label: 'Gross Profit', values: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 400000) + 200000) },
              { label: 'Operating Expenses', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200000) + 100000) },
              { label: 'EBITDA', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 300000) + 150000) },
              { label: 'Depreciation & Amortization', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50000) + 25000) },
              { label: 'Operating Income', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 250000) + 125000) },
              { label: 'Interest Expense', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30000) + 15000) },
              { label: 'Income Before Tax', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 220000) + 110000) },
              { label: 'Income Tax Expense', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50000) + 25000) },
              { label: 'Net Income', values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 170000) + 85000) },
            ].map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="sticky left-0 z-10 border border-gray-200 bg-inherit p-2 font-medium">
                  {row.label}
                </td>
                {row.values.map((value, colIndex) => (
                  <td key={colIndex} className="border border-gray-200 p-2 text-right">
                    ${value.toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="flex justify-end mb-4 gap-2">
        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
          <MessageCircleQuestion className="w-4 h-4" />
          Q&A
        </button>
        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
          <ArrowDownToLine className="w-4 h-4" />
          Download
        </button>
        <button className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer">
          <ArrowUpToLine className="w-4 h-4" />
          Upload
        </button>
      </div>
      <div
        className="w-96 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-auto"
        style={{ width }}
      >
        <table className="rounded-lg border border-neutral-200 dark:border-neutral-700 border-collapse">
          <thead>
            <tr>
              <div className="sticky left-0 top-0 z-30">
                <th className="sticky left-0 top-0 z-30 min-w-40 py-3 px-4 text-sm text-left bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold"></th>
                <th className="sticky top-0 z-10 min-w-40 py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Units
                </th>
              </div>

              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700 py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 12))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 11))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 10))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 9))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 8))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 7))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 6))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 5))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 4))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 3))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 2))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 1))}
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-l border-neutral-200 dark:border-neutral-700  py-3 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                {Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "2-digit",
                }).format(new Date().setMonth(new Date().getMonth() - 0))}
              </th>
            </tr>
            <tr>
              <div className="sticky left-0 top-0 z-30">
                <th className="sticky left-0 top-0 z-30 min-w-40 border-b border-neutral-700 dark:border-neutral-200 py-3 px-4 text-sm text-left bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-medium">
                  Validated
                </th>
                <th className="sticky left-0 top-0 z-10 min-w-40 border-b border-neutral-700 dark:border-neutral-200 py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold"></th>
              </div>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200 py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
              <th className="sticky top-0 z-10 min-w-24 border-b border-neutral-700 dark:border-neutral-200  py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold">
                <span className="gap-2 bg-green-500/25 dark:bg-green-800/50 rounded w-2 h-2 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300">
                  <Check className="w-3 h-3 inline mr-1 stroke-4" />
                  {Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                    day: "2-digit",
                  }).format(new Date("2025-04-04"))}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {companyPerformanceData.map((data) => (
              <tr key={data.id}>
                <div className="sticky left-0 z-20">
                  <td className="min-w-40 text-sm text-left border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap bg-neutral-50 dark:bg-neutral-900">
                    {data.name}
                  </td>
                  <th className="min-w-40 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-sm text-right bg-neutral-50 dark:bg-neutral-900 whitespace-nowrap font-semibold"></th>
                </div>
                <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  0
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const companyPerformanceData = [
  {
    id: "p&l",
    name: <span className="font-semibold underline">Profit & Loss</span>
  },
  {
    id: "p&l-breakdown-0",
    name: "Revenues related to charging",
    units: "EUR thousand",
  },
  {
    id: "p&l-breakdown-1",
    name: "Cost of electricity",
    units: "EUR thousand",
  },
  {
    id: "p&l-breakdown-2",
    name: <span className="font-semibold">Gross Profit</span>,
    units: "EUR thousand",
  },
  {
    id: "p&l-breakdown-3",
    name: "Gross Profit Margin",
    units: "%",
  },
  {
    id: "balance-sheet",
    name: <span className="font-semibold underline">Balance Sheet</span>
  },
  {
    id: "cash-flow",
    name: <span className="font-semibold underline">Cash Flow</span>
  },
];
