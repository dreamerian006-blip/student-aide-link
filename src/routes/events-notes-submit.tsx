import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { UNIVERSITIES, FACULTIES, inputCls, Field } from "@/lib/student-form";

export const Route = createFileRoute("/events-notes-submit")({
  component: EventsNotesSubmit,
});

function EventsNotesSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ title: "", event_type: "", event_date: "", event_time: "", venue: "", university: "", faculty: "", description: "", link_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/" }); }, [loading, user, navigate]);
  const set = (k: keyof typeof v, val: string) => setV(p => ({ ...p, [k]: val }));

  async function submit() {
    if (!v.title || !v.university || !v.faculty) return toast.error("Please fill all required fields");
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("study_materials").insert({
        user_id: user.id,
        course_subject: v.event_type || "Event",
        title: v.title,
        subtitle_year: v.event_date || null,
        material_type: "Event",
        description: `${v.description}\n\nDate: ${v.event_date} ${v.event_time}\nVenue: ${v.venue}`,
        department: v.event_type || "General",
        faculty: v.faculty,
        university: v.university,
        link_url: v.link_url || null,
      });
      if (error) throw error;
      toast.success("Event posted");
      navigate({ to: "/dashboard" });
    } catch (e: any) { toast.error(e.message || "Submission failed"); } finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h1 className="mb-6 text-2xl font-semibold">Post Event or Notice</h1>
        <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input className={inputCls} value={v.title} onChange={e => set("title", e.target.value)} />
            </Field>
            <Field label="Type">
              <input className={inputCls} placeholder="Event / Notice / Deadline" value={v.event_type} onChange={e => set("event_type", e.target.value)} />
            </Field>
            <Field label="Date">
              <input type="date" className={inputCls} value={v.event_date} onChange={e => set("event_date", e.target.value)} />
            </Field>
            <Field label="Time">
              <input type="time" className={inputCls} value={v.event_time} onChange={e => set("event_time", e.target.value)} />
            </Field>
            <Field label="Venue">
              <input className={inputCls} value={v.venue} onChange={e => set("venue", e.target.value)} />
            </Field>
            <Field label="External Link">
              <input className={inputCls} placeholder="https://..." value={v.link_url} onChange={e => set("link_url", e.target.value)} />
            </Field>
            <Field label="University" required>
              <select className={inputCls} value={v.university} onChange={e => set("university", e.target.value)}>
                <option value="">Select university</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Faculty" required>
              <select className={inputCls} value={v.faculty} onChange={e => set("faculty", e.target.value)}>
                <option value="">Select faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea rows={4} className={inputCls} value={v.description} onChange={e => set("description", e.target.value)} />
              </Field>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="rounded-xl border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          <button disabled={saving} onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Post"}
          </button>
        </div>
      </main>
    </div>
  );
}
