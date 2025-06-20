import { createFileRoute } from '@tanstack/react-router'

              {/* <nav className="flex items-center gap-2 flex-1 justify-end">
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/investment-summary"
                  params={{ name: "atos" }}
                >
                  Investment Summary
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/dashboard"
                  params={{ name: "atos" }}
                >
                  Dashboard
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/company-performance"
                  params={{ name: "atos" }}
                >
                  Company Performance
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/valuation"
                  params={{ name: "atos" }}
                >
                  Valuation
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/shareholders-structure"
                  params={{ name: "atos" }}
                >
                  Shareholders Structure
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/deal-team-highlights"
                  params={{ name: "atos" }}
                >
                  Deal Team Highlights
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/reports"
                  params={{ name: "atos" }}
                >
                  Reports
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/documents"
                  params={{ name: "atos" }}
                >
                  Documents
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/data-collection"
                  params={{ name: "atos" }}
                >
                  Data Collection
                </Link>
              </nav> */}

export const Route = createFileRoute('/funds/$name')({
  beforeLoad: ({ params, search }) => {
    return {
      breadcrumb: params.name,
      tabs: [
        {
          label: "Dashboard",
          to: "/funds/$name/dashboard",
          params: { name: params.name },
        },
        {
          label: "Investments",
          to: "/funds/$name/investments",
          params: { name: params.name },
        },
        {
          label: "Cash Flow",
          to: "/funds/$name/cash-flow",
          params: { name: params.name },
        },
        {
          label: "Key Info",
          to: "/funds/$name/key-info",
          params: { name: params.name },
        },
        {
          label: "Documents",
          to: "/funds/$name/documents",
          params: { name: params.name },
        },
      ],
    };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { name } = Route.useParams();

  return <div>{name}</div>
}
