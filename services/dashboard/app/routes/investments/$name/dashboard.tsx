import { createFileRoute } from '@tanstack/react-router'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export const Route = createFileRoute('/investments/$name/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { name } = Route.useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize mb-4">{name}</h1>
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="rounded border p-2" defaultValue="monthly">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
        <select className="rounded border p-2" defaultValue="last-year">
          <option value="last-year">Last Year</option>
          <option value="last-2-years">Last 2 Years</option>
          <option value="last-5-years">Last 5 Years</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Net Debt */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Net Debt</h3>
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Net Debt',
                data: [1000000, 950000, 900000, 850000, 800000, 750000],
                borderColor: '#93C5FD',
                backgroundColor: 'rgba(147, 197, 253, 0.1)',
                tension: 0.1,
                fill: true
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>

        {/* Revenue */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Actual',
                  data: [500000, 550000, 600000, 580000, 620000, 650000],
                  backgroundColor: '#A5B4FC'
                },
                {
                  label: 'Budget',
                  data: [480000, 520000, 580000, 600000, 610000, 640000],
                  backgroundColor: '#C4B5FD'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top'
                }
              }
            }}
          />
        </div>

        {/* Capex Invested */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Capex Invested</h3>
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Capex',
                data: [200000, 250000, 300000, 280000, 320000, 350000],
                backgroundColor: 'rgba(167, 243, 208, 0.2)',
                borderColor: '#6EE7B7',
                fill: true
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>

        {/* Operating Charges by Geography */}
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Operating Charges by Geography</h3>
          <Doughnut
            data={{
              labels: ['North America', 'Europe', 'Asia', 'Other'],
              datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                  '#93C5FD',
                  '#A5B4FC',
                  '#C4B5FD',
                  '#6EE7B7'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
