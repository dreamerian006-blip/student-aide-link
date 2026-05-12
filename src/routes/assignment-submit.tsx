import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  StudentOnly, StudentDetailsFields, Field, emptyStudentOnly, inputCls,
  validateStudentOnly, studentOnlyToInsert,
} from "@/lib/student-form";

export const Route = createFileRoute("/assignment-submit")({ component: AssignmentSubmit });

type AssignmentEntry = {
  subjectName: string; subjectId: string;
  title: string; type: string; dueDate: string; dueTime: string;
  link: string; maxMarks: string; description: string;
  open: boolean;
};

const emptyA = (): AssignmentEntry => ({
  subjectName: "", subjectId: "", title: "", type: "", dueDate: "",
  dueTime: "", link: "", maxMarks: "", description: "", open: true,
});

function AssignmentSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState<StudentOnly>(emptyStudentOnly());
  const [items, setItems] = useState<AssignmentEntry[]>([emptyA()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const setField = (k: keyof StudentOnly, val: string) => setS(p => ({ ...p, [k]: val }));
  const update = (i: number, patch: Partial<AssignmentEntry>) =>
    setItems(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const add = () => setItems(prev => [...prev.map(e => ({ ...e, open: false })), emptyA()]);

  const submit = async () => {
    const err = validateStudentOnly(s);
    if (err) return toast.error(err);
    for (const [i, a] of items.entries()) {
      if (!a.subjectName || !a.subjectId || !a.title || !a.type || !a.dueDate || !a.dueTime || !a.link || !a.maxMarks || !a.description) {
        return toast.error(`Please fill all required fields for assignment ${i + 1}`);
      }
    }
    if (!user) return;
    setSaving(true);
    const rows = items.map(a => ({
      user_id: user.id,
      submission_type: "assignment",
      ...studentOnlyToInsert(s),
      subject_name: a.subjectName,
      subject_id: a.subjectId,
      data: {
        title: a.title, assignment_type: a.type, due_date: a.dueDate,
        due_time: a.dueTime, description: a.description,
        submission_link: a.link, max_marks: a.maxMarks,
      },
    }));
    const { error } = await supabase.from("student_submissions").insert(rows);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`${items.length} Assignment${items.length > 1 ? "s" : ""} Added Successfully`);
    navigate({ to: "/dashboard" });
  };

  return (
    <Shell title="Submit Assignment">
      <StudentDetailsFields v={s} set={setField} />

      {items.map((a, i) => (
        <section key={i} className="rounded-2xl border bg-card p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => update(i, { open: !a.open })} className="flex items-center gap-2 text-left">
              {a.open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <h2 className="text-lg font-semibold">
                Assignment {i + 1}{a.title ? ` — ${a.title}` : ""}
              </h2>
            </button>
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-destructive hover:opacity-80 p-1.5" aria-label="Remove assignment">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {a.open && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Subject Name" required>
                <input className={inputCls} value={a.subjectName} onChange={e => update(i, { subjectName: e.target.value })} />
              </Field>
              <Field label="Subject ID" required>
                <input className={inputCls} value={a.subjectId} onChange={e => update(i, { subjectId: e.target.value })} />
              </Field>
              <Field label="Assignment Title" required>
                <input className={inputCls} value={a.title} onChange={e => update(i, { title: e.target.value })} />
              </Field>
              <Field label="Assignment Type" required>
                <select className={inputCls} value={a.type} onChange={e => update(i, { type: e.target.value })}>
                  <option value="">Select type</option>
                  {["Individual","Group","Report","Presentation","Project","Lab"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Due Date" required>
                <input type="date" className={inputCls} value={a.dueDate} onChange={e => update(i, { dueDate: e.target.value })} />
              </Field>
              <Field label="Due Time" required>
                <input type="time" className={inputCls} value={a.dueTime} onChange={e => update(i, { dueTime: e.target.value })} />
              </Field>
              <Field label="Submission Link" required>
                <input className={inputCls} value={a.link} onChange={e => update(i, { link: e.target.value })} placeholder="https://..." />
              </Field>
              <Field label="Max Marks" required>
                <input type="number" className={inputCls} value={a.maxMarks} onChange={e => update(i, { maxMarks: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description" required>
                  <textarea rows={4} className={inputCls} value={a.description} onChange={e => update(i, { description: e.target.value })} />
                </Field>
              </div>
            </div>
          )}
        </section>
      ))}

      <button
        type="button"
        onClick={add}
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-input px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Add Another Assignment
      </button>

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Assignment"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
