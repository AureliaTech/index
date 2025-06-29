import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import db from "../app/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FundEntry {
  id: string;
  name: string;
}

async function seed() {
  const jsonPath = path.resolve(__dirname, "../app/data/funds.json");
  const raw = await fs.readFile(jsonPath, "utf-8");
  const funds = JSON.parse(raw) as FundEntry[];

  try {
    await db.query("BEGIN");

    for (const { name } of funds) {
      await db.query(
        "INSERT INTO fund (name) VALUES ($1) ON CONFLICT (slug) DO NOTHING",
        [name],
      );
    }

    await db.query("COMMIT");
    console.log(`Seeded ${funds.length} funds.`);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error while seeding funds:", err);
  }
}

seed(); 