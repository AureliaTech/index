import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/investments/$name/investment-summary')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="mb-6">
        <span className="text-6xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Investment Summary is under construction!</h1>
      <p className="text-gray-600 mb-2">
        Our team of highly caffeinated developers is working really hard
      </p>
      <p className="text-gray-600 mb-4">
        to build something amazing for you...
      </p>
      <div className="animate-bounce">
        <span className="text-4xl">☕</span>
      </div>
    </div>
  )
}
