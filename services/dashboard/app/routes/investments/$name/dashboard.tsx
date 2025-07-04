import { createFileRoute } from "@tanstack/react-router";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

Chart.register(...registerables);

const getDashboardData = createServerFn({ method: "GET" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const data = await fs.readFile(filePath, "utf8");
      const dashboard = JSON.parse(data)["dashboard"];
      return { dashboard };
    } catch (error) {
      return {
        error: "No data found",
      };
    }
  });

export const Route = createFileRoute("/investments/$name/dashboard")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getDashboardData({ data: { name: params.name } });
  },
});

function RouteComponent() {
  const { name } = Route.useParams();
  const { dashboard, error } = Route.useLoaderData();
  
  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  const netDebtData = {
    labels: dashboard?.netDebt?.labels ?? [],
    datasets: [
      {
        label: "Net Debt",
        data: dashboard?.netDebt?.values ?? [],
        borderColor: "#93C5FD",
        backgroundColor: "rgba(147, 197, 253, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const revenueData = {
    labels: dashboard?.revenue?.labels ?? [],
    datasets: [
      {
        label: "Actual",
        data: dashboard?.revenue?.actual ?? [],
        backgroundColor: "#A5B4FC",
      },
      {
        label: "Budget",
        data: dashboard?.revenue?.budget ?? [],
        backgroundColor: "#C4B5FD",
      },
    ],
  };

  const capexData = {
    labels: dashboard?.capexInvested?.labels ?? [],
    datasets: [
      {
        label: "Capex",
        data: dashboard?.capexInvested?.values ?? [],
        backgroundColor: "rgba(167, 243, 208, 0.2)",
        borderColor: "#6EE7B7",
        fill: true,
      },
    ],
  };

  const operatingChargesData = {
    labels: dashboard?.operatingChargesByGeography?.labels ?? [],
    datasets: [
      {
        data: dashboard?.operatingChargesByGeography?.values ?? [],
        backgroundColor: ["#93C5FD", "#A5B4FC", "#C4B5FD", "#6EE7B7"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize mb-4">{name}</h1>
      {/* Filters */}
      <div className="mb-6 flex gap-4 ">
        <select
          className="border rounded-full p-2 pr-8 border-neutral-200 dark:border-neutral-700"
          defaultValue="monthly"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
        <select
          className="border rounded-full p-2 border-neutral-200 dark:border-neutral-700"
          defaultValue="last-year"
        >
          <option value="last-year">Last Year</option>
          <option value="last-2-years">Last 2 Years</option>
          <option value="last-5-years">Last 5 Years</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Net Debt */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
          <h3 className="mb-4 text-lg font-semibold">Net Debt</h3>
          <Line
            data={netDebtData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Revenue */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
          <Bar
            data={revenueData}
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

        {/* Capex Invested */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">Capex Invested</h3>
          <Line
            data={capexData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Operating Charges by Geography */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 max-h-fit">
          <h3 className="mb-4 text-lg font-semibold">
            Operating Charges by Geography
          </h3>
          <Doughnut
            data={operatingChargesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "right",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
