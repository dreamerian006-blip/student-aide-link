import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import {
  UNIVERSITIES, FACULTIES, inputCls, labelCls, Field,
} from "@/lib/student-form";

export const Route = createFileRoute("/lecturer-contacts-submit")({
  component: LecturerContactsSubmit,
});

function LecturerContactsSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({
    lecturer_name: "", work_role: "", department: "", faculty: "",
    university: "", whatsapp_number: "", email: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const set = (k: keyof typeof v, val: string) => setV(p => ({ ...p, [k]: val }));

  async function submit() {
    const required = ["lecturer_name","work_role","department","faculty","university","whatsapp_number","email"] as const;
    for (const k of required) if (!v[k]) return toast.error("Please fill all required fields");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return toast.error("Invalid email");
    if (!user) return;

    setSaving(true);
    try {
      let photo_path: string | null = null;
      if (photo) {
        const path = `${user.id}/${Date.now()}-${photo.name}`;
        const { error: upErr } = await supabase.storage.from("lecturer-photos").upload(path, photo);
        if (upErr) throw upErr;
        photo_path = path;
      }
      const { error } = await supabase.from("lecturer_contacts").insert({
        user_id: user.id, ...v, photo_path,
      });
      if (error) throw error;
      toast.success("Lecturer contact saved");
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      toast.error(e.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h1 className="mb-6 text-2xl font-semibold">Add Lecturer Contact</h1>

        <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Lecturer Name" required>
              <input className={inputCls} value={v.lecturer_name} onChange={e => set("lecturer_name", e.target.value)} />
            </Field>
            <Field label="Work / Role" required>
              <input className={inputCls} value={v.work_role} onChange={e => set("work_role", e.target.value)} />
            </Field>
            <Field label="Department" required>
              <input className={inputCls} value={v.department} onChange={e => set("department", e.target.value)} />
            </Field>
            <Field label="Faculty" required>
              <select className={inputCls} value={v.faculty} onChange={e => set("faculty", e.target.value)}>
                <option value="">Select faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="University" required>
              <select className={inputCls} value={v.university} onChange={e => set("university", e.target.value)}>
                <option value="">Select university</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="WhatsApp Number" required>
              <input type="tel" className={inputCls} placeholder="+94..." value={v.whatsapp_number} onChange={e => set("whatsapp_number", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="University Mail Address" required>
                <input type="email" className={inputCls} value={v.email} onChange={e => set("email", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Photo</label>
              <input type="file" accept="image/*" className={inputCls} onChange={e => setPhoto(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="rounded-xl border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          <button disabled={saving} onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </main>
    </div>
  );
}
