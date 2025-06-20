import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/funds')({
  beforeLoad: ({ params, search }) => {
    return {
      breadcrumb: "Funds"
    }
  },
  component: Outlet,
})
