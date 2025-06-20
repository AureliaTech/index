import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/funds/$name/key-info')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/funds/$name/key-info"!</div>
}
