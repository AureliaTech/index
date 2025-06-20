import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Aurelia AI!</div>
}
