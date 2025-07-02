import { createFileRoute, Link, Outlet, useMatches } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

interface Card {
  label: string
  description: string
  to: string
}

function CardLink({ label, description, to }: Card) {
  return (
    <Link
      to={to as any}
      className="flex flex-col gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
    >
      <span className="text-base font-medium leading-none">{label}</span>
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </span>
    </Link>
  )
}

function SettingsPage() {
  const identityCards: Card[] = [
    {
      label: 'Users & Permissions',
      description: 'Manage roles, invites and user access control',
      to: '/settings/users',
    },
    {
      label: 'Roles',
      description: 'Define permission sets for your team',
      to: '/settings/roles',
    },
    {
      label: 'Audit Logs',
      description: 'View a chronological log of important account activity',
      to: '/settings/audit-logs',
    },
  ]

  const investmentCards: Card[] = [
    {
      label: 'Funds',
      description: 'Create, close or edit investment funds',
      to: '/settings/funds',
    },
    {
      label: 'Portfolio Companies',
      description: 'Manage portfolio company metadata',
      to: '/settings/portfolio-companies',
    },
    {
      label: 'Deal Team Highlights',
      description: 'Configure labels & highlights available to deal teams',
      to: '/settings/investments',
    },
  ]

  const billingCards: Card[] = [
    {
      label: 'Plan, Usage & Quota Limits',
      description: 'Monitor usage and upgrade plans',
      to: '/settings/billing',
    },
    {
      label: 'Invoices',
      description: 'Download invoice history',
      to: '/settings/billing',
    },
    {
      label: 'Payment Methods',
      description: 'Update and manage cards on file',
      to: '/settings/billing',
    },
  ]

  const preferenceCards: Card[] = [
    {
      label: 'Profile',
      description: 'Edit your name and contact information',
      to: '/settings/profile',
    },
    {
      label: 'Security',
      description: 'Change password and enable two-factor authentication',
      to: '/settings/security',
    },
    {
      label: 'Favorites',
      description: 'Manage your personal list of favorites',
      to: '/settings/notifications',
    },
    {
      label: 'Notifications',
      description: 'Choose when and how we notify you',
      to: '/settings/notifications',
    },
    {
      label: 'Label Manager',
      description: 'Create custom labels for investments & funds',
      to: '/settings/labels',
    },
    {
      label: 'Theming',
      description: 'Personalise your dashboard appearance',
      to: '/settings/theming',
    },
  ]

  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const isOverview = leaf.routeId === "/settings";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-prose">
          Configure every aspect of your organisation and personal preferences
          in one place.
        </p>
      </header>

      {isOverview && (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Organization Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Identity &amp; Access Management
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {identityCards.map((card) => (
                    <CardLink key={card.label} {...card} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Investment Management
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investmentCards.map((card) => (
                    <CardLink key={card.label} {...card} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Billing
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {billingCards.map((card) => (
                    <CardLink key={card.label} {...card} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium">User Preferences</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preferenceCards.map((card) => (
                <CardLink key={card.label} {...card} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Nested settings pages will render here */}
      <Outlet />
    </div>
  )
}
