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
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  Fragment,
  useMemo,
  useCallback,
} from "react";
import * as fs from "node:fs/promises";
import { useRouter } from "@tanstack/react-router";
import logo from "../assets/aurelia-logo.png?url";
import { createServerFn } from "@tanstack/react-start";
import { getCompanies } from "../../db/gen/ts/companies_sql";
import { getFunds } from "../../db/gen/ts/fund_sql";
import client from "../db";

const getMenuData = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    // Ensure the database client is connected
    await client.connect().catch(() => {});

    // Fetch investments (companies)
    const companies = await getCompanies(client);

    const investments = companies.map((c) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
    }));

    // Fetch funds
    const fundRows = await getFunds(client);
    const funds = fundRows.map((f) => ({
      id: f.slug,
      slug: f.slug,
      name: f.name,
    }));
    const favoritesRaw = JSON.parse(
      await fs.readFile("app/data/favorites.json", "utf8")
    );

    const favorites = favoritesRaw.map(({ id, type }) => ({
      id,
      name:
        type === "investment"
          ? investments.find((investment) => investment.id === id)?.name
          : funds.find((fund) => fund.id === id)?.name,
    }));
    return { investments, funds, favorites };
  } catch (error) {
    console.error(error);
    return { investments: [], funds: [], favorites: [] };
  }
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
    [isCollapsed]
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

function Item({ children, icon, to, collapsable, exact = true }: ItemProps) {
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

  // State and global shortcut handler for the search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global ⌘/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
                  onClick={() => setIsSearchOpen(true)}
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
            {funds.map((fund: any) => (
              <Menu.Item
                key={fund.id ?? fund.slug}
                to={`/funds/${fund.id ?? fund.slug}`}
                exact={false}
              >
                <span className="pl-7">{fund.name}</span>
              </Menu.Item>
            ))}
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
            </header>
            <div className="flex-1 flex pr-2 pb-2">
              <div className="bg-neutral-50 flex-1 flex-col dark:bg-neutral-900 flex p-2 rounded border border-neutral-200 dark:border-neutral-700">
                {children}
              </div>
            </div>
          </main>
        </div>
        {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
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

// Search modal shown when the user presses ⌘/Ctrl + K or clicks the small search box
function SearchModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<{ investments: any[]; funds: any[] }>();
  const [query, setQuery] = useState("");
  const [contexts, setContexts] = useState<
    { id: string; label: string; type: "investment" | "fund"; icon: React.ElementType }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();

  type Suggestion = {
    label: string;
    icon: React.ElementType;
    to?: string; // optional when it's an action with sub-options
    children?: Suggestion[]; // optional nested suggestions (multi-step)
  };

  // Stack to track multi-step navigation
  const [actionStack, setActionStack] = useState<Suggestion[][]>([]);

  // Context mode is active if the user is typing after the last "@"
  const atIndex = query.lastIndexOf("@");
  const isContextMode = atIndex !== -1;
  const contextTerm = isContextMode ? query.slice(atIndex + 1).trim().toLowerCase() : "";

  const baseCommandsRef = useRef<Suggestion[]>([
    // static options
    { label: "Go to My Firm", to: "/", icon: Building2 },
    { label: "Go to Favorite Investments", to: "/investments?favorites", icon: Star },
    { label: "Go to Search Investments", to: "/investments", icon: Search },
    { label: "Go to Funds", to: "/funds", icon: HandCoins },
    { label: "Go to Settings", to: "/settings", icon: Settings },
    { label: "Go to Aurelia AI", to: "/ai", icon: Bot },

    // Example multi-step action
    {
      label: "Create…",
      icon: CircleHelp,
      children: [
        { label: "New Investment", icon: Building2, to: "/investments/new" },
        { label: "New Fund", icon: HandCoins, to: "/funds/new" },
      ],
    },
  ]);

  const suggestions = useMemo(() => {
    if (!data) return [] as Suggestion[];

    // If we're inside a multi-step action, show its children first (before context handling)
    if (actionStack.length > 0) {
      return actionStack[actionStack.length - 1];
    }

    // Context selection mode with "@"
    if (isContextMode) {
      if (!contextTerm) return [];

      const filterFn = (name: string) => name.toLowerCase().includes(contextTerm);

      const inv: Suggestion[] = data.investments
        .filter((i) => filterFn(i.name) && !contexts.some((c) => c.id === i.id))
        .map((i) => ({ label: i.name, to: i.id, icon: Building2 }));

      const fundsS: Suggestion[] = data.funds
        .filter((f) => filterFn(f.name) && !contexts.some((c) => c.id === f.id))
        .map((f) => ({ label: f.name, to: f.id, icon: HandCoins }));

      return [...inv, ...fundsS].slice(0, 9);
    }

    // Regular search over static + dynamic navigation commands
    const searchString = isContextMode ? query.slice(0, atIndex) : query;

    const words = searchString
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // If no words, return the full (static + dynamic) command list
    if (!words.length) return baseCommandsRef.current.slice(0, 50);

    const matches = (label: string) => words.every((w) => label.toLowerCase().includes(w));

    const dynamicCommands: Suggestion[] = [
      ...data.investments.map((i) => ({
        label: `Go to ${i.name}`,
        to: `/investments/${i.id}`,
        icon: Building2,
      })),
      ...data.funds.map((f) => ({
        label: `Go to ${f.name}`,
        to: `/funds/${f.id}`,
        icon: HandCoins,
      })),
    ];

    const allCommands = [...baseCommandsRef.current, ...dynamicCommands];

    return allCommands.filter((c) => matches(c.label)).slice(0, 9);
  }, [data, query, isContextMode, contexts, actionStack]);

  // Reset selected index whenever the list of suggestions changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  // Helper to process selection
  const selectSuggestion = useCallback(
    (s: Suggestion) => {
      // Drill-down if the suggestion has sub-options
      if (s.children) {
        setActionStack((stk) => [...stk, s.children!]);
        setQuery("");
        return;
      }

      if (isContextMode) {
        setContexts((prev) => [
          ...prev,
          {
            id: s.to!,
            label: s.label,
            type: s.icon === Building2 ? "investment" : "fund",
            icon: s.icon,
          },
        ]);

        // Remove the context fragment from the query, keep any prefix
        const prefix = query.slice(0, atIndex).trimEnd();
        setQuery(prefix ? prefix + " " : "");
      } else {
        router.navigate({ to: s.to!, replace: false });
        onClose();
      }
    },
    [isContextMode, router, onClose, query, atIndex]
  );

  // Handle Backspace popping action stack when query is empty and not in context mode
  const handleBackspaceNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query === "" && !isContextMode && actionStack.length > 0) {
      e.preventDefault();
      setActionStack((stk) => stk.slice(0, -1));
    }
  };

  // Keyboard navigation: numbers, arrows, enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const len = suggestions.length;
      if (len === 0) return;

      // Numeric shortcuts
      if (e.key >= "1" && e.key <= "9") {
        const idx = Math.min(parseInt(e.key, 10) - 1, len - 1);
        e.preventDefault();
        selectSuggestion(suggestions[idx]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % len);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + len) % len);
      } else if (e.key === "Enter") {
        e.preventDefault();
        selectSuggestion(suggestions[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [suggestions, selectedIndex, selectSuggestion]);

  // Load data using web worker once when modal mounts
  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/searchDataWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.postMessage("load");
    worker.onmessage = (event) => {
      if (event.data?.type === "data") {
        setData(event.data.payload);
      }
    };

    return () => worker.terminate();
  }, []);

  // Focus input and close on Escape
  useEffect(() => {
    inputRef.current?.focus();
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mt-24 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 relative">
          {/* Top context bar */}
          {contexts.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {contexts.map((ctx) => {
                const Icon = ctx.icon;
                return (
                  <span
                    key={`top-${ctx.id}`}
                    className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs rounded-full px-2 py-0.5"
                  >
                    <Icon className="h-3 w-3" />
                    {ctx.label}
                    <button
                      className="ml-1 hover:text-red-500"
                      onClick={() => setContexts((prev) => prev.filter((c) => c.id !== ctx.id))}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Input row with inline pills */}
          <div className="flex flex-wrap gap-1 items-center border border-transparent focus-within:border-blue-500 rounded-md">
            {contexts.map((ctx) => {
              const Icon = ctx.icon;
              return (
                <span
                  key={`inline-${ctx.id}`}
                  className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs rounded-full px-2 py-0.5"
                >
                  <Icon className="h-3 w-3" />
                  {ctx.label}
                  <button
                    className="ml-1 hover:text-red-500"
                    onClick={() => setContexts((prev) => prev.filter((c) => c.id !== ctx.id))}
                  >
                    ×
                  </button>
                </span>
              );
            })}
            <input
              ref={inputRef}
              type="text"
              aria-label="Search or type a command"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && query === "" && contexts.length > 0) {
                  // delete pill
                  e.preventDefault();
                  setContexts((prev) => prev.slice(0, -1));
                  return;
                }
                handleBackspaceNavigation(e);
              }}
              className="flex-1 min-w-[120px] bg-transparent focus:outline-none px-2 py-3 text-sm text-neutral-900 dark:text-neutral-100"
            />
          </div>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="mt-2 max-h-80 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md">
              {suggestions.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.to}
                    className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer ${
                      idx === selectedIndex
                        ? "bg-neutral-100 dark:bg-neutral-700"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                    onClick={() => {
                      selectSuggestion(s);
                    }}
                  >
                    <Icon className="h-4 w-4 text-neutral-500" />
                    <span className="flex-1">{isContextMode ? s.label : s.label}</span>
                    <span
                      className="inline-flex items-center justify-center h-4 w-4 text-[10px] font-medium rounded border border-neutral-400 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800"
                    >
                      {idx + 1}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
