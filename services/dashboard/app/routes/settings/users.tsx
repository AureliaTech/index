import { createFileRoute, Link, Outlet, useMatches } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/users')({
  component: UsersPermissionsRoute,
})

function UsersPermissionsRoute() {
  const cards = [
    {
      title: 'View by User',
      description: 'Inspect the roles and permissions assigned to each individual user.',
      href: '/settings/users/by-user',
    },
    {
      title: 'View by Role',
      description: 'Review which users belong to each role and manage membership.',
      href: '/settings/users/by-role',
    },
    {
      title: 'Grant Access',
      description: 'Invite new team-mates and assign their initial permissions.',
      href: '/settings/users/invite',
    },
  ] as const

  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const isOverview = leaf.routeId === "/settings/users";

  return (
    <div className=" space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Users &amp; Permissions
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-prose">
          Central place to manage who has access to your organisation and what
          they can do.
        </p>
      </header>

      {isOverview && (
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ title, description, href }) => (
              <Link
                key={title}
                to={href as any}
                className="flex flex-col gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <h2 className="text-lg font-medium leading-none">{title}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* nested users pages */}
      <Outlet />
    </div>
  )
} 