import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode, type FormEvent } from "react";
import { ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useRoleGuard } from "@/lib/use-role-guard";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "time" | "email" | "url" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

type Props = {
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  successMessage?: string;
  children?: ReactNode;
};

export function LecturerSubmitPage({ title, subtitle, fields, successMessage }: Props) {
  const { allowed, loading: authLoading } = useRoleGuard("lecturer");
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (authLoading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate async submit
      await new Promise((r) => setTimeout(r, 600));
      console.log(`[${title}] submission:`, values);
      toast.success(successMessage ?? `${title} submitted successfully`);
      navigate({ to: "/lecturer/dashboard" });
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function update(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "var(--grad-hero)" }} />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-hero">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></span>
        </Link>
        <Link to="/lecturer/dashboard" className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/80">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <form onSubmit={onSubmit} className="glass-strong space-y-4 rounded-2xl p-6">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {f.label}{f.required && <span className="text-red-500"> *</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              ) : f.type === "select" ? (
                <select
                  required={f.required}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="">Select...</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              )}
            </label>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="btn-hero flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}
