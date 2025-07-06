import { createFileRoute, redirect } from "@tanstack/react-router"


export const Route = createFileRoute('/mobile/')({
    component: () => null,
    loader: async ({ params }) => {
      return redirect({
        to: `/mobile/new-dth`,
      })
    },
  })