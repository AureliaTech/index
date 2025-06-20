import { createFileRoute, ReactNode, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/investments')({
  component: Outlet,
  beforeLoad: ({ params, search }) => {
    return {
      breadcrumb: "Investments"
    }
  }
})
