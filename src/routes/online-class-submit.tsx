import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  StudentOnly, StudentDetailsFields, Field, emptyStudentOnly, inputCls,
  validateStudentOnly, studentOnlyToInsert,
} from "@/lib/student-form";

export const Route = createFileRoute("/online-class-submit")({ component: OnlineClassSubmit });

function OnlineClassSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState<StudentOnly>(emptyStudentOnly());
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [classDate, setClassDate] = useState("");
  const [platform, setPlatform] = useState("");
  const [startT, setStartT] = useState("");
  const [endT, setEndT] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const setField = (k: keyof StudentOnly, val: string) => setS(p => ({ ...p, [k]: val }));

  const submit = async () => {
    const err = validateStudentOnly(s);
    if (err) return toast.error(err);
    if (!subjectName || !subjectId || !lecturer || !classDate || !platform || !startT || !endT || !meetingLink) {
      return toast.error("Please fill all required class details");
    }
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("student_submissions").insert({
      user_id: user.id,
      submission_type: "class",
      ...studentOnlyToInsert(s),
      subject_name: subjectName,
      subject_id: subjectId,
      lecturer,
      data: {
        class_date: classDate, platform,
        class_start: startT, class_end: endT,
        meeting_link: meetingLink, meeting_id: meetingId, passcode,
      },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Online class submitted");
    navigate({ to: "/dashboard" });
  };

  return (
    <Shell title="Submit Online Class">
      <StudentDetailsFields v={s} set={setField} />
      <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Online Class Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Subject Name" required>
            <input className={inputCls} value={subjectName} onChange={e => setSubjectName(e.target.value)} />
          </Field>
          <Field label="Subject ID" required>
            <input className={inputCls} value={subjectId} onChange={e => setSubjectId(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Lecturer" required>
              <input className={inputCls} value={lecturer} onChange={e => setLecturer(e.target.value)} />
            </Field>
          </div>
          <Field label="Class Date" required>
            <input type="date" className={inputCls} value={classDate} onChange={e => setClassDate(e.target.value)} />
          </Field>
          <Field label="Platform" required>
            <select className={inputCls} value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="">Select platform</option>
              {["Zoom","Microsoft Teams","Google Meet","Webex","Other"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Start Time" required>
            <input type="time" className={inputCls} value={startT} onChange={e => setStartT(e.target.value)} />
          </Field>
          <Field label="End Time" required>
            <input type="time" className={inputCls} value={endT} onChange={e => setEndT(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Meeting Link" required>
              <input className={inputCls} value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Meeting ID">
            <input className={inputCls} value={meetingId} onChange={e => setMeetingId(e.target.value)} />
          </Field>
          <Field label="Passcode">
            <input className={inputCls} value={passcode} onChange={e => setPasscode(e.target.value)} />
          </Field>
        </div>
      </section>
      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="w-full sm:w-auto rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Online Class"}
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
