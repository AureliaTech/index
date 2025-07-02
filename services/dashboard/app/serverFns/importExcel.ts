import { createServerFn } from "@tanstack/react-start";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = process.env.FILE_BUCKET ?? path.resolve("uploads");

type ParseResult =
  | {
      status: "ok";
      sheets: Record<string, number>;
    }
  | { error: string };

export const importExcel = createServerFn({ method: "POST" })
  .validator((formData) => {
    if (!(formData instanceof FormData)) throw new Error("Invalid form data");
    const file = formData.get("file");
    if (!file || !(file instanceof File)) throw new Error("Missing file");

    return { file };
  })
  .handler(async ({ data }) => {
    const { file } = data;

    //Persist file
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const destination = path.join(UPLOAD_DIR, `${Date.now()}-${file.name}`);
    await fs.writeFile(destination, Buffer.from(await file.arrayBuffer()));

    const python = spawn("python", ["scripts/parse_excel.py", destination], {
      timeout: 3 * 60 * 1000, // 3 min
    });

    let stdout = "";
    let stderr = "";
    python.stdout.on("data", (d) => (stdout += d));
    python.stderr.on("data", (d) => (stderr += d));

    const exitCode: number = await new Promise((res) =>
      python.on("close", res)
    );

    //Clean up
    await fs.unlink(destination).catch(() => {});

    //Result
    if (exitCode !== 0) throw new Error(stderr || "Python failed");
    const parsed: ParseResult = JSON.parse(stdout);
    return parsed;
  });
