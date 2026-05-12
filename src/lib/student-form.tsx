import { ReactNode } from "react";

export const UNIVERSITIES = [
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

export const FACULTIES = [
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

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
export const labelCls = "block text-sm font-medium mb-1.5 text-foreground";
export const Req = () => <span className="text-destructive">*</span>;

export type CommonFields = {
  fullName: string;
  studentId: string;
  university: string;
  faculty: string;
  department: string;
  academicYear: string;
  semester: string;
  subjectName: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  hall: string;
  lecturer: string;
};

export const emptyCommon = (): CommonFields => ({
  fullName: "", studentId: "", university: "", faculty: "", department: "",
  academicYear: "", semester: "", subjectName: "", subjectId: "",
  day: "", startTime: "", endTime: "", hall: "", lecturer: "",
});

export type StudentOnly = {
  fullName: string;
  studentId: string;
  university: string;
  faculty: string;
  department: string;
  academicYear: string;
  semester: string;
};

export const emptyStudentOnly = (): StudentOnly => ({
  fullName: "", studentId: "", university: "", faculty: "", department: "",
  academicYear: "", semester: "",
});

export function validateStudentOnly(v: StudentOnly): string | null {
  const required: (keyof StudentOnly)[] = [
    "fullName","studentId","university","faculty","department","academicYear","semester",
  ];
  for (const k of required) if (!v[k]) return "Please fill all required student fields";
  return null;
}

export function studentOnlyToInsert(v: StudentOnly) {
  return {
    full_name: v.fullName,
    student_id: v.studentId,
    university: v.university,
    faculty: v.faculty,
    department: v.department,
    academic_year: v.academicYear,
    semester: v.semester,
  };
}

export function StudentDetailsFields({
  v, set,
}: { v: StudentOnly; set: (k: keyof StudentOnly, val: string) => void }) {
  return (
    <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Student Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name with Initial" required>
          <input className={inputCls} value={v.fullName} onChange={e => set("fullName", e.target.value)} />
        </Field>
        <Field label="Student ID" required>
          <input className={inputCls} value={v.studentId} onChange={e => set("studentId", e.target.value)} />
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
        <Field label="Year" required>
          <select className={inputCls} value={v.academicYear} onChange={e => set("academicYear", e.target.value)}>
            <option value="">Select year</option>
            {["Year 1", "Year 2", "Year 3", "Year 4"].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Semester" required>
          <select className={inputCls} value={v.semester} onChange={e => set("semester", e.target.value)}>
            <option value="">Select semester</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
        </Field>
      </div>
    </section>
  );
}

export function CommonStudentFields({
  v, set,
}: { v: CommonFields; set: (k: keyof CommonFields, val: string) => void }) {
  return (
    <>
      <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Student Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name with Initial" required>
            <input className={inputCls} value={v.fullName} onChange={e => set("fullName", e.target.value)} />
          </Field>
          <Field label="Student ID" required>
            <input className={inputCls} value={v.studentId} onChange={e => set("studentId", e.target.value)} />
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
          <Field label="Year" required>
            <select className={inputCls} value={v.academicYear} onChange={e => set("academicYear", e.target.value)}>
              <option value="">Select year</option>
              {["Year 1", "Year 2", "Year 3", "Year 4"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Semester" required>
            <select className={inputCls} value={v.semester} onChange={e => set("semester", e.target.value)}>
              <option value="">Select semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Subject Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Subject Name" required>
            <input className={inputCls} value={v.subjectName} onChange={e => set("subjectName", e.target.value)} />
          </Field>
          <Field label="Subject ID" required>
            <input className={inputCls} value={v.subjectId} onChange={e => set("subjectId", e.target.value)} />
          </Field>
          <Field label="Day" required>
            <select className={inputCls} value={v.day} onChange={e => set("day", e.target.value)}>
              <option value="">Select day</option>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Hall" required>
            <input className={inputCls} value={v.hall} onChange={e => set("hall", e.target.value)} />
          </Field>
          <Field label="Start Time" required>
            <input type="time" className={inputCls} value={v.startTime} onChange={e => set("startTime", e.target.value)} />
          </Field>
          <Field label="End Time" required>
            <input type="time" className={inputCls} value={v.endTime} onChange={e => set("endTime", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Lecturer" required>
              <input className={inputCls} value={v.lecturer} onChange={e => set("lecturer", e.target.value)} />
            </Field>
          </div>
        </div>
      </section>
    </>
  );
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label} {required && <Req />}</label>
      {children}
    </div>
  );
}

export function validateCommon(v: CommonFields): string | null {
  const required: (keyof CommonFields)[] = [
    "fullName","studentId","university","faculty","department","academicYear","semester",
    "subjectName","subjectId","day","startTime","endTime","hall","lecturer",
  ];
  for (const k of required) if (!v[k]) return "Please fill all required fields";
  return null;
}

export function commonToInsert(v: CommonFields) {
  return {
    full_name: v.fullName,
    student_id: v.studentId,
    university: v.university,
    faculty: v.faculty,
    department: v.department,
    academic_year: v.academicYear,
    semester: v.semester,
    subject_name: v.subjectName,
    subject_id: v.subjectId,
    day: v.day,
    start_time: v.startTime,
    end_time: v.endTime,
    hall: v.hall,
    lecturer: v.lecturer,
  };
}
