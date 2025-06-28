import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Settings</h1>
      <section>
        <h2>Organization Settings</h2>
        <p>Manage your organization's settings here.</p>
        <div>
          <h3>Identity & Access Management</h3>
          <ul>
            <li>
              <Link to="/settings/users">Users & Permissions</Link>
              {/* TODO: View by user (roles in user), View by role (users in role), grant access (invite) */}  
            </li>
            <li>
              <Link to="/settings/roles">Roles</Link>
              {/* TODO: List of roles, create role, edit role -> permissions */}
              {/* role: name, description, id, permissions */}
            </li>
            <li>
              <Link to="/settings/audit-logs">Audit Logs</Link>
              {/* TODO: List of audit logs, filter by user, action, date */}
            </li>
          </ul>
        </div>
        <div>
          <h3>Investment Management</h3>
          <ul>
            <li>
              <Link to="/settings/funds">Funds</Link>
              {/* TODO: List of funds, create fund, edit fund, close fund */}
            </li>
            <li>
              <Link to="/settings/portfolio-companies">Portfolio companies</Link>
              {/* TODO: List of portfolio companies, create portfolio company, edit portfolio company, delete portfolio company */}
            </li>
            <li>
              <Link to="/settings/investments">Deal Team Highlights</Link>
              {/* TODO: List of labels, create label, edit label, delete label, allow new labels to be created */}
            </li>
          </ul>
        </div>
        <div>
          <h3>Billing</h3>
          <ul>
            <li>
              <Link to="/settings/funds">Plan, Usage & Quota Limits</Link>
              {/* Show active plan, show billing history, upgrade plan */}
            </li>
            <li>
              <Link to="/settings/billing">Invoices</Link>
              {/* TODO: List of invoices to download */}
            </li>
            <li>
              <Link to="/settings/billing">Payment Methods</Link>
              {/* TODO: List of payment methods, add payment method, delete payment method */}
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h2>User Preferences</h2>
        <p>Manage your own preferences here.</p>
        <ul>
          <li>
            <Link to="/settings/profile">Profile</Link>
            {/* TODO: Edit name, username and password */}
          </li>
          <li>
            <Link to="/settings/security">Security</Link>
            {/* TODO: Edit password, 2FA */}
          </li>
          <li>
            <Link to="/settings/notifications">Favorites</Link>
          </li>
          <li>
            <Link to="/settings/notifications">Notifications</Link>
            {/* TODO: Edit notifications */}
          </li>
          <li>
            <Link to="/settings/labels">Label Manager</Link>
          </li>
          <li>
            <Link to="/settings/theming">Theming</Link>
            {/* TODO: Edit theme */}
          </li>
        </ul>
      </section>
    </div>
  )
}
