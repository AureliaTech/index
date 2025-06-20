import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/investments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
  <h1 className="text-2xl font-semibold capitalize">Investments List</h1>
  <div className="mt-4 space-y-2">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-lg animate-pulse">
        <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 flex items-center gap-4">
          <div className="h-6 w-1/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-6 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
        <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    ))}
  </div>

  <div className="mt-4 flex justify-end">
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
    </div>
  </div>
  </div>
}
