import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/investments/$name/')({
  component: () => null,
  loader: async ({ params }) => {
    return redirect({
      to: `/investments/$name/dashboard`,
      params: {
        name: params.name,
      },
    })
  },
});
