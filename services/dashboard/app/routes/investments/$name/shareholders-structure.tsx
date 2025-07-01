import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs/promises";

const getShareholdersStructureData = createServerFn({ method: "GET" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const shareholdersStructure = JSON.parse(raw)["shareholders-structure"];
      const rows = shareholdersStructure.rows;
      const headers = shareholdersStructure.headers;
      return { rows, headers };
    } catch (error) {
      return {
        error: "No data found",
      };
    }
  });

export const Route = createFileRoute(
  "/investments/$name/shareholders-structure"
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getShareholdersStructureData({ data: { name: params.name } });
  },
});

interface ShareholderRow {
  id: string;
  shareholder: string;
  indirectOwner: string;
  year: number;
  ownership: string; // e.g. "50.01%"
}

function RouteComponent() {
  const { rows, headers, error } = Route.useLoaderData();
  if (error) {
    return <div>Error loading shareholders structure data</div>;
  }

  const hdrs = headers as { id: keyof ShareholderRow | "actions"; label: string }[];

  return (
    <div className="p-4">
      <div className="w-full overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr>
              {hdrs.map((header) => (
                <th
                  key={header.id}
                  className="sticky left-0 top-0 z-30 w-40 bg-neutral-100 dark:bg-neutral-800 py-3 px-4 text-center font-semibold"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: ShareholderRow) => (
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
