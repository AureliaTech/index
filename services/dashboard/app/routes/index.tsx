// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import {
  Panelright,
  Building2,
  Star,
  Search,
  HandCoins,
  Bot,
  Settings,
} from "lucide-react";
import { useState, createContext, useContext, useRef, useEffect } from "react";
const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  /**
   * Contains a bug, when making screen smaller, the table doesn't resize.
   */
  useEffect(function updateWidth() {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-4" ref={wrapperRef}>
      <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-md inline-grid grid-cols-2 gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400 w-24">
          Dashboard
        </span>
        <p className="text-sm text-neutral-900 dark:text-neutral-300">
          Financial Inc.
        </p>
        <span className="text-sm text-neutral-500 dark:text-neutral-400 w-24">
          Last Updated
        </span>
        <p className="text-sm text-neutral-900 dark:text-neutral-300">
          {Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date())}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Total Commitment
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(1503000000)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Invested
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(1178000000)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Realized Proceeds
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(340000000)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Unrealized Proceeds
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(1853000000)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Total Value
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(2187000000)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Investment Vehicles
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(3)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Current Investments
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(11)}
          </div>
        </div>
        <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 w-80">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            Realized Investments
          </div>
          <div className="text-2xl text-violet-900 dark:text-violet-300">
            {Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
              notation: "compact",
            }).format(2187000000)}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-wrap gap-4 mt-6">
        <h2 className="text-xl text-neutral-900 dark:text-neutral-300">
          Investment Vehicles
        </h2>
        <div className="w-96 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-auto" style={{ width }}>
          <table className="rounded-lg border border-neutral-200 dark:border-neutral-700 border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-30 min-w-40 py-3 px-4 text-sm text-left bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Fund
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Year
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Capital Commited
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Capital Invested
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Realized Value
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Unrealized Value
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Total Value
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Net IRR
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Net Moic
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Gross IRR
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Gross Moic
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Current Investments
                </th>
                <th className="sticky top-0 z-10 min-w-40 py-2 px-4 text-sm text-right bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap font-semibold">
                  Realized Investments
                </th>
              </tr>
            </thead>
            <tbody>
              {fundsData.map((fund) => (
                <tr key={fund.id}>
                  <td className="sticky left-0 z-20 text-sm text-left border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap bg-neutral-50 dark:bg-neutral-900">
                    <Link to="/funds/$name" params={{ name: fund.id }} className="underline text-blue-700 dark:text-blue-300">{fund.name}</Link>
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.year}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.capitalCommited}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.capitalInvested}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.realizedValue}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.unrealizedValue}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.totalValue}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.netIrr}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.netMoic}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.grossIrr}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.grossMoic}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.currentInvestments}
                  </td>
                  <td className="text-sm text-right border-b border-neutral-200 dark:border-neutral-700 py-3 px-4 whitespace-nowrap">
                    {fund.realizedInvestments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const fundsData = [
  {
    id: "fund-i",
    name: "Fund I",
    year: 2017,
    capitalCommited: 425.7,
    capitalInvested: 425.7,
    realizedValue: 258.0,
    unrealizedValue: 729.3,
    totalValue: 987.3,
    netIrr: "18.2%",
    netMoic: "3.1x",
    grossIrr: "22.5%",
    grossMoic: "3.5x",
    currentInvestments: 5,
    realizedInvestments: 2,
  },
  {
    id: "energy-transition",
    name: "Energy Transition Fund I",
    year: 2022,
    capitalCommited: 812.4,
    capitalInvested: 659.2,
    realizedValue: 74.0,
    unrealizedValue: 1030.4,
    totalValue: 1104.4,
    netIrr: "12.2%",
    netMoic: "3.6x",
    grossIrr: "15.8%",
    grossMoic: "4.1x",
    currentInvestments: 4,
    realizedInvestments: 0,
  },
  {
    id: "growth-iii",
    name: "Growth Fund III",
    year: 2023,
    capitalCommited: 265.8,
    capitalInvested: 93.1,
    realizedValue: 2.5,
    unrealizedValue: 93.3,
    totalValue: 95.8,
    netIrr: "25.1",
    netMoic: "5.0x",
    grossIrr: "30.0%",
    grossMoic: "6.1x",
    currentInvestments: 2,
    realizedInvestments: 0,
  },
];
