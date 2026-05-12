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

export const Route = createFileRoute("/exam-submit")({ component: ExamSubmit });

function ExamSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState<CommonFields>(emptyCommon());
  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examStart, setExamStart] = useState("");
  const [examEnd, setExamEnd] = useState("");
  const [venue, setVenue] = useState("");
  const [seat, setSeat] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const set = (k: keyof CommonFields, val: string) => setV(p => ({ ...p, [k]: val }));

  const submit = async () => {
    const err = validateCommon(v);
    if (err) return toast.error(err);
    if (!examType || !examDate || !examStart || !examEnd || !venue || !seat) {
      return toast.error("Please fill all exam details");
    }
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("student_submissions").insert({
      user_id: user.id,
      submission_type: "exam",
      ...commonToInsert(v),
      data: { exam_type: examType, exam_date: examDate, exam_start: examStart, exam_end: examEnd, venue, seat_number: seat },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Exam schedule submitted");
    navigate({ to: "/dashboard" });
  };

  return (
    <Shell title="Submit Exam Schedule">
      <CommonStudentFields v={v} set={set} />
      <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Exam Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Exam Type" required>
            <select className={inputCls} value={examType} onChange={e => setExamType(e.target.value)}>
              <option value="">Select type</option>
              {["Mid Semester","End Semester","Quiz","Practical","Viva"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Exam Date" required>
            <input type="date" className={inputCls} value={examDate} onChange={e => setExamDate(e.target.value)} />
          </Field>
          <Field label="Start Time" required>
            <input type="time" className={inputCls} value={examStart} onChange={e => setExamStart(e.target.value)} />
          </Field>
          <Field label="End Time" required>
            <input type="time" className={inputCls} value={examEnd} onChange={e => setExamEnd(e.target.value)} />
          </Field>
          <Field label="Hall / Venue" required>
            <input className={inputCls} value={venue} onChange={e => setVenue(e.target.value)} />
          </Field>
          <Field label="Seat Number" required>
            <input className={inputCls} value={seat} onChange={e => setSeat(e.target.value)} />
          </Field>
        </div>
      </section>
      <SubmitBar saving={saving} onSubmit={submit} label="Submit Exam Schedule" />
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
