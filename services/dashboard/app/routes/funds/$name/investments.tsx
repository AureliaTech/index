import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/funds/$name/investments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/funds/$name/investments"!</div>
}
