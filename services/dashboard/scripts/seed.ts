import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import db from "../app/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CompanyEntry {
  id: string;
  name: string;
}

interface FundEntry {
  id: string;
  name: string;
}

async function seed() {
  // Resolve paths for the JSON data files
  const investmentsPath = path.resolve(__dirname, "../app/data/investments.json");
  const fundsPath = path.resolve(__dirname, "../app/data/funds.json");

  // Read and parse JSON data
  const [investmentsRaw, fundsRaw] = await Promise.all([
    fs.readFile(investmentsPath, "utf-8"),
    fs.readFile(fundsPath, "utf-8"),
  ]);

  const investments = JSON.parse(investmentsRaw) as CompanyEntry[];
  const funds = JSON.parse(fundsRaw) as FundEntry[];

  try {
    await db.query("BEGIN");

    // Seed companies
    for (const { name } of investments) {
      await db.query(
        "INSERT INTO company (name) VALUES ($1) ON CONFLICT (slug) DO NOTHING",
        [name],
      );
    }

    // Seed funds
    for (const { name } of funds) {
      await db.query(
        "INSERT INTO fund (name) VALUES ($1) ON CONFLICT (slug) DO NOTHING",
        [name],
      );
    }

    // Seed a default user
    const defaultUsername = "Alvaro Bernar";
    await db.query(
      "INSERT INTO users (username) VALUES ($1) ON CONFLICT (username) DO NOTHING",
      [defaultUsername],
    );

    await db.query("COMMIT");

    console.log(
      `Seed completed: ${investments.length} companies, ${funds.length} funds, and default user \"${defaultUsername}\".`,
    );
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error while seeding data:", err);
  } finally {
    // Close the pool so the process can exit gracefully
    await db.end();
  }
}

seed(); 