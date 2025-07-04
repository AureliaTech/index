import { createServerFn } from "@tanstack/react-start";
import { getCompanies } from "../../db/gen/ts/company_sql";
import client from "../db";
import {
  getCompanyBySlug,
  createCompany as createDbCompany,
} from "../../db/gen/ts/company_sql";

export const getInvestments = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      await client.connect().catch(() => {});
      const rows = await getCompanies(client);
      const companies = rows.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
      }));
      return { companies };
    } catch (error) {
      console.error("Error loading companies for mobile page", error);
      return { companies: [] as { id: string; name: string }[] };
    }
  }
);

export const createCompany = createServerFn({ method: "POST" })
  .validator((data: { name: string; slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      // Abort if slug already exists
      const existing = await getCompanyBySlug(client, { slug: data.slug });
      if (existing) {
        return { error: "slug_exists" } as const;
      }

      // Insert the new company (slug will be generated in the DB)
      await createDbCompany(client, { name: data.name });

      return { success: true } as const;
    } catch (error) {
      console.error(error);
      return { error: "error_creating_company" } as const;
    }
  });



