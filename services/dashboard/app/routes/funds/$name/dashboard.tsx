import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";

// Register chart.js components once
Chart.register(...registerables);

// Hard-coded fund metrics – mirrors the data shown in the reference screenshot
const fundsData = [
  {
    id: "fund-i",
    name: "Fund I",
    year: 2017,
    capitalCommited: 425.5,
    capitalInvested: 425.5,
    realizedValue: 258.0,
    unrealizedValue: 729.3,
    totalValue: 987.3,
    netIrr: "18.2%",
    netMoic: "3.1x",
    grossIrr: "22.5%",
    grossMoic: "3.5x",
    currentInvestments: 5,
    realizedInvestments: 2,
  },
  // Add other funds here if needed
];

export const Route = createFileRoute("/funds/$name/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();

  // Locate the fund using the route param; default to first item if not found
  const fund = useMemo(() => {
    return fundsData.find((f) => f.id === name) ?? fundsData[0];
  }, [name]);

  const metrics: { label: string; value: string | number }[] = [
    { label: "Investment year", value: fund.year },
    {
      label: "Capital commited",
      value: `€${fund.capitalCommited.toFixed(1)} M`,
    },
    {
      label: "Capital invested",
      value: `€${fund.capitalInvested.toFixed(1)} M`,
    },
    { label: "Realized value", value: `€${fund.realizedValue.toFixed(1)} M` },
    {
      label: "Unrealized value",
      value: `€${fund.unrealizedValue.toFixed(1)} M`,
    },
    { label: "Total value", value: `€${fund.totalValue.toFixed(1)} M` },
    { label: "Current investments", value: fund.currentInvestments },
    { label: "Realized investments", value: fund.realizedInvestments },
    { label: "Net IRR", value: fund.netIrr },
    { label: "Net MoiC", value: fund.netMoic },
    { label: "Gross IRR", value: fund.grossIrr },
    { label: "Gross MoiC", value: fund.grossMoic },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold capitalize mb-1">
            {fund.name}
          </h1>
        </div>
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

      {/* Metrics grid */}
      <div className="flex flex-wrap gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-60"
          >
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 whitespace-nowrap">
              {metric.label}
            </div>
            <div className="text-2xl text-violet-900 dark:text-violet-300">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Invested Capital by Year */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col ">
          <h3 className="mb-4 text-lg font-semibold">
            Invested capital by year (€ million)
          </h3>
          <div className="flex flex-col justify-center">
            <Bar
              className=" self-center"
              data={{
                labels: [
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021",
                  "2022",
                  "2023",
                ],
                datasets: [
                  {
                    label: "Invested capital",
                    data: [42.6, 34.1, 163.9, 0, 21.3, 100, 140.5],
                    backgroundColor: "#93C5FD",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Invested Capital by Region (Doughnut) */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">
            Invested capital by region
          </h3>
          <Doughnut
            data={{
              labels: [
                "North America",
                "Europe",
                "Asia",
                "South America",
                "Africa",
              ],
              datasets: [
                {
                  data: [48, 24, 15, 8, 5],
                  backgroundColor: [
                    "#93C5FD",
                    "#A5B4FC",
                    "#C4B5FD",
                    "#6EE7B7",
                    "#FCD34D",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Invested Capital by Sector */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">
            Invested capital by sector
          </h3>
          <Doughnut
            data={{
              labels: [
                "Industrials",
                "Retail",
                "Healthcare",
                "Services",
                "Technology",
                "Consumer goods",
              ],
              datasets: [
                {
                  data: [48, 16, 13, 10, 8, 5],
                  backgroundColor: [
                    "#647ACB",
                    "#7EA2F1",
                    "#A5B4FC",
                    "#C4B5FD",
                    "#D8CDF8",
                    "#E5E7EB",
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
              },
            }}
          />
        </div>

        {/* Invested Capital by Type */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">
            Invested capital by type
          </h3>
          <Doughnut
            data={{
              labels: ["Non-regulated", "Regulated"],
              datasets: [
                {
                  data: [86, 14],
                  backgroundColor: ["#7EA2F1", "#C4B5FD"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
