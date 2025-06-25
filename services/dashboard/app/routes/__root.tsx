// app/routes/__root.tsx
import type { ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  useMatches,
  createRootRouteWithContext,
  LinkOptions,
} from "@tanstack/react-router";
import appCss from "../styles/app.css?url";
import { Link } from "@tanstack/react-router";
import {
  PanelLeft,
  Building2,
  Star,
  Search,
  HandCoins,
  Bot,
  Settings,
  ChevronRight,
  Ellipsis,
  CircleHelp,
  CircleUser,
} from "lucide-react";
import { useState, createContext, useContext, useEffect, Fragment } from "react";
import * as fs from "node:fs/promises";
import { useRouter } from "@tanstack/react-router";
import logo from "../assets/aurelia-logo.png?url";
import { createServerFn } from "@tanstack/react-start";

const getMenuData = createServerFn({
  method: "GET",
}).handler(async () => {
  const investments = JSON.parse(
    await fs.readFile("app/data/investments.json", "utf8"),
  );
  const funds = JSON.parse(await fs.readFile("app/data/funds.json", "utf8"));
  const favoritesRaw = JSON.parse(
    await fs.readFile("app/data/favorites.json", "utf8"),
  );

  console.log(favoritesRaw);
  console.log(investments);

  const favorites = favoritesRaw.map(({ id, type }) => ({
    id,
    name:
      type === "investment"
        ? investments.find((investment) => investment.id === id)?.name
        : funds.find((fund) => fund.id === id)?.name,
  }));
  console.log(favorites);

  return { investments, funds, favorites };
});

export const Route = createRootRouteWithContext<{
  breadcrumb?: string;
  tabs?: (LinkOptions & { label: string })[];
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  // loaderDeps: () => ({}),
  // // staleTime: 60_000 * 5,
  // staleTime: Infinity,
  gcTime: 0,
  shouldReload: false,
  loader: async () => {
    return getMenuData();
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

// IsCollapsed
const MenuContext = createContext({
  isCollapsed: false,
  isTransitioning: false,
});

function Wrapper({ children }: { children?: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(
    function updateTransitioning() {
      setIsTransitioning(true);

      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timeout);
    },
    [isCollapsed],
  );

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-64"} bg-neutral-100 dark:bg-neutral-800 overflow-y-auto no-scrollbar transition-all duration-300`}
    >
      <nav className="flex flex-col gap-1 p-3 h-full">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          <button
            className={`text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white ${isCollapsed ? "hidden" : ""}`}
          >
            Financial Inc.
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
        {/* <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" /> */}
        <MenuContext value={{ isCollapsed, isTransitioning }}>
          {children}
        </MenuContext>
      </nav>
    </aside>
  );
}

interface ItemProps {
  children?: React.ReactNode;
  icon?: React.ElementType;
  to: string;
  collapsable?: boolean;
  exact?: boolean;
}

function Item({
  children,
  icon,
  to,
  collapsable,
  exact = true,
}: ItemProps) {
  const IconComponent = icon;
  const { isCollapsed, isTransitioning } = useContext(MenuContext);

  if (!collapsable && isCollapsed) return null;
  if (isTransitioning)
    return (
      <div className="flex gap-2 p-2 rounded-md animate-pulse">
        {IconComponent ? (
          <>
            <div className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
          </>
        ) : (
          <div className="ml-6 h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
        )}
      </div>
    );

  return (
    <Link
      to={to}
      className={`flex gap-2 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-sm cursor-pointer ${isCollapsed ? "justify-center" : "justify-start"}`}
      activeProps={{
        className: "bg-neutral-200/50 dark:bg-neutral-700/50",
      }}
      activeOptions={{
        exact,
      }}
    >
      {IconComponent && <IconComponent className="h-5 w-5" />}
      {isCollapsed ? null : children}
    </Link>
  );
}

function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) => match.context.breadcrumb)
    .map((match) => ({
      // url: match.routeId,
      url: match.pathname,
      breadcrumb: match.context.breadcrumb,
    }));

  const [first, ...other] = breadcrumbs;

  if (!first) return null;

  return (
    <div className="flex items-center gap-1">
      <Link
        to={first.url}
        className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs cursor-pointer uppercase"
      >
        {first.breadcrumb}
      </Link>
      {other.map((breadcrumb, index, array) => {
        if (breadcrumb.breadcrumb === breadcrumbs[index].breadcrumb)
          return null;

        return (
          <Fragment key={breadcrumb.url}>
            <ChevronRight className="h-3 w-3" />
            <Link
              to={breadcrumb.url}
              className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs cursor-pointer uppercase"
            >
              {breadcrumb.breadcrumb}
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}

const Menu = {
  Wrapper: Wrapper,
  Item: Item,
};

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { investments, funds, favorites } = Route.useLoaderData();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="text-neutral-700 dark:text-neutral-300 min-h-screen flex flex-col">
        <header className="flex static top-0 left-0 right-0 h-14 bg-neutral-900 dark:bg-neutral-50">
          <span className="w-64 flex items-center gap-2">
            <img src={logo} className="h-14 p-3 dark:invert" />
            <span className="text-xs text-neutral-300 border border-neutral-300 dark:text-neutral-600 dark:border-neutral-600 rounded-full px-2 py-1">
              Demo Version
            </span>
          </span>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="relative w-full">
                <input
                  type="search"
                  aria-label="Search or type a command"
                  placeholder="Type a command or search..."
                  className="w-full flex items-center gap-2 px-4 pl-10 py-2 text-sm text-neutral-400 bg-neutral-800 dark:bg-neutral-100 rounded-md border border-neutral-700 dark:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <kbd className="inline-flex items-center gap-1 text-xs px-2 py-1 text-neutral-400 rounded">
                    <span className="text-base">⌘</span> K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <button className="p-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-700 cursor-pointer">
              <CircleHelp className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-700 cursor-pointer">
              <Bot className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-neutral-700 dark:bg-neutral-200" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-700 cursor-pointer">
              <div className="relative">
                <CircleUser className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">3</span>
                </div>
              </div>
              <span className="text-sm">Alvaro Bernar</span>
              <Ellipsis className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="flex flex-grow bg-neutral-50 dark:bg-neutral-900">
          <Menu.Wrapper>
            <Menu.Item icon={Building2} collapsable to="/">
              My Firm
            </Menu.Item>
            <Menu.Item icon={Star} to="/investments?favorites">
              Favorite Investments
            </Menu.Item>
            {favorites.map((favorite) => (
              <Menu.Item key={favorite.id} to={`/investments/${favorite.id}`}>
                {/* {JSON.stringify(favorite)} */}
                <span className="pl-7">{favorite.name}</span>
              </Menu.Item>
            ))}
            <Menu.Item icon={Search} collapsable to="/investments">
              Search Investments
            </Menu.Item>
            {investments.map((inv: any) => (
              <Menu.Item
                key={inv.id ?? inv.slug}
                to={`/investments/${inv.id ?? inv.slug}`}
                exact={false}
              >
                <span className="pl-7">{inv.name}</span>
              </Menu.Item>
            ))}
            <Menu.Item icon={HandCoins} collapsable to="/funds">
              Funds
            </Menu.Item>
            <Menu.Item to="/funds/fund-i" exact={false}>
              <span className="pl-7">Fund I</span>
            </Menu.Item>
            <Menu.Item to="/funds/energy-transition" exact={false}>
              <span className="pl-7">Energy Transition Fund I</span>
            </Menu.Item>
            <Menu.Item to="/funds/growth-iii" exact={false}>
              <span className="pl-7">Growth Fund III</span>
            </Menu.Item>
            <Menu.Item icon={Settings} collapsable to="/settings">
              Settings
            </Menu.Item>
            <div className="mt-auto">
              <Menu.Item icon={Bot} collapsable to="/ai">
                Aurelia AI
              </Menu.Item>
            </div>
          </Menu.Wrapper>
          <main className="flex-1 flex flex-col bg-neutral-100 dark:bg-neutral-800">
            <header className="flex items-center justify-between p-2 bg-neutral-100 dark:bg-neutral-800">
              <div className="flex items-center gap-2 relative">
                <div className="flex items-center gap-3">
                  <Breadcrumbs />
                  <EllipsisMenu />
                  <button className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer">
                    <Star className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Tabs />
              {/* <nav className="flex items-center gap-2 flex-1 justify-end">
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/investment-summary"
                  params={{ name: "atos" }}
                >
                  Investment Summary
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/dashboard"
                  params={{ name: "atos" }}
                >
                  Dashboard
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/company-performance"
                  params={{ name: "atos" }}
                >
                  Company Performance
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/valuation"
                  params={{ name: "atos" }}
                >
                  Valuation
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/shareholders-structure"
                  params={{ name: "atos" }}
                >
                  Shareholders Structure
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/deal-team-highlights"
                  params={{ name: "atos" }}
                >
                  Deal Team Highlights
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/reports"
                  params={{ name: "atos" }}
                >
                  Reports
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/documents"
                  params={{ name: "atos" }}
                >
                  Documents
                </Link>
                <Link
                  activeProps={{ className: "opacity-100" }}
                  className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
                  to="/investments/$name/data-collection"
                  params={{ name: "atos" }}
                >
                  Data Collection
                </Link>
              </nav> */}
            </header>
            <div className="flex-1 flex pr-2 pb-2">
              <div className="bg-neutral-50 flex-1 flex-col dark:bg-neutral-900 flex p-2 rounded border border-neutral-200 dark:border-neutral-700">
                {children}
              </div>
            </div>
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function Tabs() {
  const matches = useMatches();

  const tabsCtx = matches.find((match) => match.context.tabs);

  const tabs = tabsCtx?.context.tabs;

  if (!tabs) return null;

  return (
    <nav className="flex items-center gap-2 flex-1 justify-end">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          activeProps={{ className: "opacity-100" }}
          className="opacity-50 text-nowrap p-1 px-2 text-xs rounded-md bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
          {...tab}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function EllipsisMenu() {
  const [open, setOpen] = useState(false);
  const matches = useMatches();
  const router = useRouter();

  // Determine if current location is company-performance and get investment name.
  const companyMatch = matches.find((m) => m.pathname.includes("/investments"));
  const investmentName = (companyMatch?.params as any)?.name;
  const isCompany = Boolean(companyMatch);

  const toggle = () => {
    if (isCompany) setOpen(!open);
  };

  const handleTemplateConfig = () => {
    if (!investmentName) return;
    router.navigate({
      to: "/investments/$name/template-config",
      params: { name: investmentName },
      replace: true,
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
      >
        <Ellipsis className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-md z-50">
          <button
            onClick={handleTemplateConfig}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Template Config
          </button>
        </div>
      )}
    </div>
  );
}
