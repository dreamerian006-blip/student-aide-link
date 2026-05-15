import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";

export const UNIVERSITIES = [
  "University of Colombo", "University of Peradeniya", "University of Sri Jayewardenepura",
  "University of Kelaniya", "University of Moratuwa", "University of Ruhuna",
  "University of Jaffna", "Eastern University", "South Eastern University",
  "Rajarata University", "Sabaragamuwa University", "Wayamba University",
  "Uva Wellassa University", "Open University of Sri Lanka",
];
export const FACULTIES = [
  "Faculty of Science", "Faculty of Engineering", "Faculty of Medicine",
  "Faculty of Arts", "Faculty of Management", "Faculty of Law",
  "Faculty of Technology", "Faculty of Agriculture", "Faculty of Education",
];
export const DEPARTMENTS = [
  "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology",
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
  "Business Administration", "Economics", "English", "History", "Other",
];
export const SEMESTERS = ["Semester 1", "Semester 2"];
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function useLecturerGuard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (role && role !== "lecturer") navigate({ to: "/dashboard" });
  }, [user, role, loading, navigate]);
  return { ready: !loading && !!user && role === "lecturer" };
}

export function FormShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F8FAFC, #F0F9FF)" }}>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/lecturer/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-hero">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></span>
        </Link>
        <Link to="/lecturer/dashboard" className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/80">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "#1a1a1a" }}>{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">{children}</div>
      </main>
    </div>
  );
}

export type FieldType = "text" | "email" | "tel" | "url" | "number" | "date" | "time" | "textarea" | "file" | "select";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  fullWidth?: boolean;
};

export function LecturerForm({ fields, onSubmit, submitLabel = "Submit" }: {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setVal = (name: string, v: any) => {
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && f.type !== "file") {
        const v = values[f.name];
        if (!v || (typeof v === "string" && !v.trim())) errs[f.name] = `${f.label} is required`;
      }
    }
    if (Object.keys(errs).length) { setErrors(errs); toast.error("Please fill required fields"); return; }
    setSubmitting(true);
    try { await onSubmit(values); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const err = errors[f.name];
          const cls = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 ${err ? "border-red-400" : "border-gray-200"}`;
          const wrapCls = f.fullWidth || f.type === "textarea" ? "md:col-span-2" : "";
          return (
            <div key={f.name} className={wrapCls}>
              <label className="mb-1 block text-sm font-medium">
                {f.label}{f.required && <span className="text-red-500"> *</span>}
              </label>
              {f.type === "select" ? (
                <select className={cls} value={values[f.name] ?? ""} onChange={(e) => setVal(f.name, e.target.value)}>
                  <option value="">Select {f.label}</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea className={cls} rows={4} value={values[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setVal(f.name, e.target.value)} />
              ) : f.type === "file" ? (
                <input type="file" className={cls} onChange={(e) => setVal(f.name, e.target.files?.[0]?.name ?? "")} />
              ) : (
                <input type={f.type} className={cls} value={values[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setVal(f.name, e.target.value)} />
              )}
              {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
            </div>
          );
        })}
      </div>
      <button type="submit" disabled={submitting} className="btn-hero rounded-xl px-6 py-2.5 text-sm font-medium disabled:opacity-60">
        {submitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
