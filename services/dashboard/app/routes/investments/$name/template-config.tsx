import { createFileRoute } from "@tanstack/react-router";
import * as fs from "node:fs/promises";
import { useState, useRef, useCallback, startTransition } from "react";
import { ArrowUpToLine } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";

export const uploadTemplate = createServerFn({ method: "POST" })
  .validator((data: { name: string; content: string }) => data)
  .handler(async ({ data }) => {
    const { name, content } = data;
    const buffer = Buffer.from(content, "base64");
    const filePath = `app/data/${name}-template.xlsx`;
    await fs.writeFile(filePath, buffer);
    return { success: true } as const;
  });

export const getTemplate = createServerFn({ method: "GET" })
  .validator((data: { name: string }) => data)
  .handler(async ({ data: { name } }) => {
    const filePath = `app/data/${name}-template.xlsx`;
    try {
      await fs.access(filePath);
      return { hasTemplate: true } as const;
    } catch {
      return { hasTemplate: false } as const;
    }
  });

export const Route = createFileRoute("/investments/$name/template-config")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { name } = params;
    return await getTemplate({ data: { name } });
  },
});

function RouteComponent() {
  const { name } = Route.useParams();
  const { hasTemplate } = Route.useLoaderData() as { hasTemplate: boolean };

  const [templateExists, setTemplateExists] = useState(hasTemplate);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerSelect = () => fileInputRef.current?.click();

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.byteLength; i++)
        binary += String.fromCharCode(uint8Array[i]);
      const base64 = btoa(binary);

      try {
        await uploadTemplate({ data: { name, content: base64 } } as any);
        startTransition(() => setTemplateExists(true));
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
    [name]
  );

  if (templateExists) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10 text-neutral-600 dark:text-neutral-300">
        <p className="text-lg font-medium">Template uploaded successfully!</p>
        <p className="text-sm">This page is under construction.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer"
      onClick={triggerSelect}
    >
      <ArrowUpToLine className="h-10 w-10" />
      <p className="text-sm text-center max-w-xs">
        Upload an Excel template to start configuring
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
