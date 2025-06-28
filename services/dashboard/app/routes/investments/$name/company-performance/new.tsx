import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useRef, useCallback } from "react";
import { ArrowUpToLine } from "lucide-react";
import Drawer from "../../../../components/Drawer";
import { useRouter } from "@tanstack/react-router";
import { uploadTemplate } from "../template-config";

export const Route = createFileRoute(
  "/investments/$name/company-performance/new"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { name: companyName } = Route.useParams();
  const navigate = Route.useNavigate();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerSelect = () => fileInputRef.current?.click();

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8Array.byteLength; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);

        await uploadTemplate({
          data: { name: companyName, content: base64 },
        } as any);

        // Refresh parent loader and close drawer
        router.invalidate();
        navigate({ to: ".." });
      } catch (err) {
        console.error(err);
        setError("Error uploading file, please try again.");
      } finally {
        setUploading(false);
      }
    },
    [companyName, navigate, router]
  );

  return (
    <Drawer
      open={true}
      onClose={() => navigate({ to: ".." })}
      title="Upload Template"
    >
      <div
        className="flex flex-col items-center justify-center gap-4 py-20 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer"
        onClick={triggerSelect}
      >
        <ArrowUpToLine className="h-10 w-10" />
        <p className="text-sm text-center max-w-xs">
          {uploading
            ? "Uploading..."
            : "Click anywhere to select an Excel (.xlsx) file"}
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </Drawer>
  );
}
