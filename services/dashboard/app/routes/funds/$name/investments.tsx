import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";

export const Route = createFileRoute("/funds/$name/investments")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name: fundId } = Route.useParams();

  // Track table wrapper width for sticky header sizing (same pattern as company-performance.tsx)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(function handleResize() {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Hard-coded investment rows (mirrors screenshot)
  const investments = [
    {
      id: "inditex",
      name: "Inditex",
      investmentYear: 2022,
      exitYear: "-",
      status: "Invested",
      country: "Spain",
      sector: "Retail",
      ownership: "34.99%",
      capitalCommited: 100.0,
      capitalInvested: 100.0,
    },
    {
      id: "saks",
      name: "Saks",
      investmentYear: 2019,
      exitYear: "-",
      status: "Invested",
      country: "United States",
      sector: "Retail",
      ownership: "100%",
      capitalCommited: 104.3,
      capitalInvested: 104.3,
    },
    {
      id: "mayo-clinic",
      name: "Mayo Clinic",
      investmentYear: 2019,
      exitYear: "-",
      status: "Invested",
      country: "United States",
      sector: "Healthcare",
      ownership: "45%",
      capitalCommited: 59.6,
      capitalInvested: 59.6,
    },
    {
      id: "carrefour",
      name: "Carrefour",
      investmentYear: 2021,
      exitYear: "-",
      status: "Invested",
      country: "France",
      sector: "Consumer goods",
      ownership: "100%",
      capitalCommited: 21.3,
      capitalInvested: 21.3,
    },
    {
      id: "daimler",
      name: "Daimler",
      investmentYear: 2023,
      exitYear: "-",
      status: "Invested",
      country: "Germany",
      sector: "Industrial",
      ownership: "75%",
      capitalCommited: 140.5,
      capitalInvested: 140.5,
    },
    {
      id: "altos-consulting",
      name: "Altos Consulting",
      investmentYear: 2017,
      exitYear: 2023,
      status: "Realized",
      country: "United Kingdom",
      sector: "Services",
      ownership: "100%",
      capitalCommited: 42.6,
      capitalInvested: 42.6,
    },
    {
      id: "micron-technology",
      name: "Micron Technology",
      investmentYear: 2018,
      exitYear: 2024,
      status: "Realized",
      country: "Singapor",
      sector: "Technology",
      ownership: "100%",
      capitalCommited: 34.1,
      capitalInvested: 34.1,
    },
  ];

  return (
    <div className="p-4" ref={wrapperRef}>
      {/* Header */}
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

      {/* Table */}
      <div
        className="w-96 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-auto"
        style={{ width }}
      >
        <table className="rounded-lg border border-neutral-200 dark:border-neutral-700 border-collapse min-w-full text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 min-w-48 py-3 px-4 text-left bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Fund
              </th>
              <th className="sticky top-0 z-10 min-w-32 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Investment year
              </th>
              <th className="sticky top-0 z-10 min-w-24 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Exit Year
              </th>
              <th className="sticky top-0 z-10 min-w-24 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Status
              </th>
              <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Country
              </th>
              <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Sector
              </th>
              <th className="sticky top-0 z-10 min-w-32 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Ownership
              </th>
              <th className="sticky top-0 z-10 min-w-36 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Capital Commited
              </th>
              <th className="sticky top-0 z-10 min-w-36 py-2 px-4 text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                Capital invested
              </th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id}>
                {/* Sticky first column */}
                <td className="sticky left-0 z-20 min-w-48 py-3 px-4 text-left bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                  <Link
                    to="/investments/$name"
                    params={{ name: inv.id }}
                    className="underline text-blue-700 dark:text-blue-300"
                  >
                    {inv.name}
                  </Link>
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.investmentYear}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.exitYear}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.status}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.country}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.sector}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.ownership}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.capitalCommited}
                </td>
                <td className="text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                  {inv.capitalInvested}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
