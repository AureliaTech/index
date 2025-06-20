import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/funds/$name/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/funds/$name/dashboard"!</div>
}
