import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Check,
  MessageCircleQuestion,
} from "lucide-react";
import { getTemplate } from "./template-config";

export const Route = createFileRoute("/investments/$name/company-performance")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { name } = params;
    return await getTemplate({ data: { name } });
  },
});

function RouteComponent() {
  const { name: companyName } = Route.useParams();

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
      {/* ---------- Company Performance Table OR Placeholder ---------- */}

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
                {validatedDates.map((d, i) => (
                  <th
                    key={i}
                    className="min-w-32 border-b border-neutral-700 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-right font-semibold"
                  >
                    <span className="inline-flex items-center gap-1 rounded bg-green-500/25 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-800/50 dark:text-green-300">
                      <Check className="h-3 w-3" />
                      {Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "2-digit",
                      }).format(new Date(d))}
                    </span>
                  </th>
                ))}
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
      <Outlet />
    </div>
  );
}

// ---------- TABLE DATA ----------

const headers = [
  "Mar-24",
  "Apr-24",
  "May-24",
  "Jun-24",
  "Jul-24",
  "Aug-24",
  "Sep-24",
  "Oct-24",
  "Nov-24",
  "Dec-24",
] as const;

type Header = (typeof headers)[number];

interface Row {
  id: string;
  name: React.ReactNode;
  units: string;
  values: Record<Header, string | number>;
}

const blankVals = headers.reduce(
  (acc, h) => ({ ...acc, [h]: "" }),
  {} as Record<Header, string>
);

const rows: Row[] = [
  {
    id: "pl-header",
    name: <span className="font-semibold underline">Profit &amp; Loss</span>,
    units: "",
    values: blankVals,
  },
  {
    id: "revenue",
    name: "Revenues related to charging",
    units: "EUR thousand",
    values: {
      "Mar-24": 5890,
      "Apr-24": 7121,
      "May-24": 5204,
      "Jun-24": 6575,
      "Jul-24": 5568,
      "Aug-24": 9541,
      "Sep-24": 6791,
      "Oct-24": 9689,
      "Nov-24": 8674,
      "Dec-24": 8610,
    },
  },
  {
    id: "cost-electricity",
    name: "Cost of electricity",
    units: "EUR thousand",
    values: {
      "Mar-24": "(1,232)",
      "Apr-24": "(1,490)",
      "May-24": "(1,089)",
      "Jun-24": "(1,376)",
      "Jul-24": "(1,165)",
      "Aug-24": "(1,996)",
      "Sep-24": "(1,421)",
      "Oct-24": "(2,027)",
      "Nov-24": "(1,815)",
      "Dec-24": "(1,800)",
    },
  },
  {
    id: "gross-profit",
    name: <span className="font-semibold">Gross Profit</span>,
    units: "EUR thousand",
    values: {
      "Mar-24": 4657,
      "Apr-24": 5631,
      "May-24": 4115,
      "Jun-24": 5119,
      "Jul-24": 4403,
      "Aug-24": 7545,
      "Sep-24": 5370,
      "Oct-24": 7661,
      "Nov-24": 6859,
      "Dec-24": 6810,
    },
  },
  {
    id: "gross-margin",
    name: <em>Gross Profit margin</em>,
    units: "%",
    values: headers.reduce(
      (acc, h) => ({ ...acc, [h]: 79 }),
      {} as Record<Header, number>
    ),
  },
  {
    id: "distribution-exp",
    name: "Distribution expenses",
    units: "EUR thousand",
    values: headers.reduce(
      (acc, h) => ({ ...acc, [h]: "(1,090)" }),
      {} as Record<Header, string>
    ),
  },
  {
    id: "marketing-exp",
    name: "Marketing & advertisement expenses",
    units: "EUR thousand",
    values: {
      "Mar-24": 193,
      "Apr-24": "(233)",
      "May-24": "(170)",
      "Jun-24": "(215)",
      "Jul-24": "(182)",
      "Aug-24": "(312)",
      "Sep-24": "(222)",
      "Oct-24": "(317)",
      "Nov-24": "(284)",
      "Dec-24": "(280)",
    },
  },
  {
    id: "personnel-exp",
    name: "Personnel expenses",
    units: "EUR thousand",
    values: headers.reduce(
      (acc, h) => ({ ...acc, [h]: "(1,390)" }),
      {} as Record<Header, string>
    ),
  },
];

const validatedDates = headers.map(() => "2025-04-04");
