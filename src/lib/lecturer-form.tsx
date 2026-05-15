import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { useRoleGuard } from "@/lib/role-guard";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "tel" | "url" | "number" | "date" | "time" | "file"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "select"; required?: boolean; options: string[] };

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const UNIVERSITIES = [
  "University of Colombo", "University of Peradeniya", "University of Moratuwa",
  "University of Kelaniya", "University of Sri Jayewardenepura", "University of Jaffna",
  "University of Ruhuna", "Eastern University, Sri Lanka", "South Eastern University of Sri Lanka",
  "Rajarata University of Sri Lanka", "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka", "Uva Wellassa University", "Open University of Sri Lanka",
];
export const FACULTIES = [
  "Faculty of Science", "Faculty of Engineering", "Faculty of Technology",
  "Faculty of Arts", "Faculty of Management", "Faculty of Medicine",
  "Faculty of Law", "Faculty of Computing", "Faculty of Education", "Faculty of Agriculture",
];
export const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Software Engineering",
  "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
  "Mathematics", "Physics", "Chemistry", "Biology", "Business Administration",
  "Economics", "English", "Other",
];
export const SEMESTERS = ["Semester 1", "Semester 2"];
export const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

export function LecturerFormPage({
  title, fields, extra,
}: {
  title: string;
  fields: FieldDef[];
  extra?: ReactNode;
}) {
  useRoleGuard("lecturer");
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  function update(name: string, v: any) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    console.log(`[${title}] submitted`, values);
    toast.success(`${title} submitted successfully`);
    setLoading(false);
    navigate({ to: "/lecturer/dashboard" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#F0F9FF]">
      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/lecturer/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-hero">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-20">
        <h1 className="mb-6 text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <FieldRender key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => update(f.name, v)} />
            ))}
          </div>
          {extra}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="btn-hero inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </button>
            <Link to="/lecturer/dashboard" className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium hover:bg-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

function FieldRender({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const base = "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";
  const wide = field.type === "textarea" ? "sm:col-span-2" : "";

  return (
    <label className={`block ${wide}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {field.label}{field.required && <span className="text-destructive"> *</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea required={field.required} placeholder={(field as any).placeholder} value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={base} />
      ) : field.type === "select" ? (
        <select required={field.required} value={value} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === "file" ? (
        <input type="file" required={field.required} onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")} className={base} />
      ) : (
        <input type={field.type} required={field.required} placeholder={(field as any).placeholder} value={value} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)} className={base} />
      )}
    </label>
  );
}
