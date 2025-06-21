import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/investments/$name/investment-summary')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 text-sm text-neutral-700 dark:text-neutral-300">
      {/* Top company info */}
      <div className="grid grid-cols-5 gap-6 border-b pb-6">
        <InfoItem label="Founded year" value="1985" />
        <InfoItem label="Company name" value="Inditex Fashion Retail S.A" />
        <InfoItem label="Country" value="Spain" />
        <InfoItem label="Industry" value="Fashion Retail" />
        <InfoItem
          label="Address"
          value="Avd. de la diputación, 15143, Arteixo, (A Coruña) Spain"
        />
      </div>

      {/* Ownership & Management */}
      <div className="grid grid-cols-5 gap-6 border-b pb-6">
        <InfoItem label="Ownership" value="34.99%" />
        <InfoItem label="Co-investors" value="N.A" />
        <InfoItem label="CEO" value="Oscar Garcia Maceiras" />
        <InfoItem label="CFO" value="Ignacio Fernandez" />
        <div>
          <div className="font-medium text-neutral-900 dark:text-neutral-100">Board Members</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Marta Ortega Perez (Chairman)</li>
            <li>Amancio Ortega Ganoa (Board)</li>
            <li>Oscar Garcia Maceiras (CEO)</li>
            <li>Flora Perez Marcote (Board)</li>
            <li>Rodrigo Echnique Gordillo (Board)</li>
          </ul>
        </div>
      </div>

      {/* Deal team & dates */}
      <div className="grid grid-cols-4 gap-6 border-b pb-6">
        <InfoItem
          label="Deal team"
          value="Mariana Lopez Briales  ·  Monica Gomez Acebo"
        />
        <InfoItem label="Acquisition date" value="1 January 2023" />
        <InfoItem label="Realization date" value="N.A" />
      </div>

      {/* Entry Valuation */}
      <SectionTitle>Entry valuation</SectionTitle>
      <div className="grid grid-cols-3 gap-6 border-b pb-6">
        <InfoItem label="Equity value" value="€293.3 M" />
        <InfoItem label="Net Debt" value="-" />
        <InfoItem label="Enterprise value" value="€293.3 M" />
      </div>

      {/* Latest Valuation */}
      <SectionTitle>Latest Valuation</SectionTitle>
      <div className="grid grid-cols-3 gap-6">
        <InfoItem label="Equity value" value="€625.1 M" />
        <InfoItem label="Net Debt" value="-" />
        <InfoItem label="Enterprise value" value="€625.1 M" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <InfoItem label="Committed capital" value="€100 M" />
        <InfoItem label="Invested capital" value="€75 M" />
        <InfoItem label="Realized investment" value="€75 M" />
        <InfoItem label="Unrealized investment" value="€75 M" />
      </div>

      <div className="grid grid-cols-4 gap-6 border-b pb-6">
        <InfoItem label="Gross IRR" value="25.3%" />
        <InfoItem label="Gross investment multiple" value="3.4x" />
        <InfoItem label="Net IRR" value="18.7%" />
        <InfoItem label="Net investment multiple" value="2.7x" />
      </div>

      {/* Company description */}
      <div>
        <SectionTitle>Company description</SectionTitle>
        <p>
          Inditex (Industria de Diseño Textil, S.A.) is a Spanish multinational
          fashion retailer and one of the world&apos;s largest apparel companies.
          Headquartered in Arteixo, Galicia, Spain, Inditex operates a portfolio
          of globally recognized brands, including Zara, Massimo Dutti,
          Pull&amp;Bear, Bershka, Stradivarius and Oysho.
        </p>
      </div>
    </div>
  )
}

type InfoItemProps = {
  label: string
  value: string
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <div className="text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="font-medium text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
        {value}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </h2>
  )
}
