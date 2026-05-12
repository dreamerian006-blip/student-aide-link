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

export const Route = createFileRoute("/exam-submit")({ component: ExamSubmit });

type ExamEntry = {
  subjectName: string; subjectId: string;
  examType: string; examDate: string; examStart: string; examEnd: string;
  venue: string; seat: string;
  open: boolean;
};

const emptyExam = (): ExamEntry => ({
  subjectName: "", subjectId: "", examType: "", examDate: "",
  examStart: "", examEnd: "", venue: "", seat: "", open: true,
});

function ExamSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState<StudentOnly>(emptyStudentOnly());
  const [exams, setExams] = useState<ExamEntry[]>([emptyExam()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const setField = (k: keyof StudentOnly, val: string) => setS(p => ({ ...p, [k]: val }));
  const updateExam = (i: number, patch: Partial<ExamEntry>) =>
    setExams(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const removeExam = (i: number) => setExams(prev => prev.filter((_, idx) => idx !== i));
  const addExam = () => setExams(prev => [...prev.map(e => ({ ...e, open: false })), emptyExam()]);

  const submit = async () => {
    const err = validateStudentOnly(s);
    if (err) return toast.error(err);
    for (const [i, e] of exams.entries()) {
      if (!e.subjectName || !e.subjectId || !e.examType || !e.examDate || !e.examStart || !e.examEnd || !e.venue || !e.seat) {
        return toast.error(`Please fill all required fields for exam ${i + 1}`);
      }
    }
    if (!user) return;
    setSaving(true);
    const rows = exams.map(e => ({
      user_id: user.id,
      submission_type: "exam",
      ...studentOnlyToInsert(s),
      subject_name: e.subjectName,
      subject_id: e.subjectId,
      data: {
        exam_type: e.examType, exam_date: e.examDate,
        exam_start: e.examStart, exam_end: e.examEnd,
        venue: e.venue, seat_number: e.seat,
      },
    }));
    const { error } = await supabase.from("student_submissions").insert(rows);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`${exams.length} Exam${exams.length > 1 ? "s" : ""} Added Successfully`);
    navigate({ to: "/dashboard" });
  };

  return (
    <Shell title="Submit Exam Schedule">
      <StudentDetailsFields v={s} set={setField} />

      {exams.map((e, i) => (
        <section key={i} className="rounded-2xl border bg-card p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => updateExam(i, { open: !e.open })}
              className="flex items-center gap-2 text-left"
            >
              {e.open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <h2 className="text-lg font-semibold">
                Exam {i + 1}{e.subjectName ? ` — ${e.subjectName}` : ""}
              </h2>
            </button>
            {exams.length > 1 && (
              <button
                type="button"
                onClick={() => removeExam(i)}
                className="text-destructive hover:opacity-80 p-1.5"
                aria-label="Remove exam"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {e.open && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Subject Name" required>
                <input className={inputCls} value={e.subjectName} onChange={ev => updateExam(i, { subjectName: ev.target.value })} />
              </Field>
              <Field label="Subject ID" required>
                <input className={inputCls} value={e.subjectId} onChange={ev => updateExam(i, { subjectId: ev.target.value })} />
              </Field>
              <Field label="Exam Type" required>
                <select className={inputCls} value={e.examType} onChange={ev => updateExam(i, { examType: ev.target.value })}>
                  <option value="">Select type</option>
                  {["Mid Semester", "End Semester", "Quiz", "Practical", "Viva"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Exam Date" required>
                <input type="date" className={inputCls} value={e.examDate} onChange={ev => updateExam(i, { examDate: ev.target.value })} />
              </Field>
              <Field label="Start Time" required>
                <input type="time" className={inputCls} value={e.examStart} onChange={ev => updateExam(i, { examStart: ev.target.value })} />
              </Field>
              <Field label="End Time" required>
                <input type="time" className={inputCls} value={e.examEnd} onChange={ev => updateExam(i, { examEnd: ev.target.value })} />
              </Field>
              <Field label="Hall / Venue" required>
                <input className={inputCls} value={e.venue} onChange={ev => updateExam(i, { venue: ev.target.value })} />
              </Field>
              <Field label="Seat Number" required>
                <input className={inputCls} value={e.seat} onChange={ev => updateExam(i, { seat: ev.target.value })} />
              </Field>
            </div>
          )}
        </section>
      ))}

      <button
        type="button"
        onClick={addExam}
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-input px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Add Another Exam
      </button>

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Exam Schedule"}
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
