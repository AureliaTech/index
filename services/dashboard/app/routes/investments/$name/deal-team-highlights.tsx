import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/investments/$name/deal-team-highlights')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deal Team Highlights</h2>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create New Log
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="rounded border p-2">
          <option>All Types</option>
          <option>Meetings</option>
          <option>Updates</option>
          <option>Decisions</option>
        </select>
        <select className="rounded border p-2">
          <option>All Authors</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
        </select>
        <input 
          type="date" 
          className="rounded border p-2"
          placeholder="Date range"
        />
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {/* Message Item */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Board Meeting Summary</h3>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          <p className="mb-3 text-gray-600">
            Discussed Q4 performance and strategic initiatives for 2024. Key decisions made regarding market expansion.
          </p>
          <div className="mb-3 flex gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">Meeting</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">Board</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By John Doe</span>
            <span>3 comments</span>
          </div>
        </div>

        {/* Message Item */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Financial Update</h3>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
          <p className="mb-3 text-gray-600">
            Monthly financial report shows 15% growth in revenue. New customer acquisition targets exceeded.
          </p>
          <div className="mb-3 flex gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">Update</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">Finance</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By Jane Smith</span>
            <span>1 comment</span>
          </div>
        </div>

        {/* Message Item */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Strategic Decision</h3>
            <span className="text-sm text-gray-500">2 weeks ago</span>
          </div>
          <p className="mb-3 text-gray-600">
            Approved the expansion into European markets. Initial focus on UK and Germany.
          </p>
          <div className="mb-3 flex gap-2">
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">Decision</span>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">Strategy</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By John Doe</span>
            <span>5 comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
