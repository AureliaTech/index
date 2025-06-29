import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import client from "../app/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InvestmentEntry {
  id: string;
  name: string;
}

async function seed() {
  const jsonPath = path.resolve(__dirname, "../app/data/investments.json");
  const raw = await fs.readFile(jsonPath, "utf-8");
  const investments = JSON.parse(raw) as InvestmentEntry[];


  try {
    await client.query("BEGIN");

    for (const { name } of investments) {
      // Insert company name; slug is generated automatically by trigger.
      await client.query(
        "INSERT INTO company (name) VALUES ($1) ON CONFLICT (slug) DO NOTHING",
        [name]
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${investments.length} companies.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error while seeding companies:", err);
  }
}

seed(); 