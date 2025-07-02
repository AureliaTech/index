import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

// Registrar componentes de chart.js una sola vez
Chart.register(...registerables);

/* --------------------------- loader: lee el JSON -------------------------- */
const getFund = createServerFn({ method: "GET" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const file = `app/data/${name}/general-data.json`;
    try {
      const json = JSON.parse(await fs.readFile(file, "utf8"))["dashboard"];
      return json;
    } catch {
      return { error: "No data found" };
    }
  });

export const Route = createFileRoute("/funds/$name/dashboard")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { name } = params;
    return await getFund({ data: { name } });
  },
});

function RouteComponent() {
  const fund = Route.useLoaderData();

  if (fund?.error) {
    return <div className="p-4 text-red-500">{fund.error}</div>;
  }

  const m = fund.metrics;
  const metrics: { label: string; value: string | number }[] = [
    { label: "Investment year", value: m.investmentYear },
    {
      label: "Capital committed",
      value: `${m.unit}${m.capitalCommitedMillions.toFixed(1)} M`,
    },
    {
      label: "Capital invested",
      value: `${m.unit}${m.capitalInvestedMillions.toFixed(1)} M`,
    },
    {
      label: "Realized value",
      value: `${m.unit}${m.realizedValueMillions.toFixed(1)} M`,
    },
    {
      label: "Unrealized value",
      value: `${m.unit}${m.unrealizedValueMillions.toFixed(1)} M`,
    },
    {
      label: "Total value",
      value: `${m.unit}${m.totalValueMillions.toFixed(1)} M`,
    },
    { label: "Current investments", value: m.currentInvestments },
    { label: "Realized investments", value: m.realizedInvestments },
    { label: "Net IRR", value: m.netIrr },
    { label: "Net MoIC", value: m.netMoic },
    { label: "Gross IRR", value: m.grossIrr },
    { label: "Gross MoIC", value: m.grossMoic },
  ];

  const charts = fund.charts;

  return (
    <div className="p-4">
      {/* ----------- encabezado ----------- */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold capitalize">{fund.name}</h1>
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

      {/* ----------- grid de métricas ----------- */}
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

      {/* ----------- gráficos fila 1 ----------- */}
      <div className="grid grid-cols-2 gap-6">
        {/* Capital por año */}
        <ChartCard title="Invested capital by year (€ million)">
          <Bar
            data={{
              labels: charts.investedCapitalByYear.labels,
              datasets: [
                {
                  label: "Invested capital",
                  data: charts.investedCapitalByYear.data,
                  backgroundColor: "#93C5FD",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </ChartCard>

        {/* Capital por región */}
        <ChartCard title="Invested capital by region">
          <Doughnut
            data={{
              labels: charts.investedCapitalByRegion.labels,
              datasets: [
                {
                  data: charts.investedCapitalByRegion.data,
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
              plugins: { legend: { position: "top" } },
            }}
          />
        </ChartCard>
      </div>

      {/* ----------- gráficos fila 2 ----------- */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Capital por sector */}
        <ChartCard title="Invested capital by sector">
          <Doughnut
            data={{
              labels: charts.investedCapitalBySector.labels,
              datasets: [
                {
                  data: charts.investedCapitalBySector.data,
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
              plugins: { legend: { position: "right" } },
            }}
          />
        </ChartCard>

        {/* Capital por tipo */}
        <ChartCard title="Invested capital by type">
          <Doughnut
            data={{
              labels: charts.investedCapitalByType.labels,
              datasets: [
                {
                  data: charts.investedCapitalByType.data,
                  backgroundColor: ["#7EA2F1", "#C4B5FD"],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "right" } },
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
