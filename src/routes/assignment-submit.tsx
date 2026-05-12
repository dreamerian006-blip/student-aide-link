import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  CommonFields, CommonStudentFields, Field, emptyCommon, inputCls,
  validateCommon, commonToInsert,
} from "@/lib/student-form";

export const Route = createFileRoute("/assignment-submit")({ component: AssignmentSubmit });

function AssignmentSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState<CommonFields>(emptyCommon());
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const set = (k: keyof CommonFields, val: string) => setV(p => ({ ...p, [k]: val }));

  const submit = async () => {
    const err = validateCommon(v);
    if (err) return toast.error(err);
    if (!title || !type || !dueDate || !dueTime || !description || !link || !maxMarks) {
      return toast.error("Please fill all assignment details");
    }
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("student_submissions").insert({
      user_id: user.id,
      submission_type: "assignment",
      ...commonToInsert(v),
      data: {
        title, assignment_type: type, due_date: dueDate, due_time: dueTime,
        description, submission_link: link, max_marks: maxMarks,
      },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Assignment submitted");
    navigate({ to: "/dashboard" });
  };

  return (
    <Shell title="Submit Assignment">
      <CommonStudentFields v={v} set={set} />
      <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Assignment Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Assignment Title" required>
            <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} />
          </Field>
          <Field label="Assignment Type" required>
            <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
              <option value="">Select type</option>
              {["Individual","Group","Report","Presentation","Project","Lab"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Due Date" required>
            <input type="date" className={inputCls} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </Field>
          <Field label="Due Time" required>
            <input type="time" className={inputCls} value={dueTime} onChange={e => setDueTime(e.target.value)} />
          </Field>
          <Field label="Submission Link" required>
            <input className={inputCls} value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Max Marks" required>
            <input type="number" className={inputCls} value={maxMarks} onChange={e => setMaxMarks(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" required>
              <textarea rows={4} className={inputCls} value={description} onChange={e => setDescription(e.target.value)} />
            </Field>
          </div>
        </div>
      </section>
      <SubmitBar saving={saving} onSubmit={submit} label="Submit Assignment" />
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

function SubmitBar({ saving, onSubmit, label }: { saving: boolean; onSubmit: () => void; label: string }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onSubmit}
        disabled={saving}
        className="w-full sm:w-auto rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : label}
      </button>
    </div>
  );
}
