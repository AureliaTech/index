import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/funds/$name/')({
  component: () => null,
  loader: async ({ params }) => {
    return redirect({
      to: `/funds/$name/dashboard`,
      params: { name: params.name },
    })
  },
})
