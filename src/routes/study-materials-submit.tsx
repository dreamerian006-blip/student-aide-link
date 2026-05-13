import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import {
  UNIVERSITIES, FACULTIES, inputCls, labelCls, Req, Field,
} from "@/lib/student-form";

export const Route = createFileRoute("/study-materials-submit")({
  component: StudyMaterialsSubmit,
});

const MATERIAL_TYPES = ["Notes", "Slides", "Past Paper", "Video", "Assignment"];

function StudyMaterialsSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({
    course_subject: "", department: "", faculty: "", university: "",
    title: "", subtitle_year: "", material_type: "", description: "", link_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const set = (k: keyof typeof v, val: string) => setV(p => ({ ...p, [k]: val }));

  async function submit() {
    const required = ["course_subject","department","faculty","university","title","material_type"] as const;
    for (const k of required) if (!v[k]) return toast.error("Please fill all required fields");
    if (!file && !v.link_url) return toast.error("Provide a file or a link");
    if (!user) return;

    setSaving(true);
    try {
      let file_path: string | null = null;
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("study-materials").upload(path, file);
        if (upErr) throw upErr;
        file_path = path;
      }
      const { error } = await supabase.from("study_materials").insert({
        user_id: user.id, ...v, file_path, link_url: v.link_url || null,
      });
      if (error) throw error;
      toast.success("Study material submitted");
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
        <h1 className="mb-6 text-2xl font-semibold">Submit Study Material</h1>

        <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Course/Subject" required>
              <input className={inputCls} value={v.course_subject} onChange={e => set("course_subject", e.target.value)} />
            </Field>
            <Field label="Title" required>
              <input className={inputCls} value={v.title} onChange={e => set("title", e.target.value)} />
            </Field>
            <Field label="Sub-title with Year">
              <input className={inputCls} value={v.subtitle_year} onChange={e => set("subtitle_year", e.target.value)} />
            </Field>
            <Field label="Study Materials Type" required>
              <select className={inputCls} value={v.material_type} onChange={e => set("material_type", e.target.value)}>
                <option value="">Select type</option>
                {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
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
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea rows={4} className={inputCls} value={v.description} onChange={e => set("description", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>File Upload <span className="text-muted-foreground">(or use link below)</span></label>
              <input type="file" className={inputCls} onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Google Drive / External Link">
                <input className={inputCls} placeholder="https://..." value={v.link_url} onChange={e => set("link_url", e.target.value)} />
              </Field>
              <p className="mt-1 text-xs text-muted-foreground">Provide either a file <Req /> or a link <Req /></p>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="rounded-xl border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          <button disabled={saving} onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </main>
    </div>
  );
}
