import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { createServerFn } from "@tanstack/react-start";
import {
  getCompanyBySlug,
  createCompany as createDbCompany,
} from "../../../db/gen/ts/company_sql";
import client from "../../db";


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

export const Route = createFileRoute("/investments/new")({
  component: RouteComponent,
  beforeLoad: ({ params, search }) => {
    return {
      breadcrumb: "Add Company",
    };
  },
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-");
}

function RouteComponent() {
  const navigate = Route.useNavigate();
  const router = useRouter();

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(name), [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await createCompany({
        data: { name: name.trim(), slug },
      });

      if (res?.error) {
        setError("A company with this id already exists.");
        setSubmitting(false);
        return;
      }

      router.invalidate();

      router.navigate({
        to: "/investments/$name/template-config",
        params: { name: slug },
      });
    } catch (err) {
      console.error(err);
      setError("Error creating company, please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <h2 className="text-xl font-semibold">Add Company</h2>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Company Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SpaceX"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            required
          />
          {name && (
            <p className="text-xs text-neutral-400">
              id: <span className="font-mono">{slug}</span>
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="bg-neutral-100 w-full  dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md flex justify-center gap-2 border border-neutral-200 dark:border-neutral-700 text-sm cursor-pointer"
        >
          {submitting ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}
