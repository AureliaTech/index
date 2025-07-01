import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { createServerFn } from '@tanstack/react-start'
import * as fs from "node:fs/promises";

const getInvestmentSummary = createServerFn({ method: "GET" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}/general-data.json`;
    
    try {
      const data = await fs.readFile(filePath, "utf8");
      const investmentSummary = JSON.parse(data)["investment-summary"];
      return { investmentSummary };
    } catch (error) {
      return {
        error: "No data found",
      };
    }
  });
  

export const Route = createFileRoute('/investments/$name/investment-summary')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getInvestmentSummary({ data: { name: params.name } });
  },
})

function RouteComponent() {
  const { investmentSummary, error } = Route.useLoaderData();

  if (error) {
    return <div>No data</div>;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N.A";
    const date = new Date(dateString);
    return Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 text-sm text-neutral-700 dark:text-neutral-300">
      {/* Top company info */}
      <div className="grid grid-cols-5 gap-6 border-b pb-6">
        <InfoItem label="Founded year" value={investmentSummary.foundedYear.toString()} />
        <InfoItem label="Company name" value={investmentSummary.companyName} />
        <InfoItem label="Country" value={investmentSummary.country} />
        <InfoItem label="Industry" value={investmentSummary.industry} />
        <InfoItem label="Address" value={investmentSummary.address} />
      </div>

      {/* Ownership & Management */}
      <div className="grid grid-cols-5 gap-6 border-b pb-6">
        <InfoItem label="Ownership" value={investmentSummary.ownershipPercentage} />
        <InfoItem label="Co-investors" value={investmentSummary.coInvestors} />
        <InfoItem label="CEO" value={investmentSummary.executives.CEO} />
        <InfoItem label="CFO" value={investmentSummary.executives.CFO} />
        <div>
          <div className="font-medium text-neutral-900 dark:text-neutral-100">Board Members</div>
          <ul className="list-disc list-inside space-y-1">
            {investmentSummary.boardMembers.map((member: string) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deal team & dates */}
      <div className="grid grid-cols-4 gap-6 border-b pb-6">
        <InfoItem
          label="Deal team"
          value={investmentSummary.dealTeam.join("  ·  ")}
        />
        <InfoItem label="Acquisition date" value={formatDate(investmentSummary.acquisitionDate)} />
        <InfoItem label="Realization date" value={formatDate(investmentSummary.realizationDate)} />
      </div>

      {/* Entry Valuation */}
      <SectionTitle>Entry valuation</SectionTitle>
      <div className="grid grid-cols-3 gap-6 border-b pb-6">
        <InfoItem label="Equity value" value={investmentSummary.entryValuation.equityValue} />
        <InfoItem label="Net Debt" value={investmentSummary.entryValuation.netDebt ?? "-"} />
        <InfoItem label="Enterprise value" value={investmentSummary.entryValuation.enterpriseValue} />
      </div>

      {/* Latest Valuation */}
      <SectionTitle>Latest Valuation</SectionTitle>
      <div className="grid grid-cols-3 gap-6">
        <InfoItem label="Equity value" value={investmentSummary.latestValuation.equityValue} />
        <InfoItem label="Net Debt" value={investmentSummary.latestValuation.netDebt ?? "-"} />
        <InfoItem label="Enterprise value" value={investmentSummary.latestValuation.enterpriseValue} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <InfoItem label="Committed capital" value={investmentSummary.committedCapital} />
        <InfoItem label="Invested capital" value={investmentSummary.investedCapital} />
        <InfoItem label="Realized investment" value={investmentSummary.realizedInvestment} />
        <InfoItem label="Unrealized investment" value={investmentSummary.unrealizedInvestment} />
      </div>

      <div className="grid grid-cols-4 gap-6 border-b pb-6">
        <InfoItem label="Gross IRR" value={investmentSummary.grossIRR} />
        <InfoItem label="Gross investment multiple" value={investmentSummary.grossInvestmentMultiple} />
        <InfoItem label="Net IRR" value={investmentSummary.netIRR} />
        <InfoItem label="Net investment multiple" value={investmentSummary.netInvestmentMultiple} />
      </div>

      {/* Company description */}
      <div>
        <SectionTitle>Company description</SectionTitle>
        <p>{investmentSummary.companyDescription}</p>
      </div>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <div className="text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="font-medium text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </h2>
  )
}
