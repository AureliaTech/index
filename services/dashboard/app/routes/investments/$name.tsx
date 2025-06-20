import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/investments/$name')({
  component: Outlet,
  beforeLoad: ({ params, search }) => {
    return {
      breadcrumb: params.name,
      tabs: [
        {
          label: "Investment Summary",
          to: "/investments/$name/investment-summary",
          params: { name: params.name },
        },
        {
          label: "Dashboard",
          to: "/investments/$name/dashboard",
          params: { name: params.name },
        },
        {
          label: "Company Performance",
          to: "/investments/$name/company-performance",
          params: { name: params.name },
        },
        {
          label: "Valuation",
          to: "/investments/$name/valuation",
          params: { name: params.name },
        },
        {
          label: "Shareholders Structure",
          to: "/investments/$name/shareholders-structure",
          params: { name: params.name },
        },
        {
          label: "Deal Team Highlights",
          to: "/investments/$name/deal-team-highlights",
          params: { name: params.name },
        },
        {
          label: "Reports",
          to: "/investments/$name/reports",
          params: { name: params.name },
        },
        {
          label: "Documents",
          to: "/investments/$name/documents",
          params: { name: params.name },
        },
        {
          label: "Data Collection",
          to: "/investments/$name/data-collection",
          params: { name: params.name },
        },
      ],
    }
  },
})
