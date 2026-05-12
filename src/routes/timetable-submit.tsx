import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/timetable-submit")({
  component: TimetableSubmit,
});

const UNIVERSITIES = [
  "University of Colombo",
  "University of Peradeniya",
  "University of Moratuwa",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Ruhuna",
  "University of Jaffna",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "Uva Wellassa University",
  "Other",
];

const FACULTIES = [
  "Faculty of Science",
  "Faculty of Technology",
  "Faculty of Engineering",
  "Faculty of Medicine",
  "Faculty of Arts",
  "Faculty of Management",
  "Faculty of Law",
  "Faculty of Computing",
  "Faculty of Agriculture",
  "Faculty of Architecture",
  "Faculty of Education",
  "Other",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type Subject = {
  name: string;
  code: string;
  day: string;
  start_time: string;
  end_time: string;
  hall: string;
  lecturer: string;
};

const emptySubject = (): Subject => ({
  name: "", code: "", day: "", start_time: "", end_time: "", hall: "", lecturer: "",
});

function TimetableSubmit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([emptySubject()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } as any });
  }, [loading, user, navigate]);

  const updateSubject = (i: number, key: keyof Subject, value: string) => {
    setSubjects(s => s.map((sub, idx) => idx === i ? { ...sub, [key]: value } : sub));
  };

  const addSubject = () => setSubjects(s => [...s, emptySubject()]);
  const removeSubject = (i: number) => setSubjects(s => s.length > 1 ? s.filter((_, idx) => idx !== i) : s);

  const validate = () => {
    if (!fullName || !studentId || !university || !faculty || !department || !academicYear || !semester) {
      toast.error("Please fill all student details");
      return false;
    }
    for (const [i, s] of subjects.entries()) {
      if (!s.name || !s.code || !s.day || !s.start_time || !s.end_time || !s.hall || !s.lecturer) {
        toast.error(`Please fill all fields for subject ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async (status: "draft" | "submitted") => {
    if (status === "submitted" && !validate()) return;
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("timetables").insert({
      user_id: user.id,
      full_name: fullName,
      student_id: studentId,
      university,
      faculty,
      department,
      academic_year: academicYear,
      semester,
      subjects: subjects as any,
      status,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (status === "submitted") {
      toast.success("Timetable submitted successfully");
      navigate({ to: "/dashboard" });
    } else {
      toast.success("Draft saved");
    }
  };

  const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-sm font-medium mb-1.5 text-foreground";
  const required = <span className="text-destructive">*</span>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-2xl font-semibold mb-1">Submit Semester Timetable</h1>
        <p className="text-sm text-muted-foreground mb-6">Fill in your details and weekly subjects.</p>

        {/* Student Details */}
        <section className="rounded-2xl border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Student Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name with Initial {required}</label>
              <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Student ID / Index Number {required}</label>
              <input className={inputCls} value={studentId} onChange={e => setStudentId(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>University {required}</label>
              <select className={inputCls} value={university} onChange={e => setUniversity(e.target.value)}>
                <option value="">Select university</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Faculty {required}</label>
              <select className={inputCls} value={faculty} onChange={e => setFaculty(e.target.value)}>
                <option value="">Select faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Department {required}</label>
              <input className={inputCls} value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Academic Year {required}</label>
              <select className={inputCls} value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
                <option value="">Select year</option>
                {["Year 1", "Year 2", "Year 3", "Year 4"].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Semester {required}</label>
              <select className={inputCls} value={semester} onChange={e => setSemester(e.target.value)}>
                <option value="">Select semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section className="rounded-2xl border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Subjects</h2>
          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div key={i} className="rounded-xl border bg-background p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Subject {i + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSubject(i)}
                    disabled={subjects.length === 1}
                    className="text-destructive hover:bg-destructive/10 rounded-md p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Delete subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Subject Name {required}</label>
                    <input className={inputCls} value={s.name} onChange={e => updateSubject(i, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Subject Code/ID {required}</label>
                    <input className={inputCls} value={s.code} onChange={e => updateSubject(i, "code", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Day {required}</label>
                    <select className={inputCls} value={s.day} onChange={e => updateSubject(i, "day", e.target.value)}>
                      <option value="">Select day</option>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Lecture Hall {required}</label>
                    <input className={inputCls} value={s.hall} onChange={e => updateSubject(i, "hall", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Start Time {required}</label>
                    <input type="time" className={inputCls} value={s.start_time} onChange={e => updateSubject(i, "start_time", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>End Time {required}</label>
                    <input type="time" className={inputCls} value={s.end_time} onChange={e => updateSubject(i, "end_time", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Lecturer Name {required}</label>
                    <input className={inputCls} value={s.lecturer} onChange={e => updateSubject(i, "lecturer", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSubject}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 w-full justify-center"
          >
            <Plus className="h-4 w-4" /> Add Another Subject
          </button>
        </section>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-lg bg-muted px-5 py-2.5 text-sm font-medium hover:bg-muted/70 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("submitted")}
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Submit Timetable"}
          </button>
        </div>
      </main>
    </div>
  );
}
