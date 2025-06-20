import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/funds/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Founds index!</div>
}
