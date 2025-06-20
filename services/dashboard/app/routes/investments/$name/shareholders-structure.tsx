import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/investments/$name/shareholders-structure"
)({
  component: RouteComponent,
});

interface ShareholderRow {
  id: string;
  shareholder: string;
  indirectOwner: string;
  year: number;
  ownership: string; // e.g. "50.01%"
}

const rows: ShareholderRow[] = [
  {
    id: "row-1",
    shareholder: "Pontegada Inversiones S.L.",
    indirectOwner: "Amancio Ortega Gaona",
    year: 2020,
    ownership: "50.01%",
  },
  {
    id: "row-2",
    shareholder: "Partler Participaciones S.L.U",
    indirectOwner: "Amancio Ortega Gaona",
    year: 2020,
    ownership: "15.00%",
  },
  {
    id: "row-3",
    shareholder: "Financial Inc.",
    indirectOwner: "Financial Inc. G.P",
    year: 2023,
    ownership: "34.99%",
  },
];

function RouteComponent() {
  return (
    <div className="p-4">
      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-40 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-left font-semibold">
                Shareholder
              </th>
              <th className="sticky top-0 z-10 w-48 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold whitespace-nowrap">
                Indirect Owner
              </th>
              <th className="sticky top-0 z-10 w-32 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold whitespace-nowrap">
                Year of Acquisition
              </th>
              <th className="sticky top-0 z-10 w-28 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold whitespace-nowrap">
                % Ownership
              </th>
              <th className="sticky top-0 z-10 w-32 border-l border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td className="sticky left-0 z-20 w-40 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-left whitespace-nowrap border-b border-neutral-200 dark:border-neutral-700">
                  {row.shareholder}
                </td>
                <td className="w-28 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {row.indirectOwner}
                </td>
                <td className="w-28 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {row.year}
                </td>
                <td className="w-28 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-right whitespace-nowrap">
                  {row.ownership}
                </td>
                <td className="w-28 border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 text-center whitespace-nowrap">
                  <button className=" w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:cursor-pointer">
                    Edit
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
