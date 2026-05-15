import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, UNIVERSITIES, FACULTIES, DEPARTMENTS, SEMESTERS, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/exams")({ component: Page });

const FIELDS: Field[] = [
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
  { name: "faculty", label: "Faculty", type: "select", options: FACULTIES, required: true },
  { name: "university", label: "University", type: "select", options: UNIVERSITIES, required: true },
  { name: "year", label: "Year", type: "text", required: true, placeholder: "e.g. Year 2" },
  { name: "semester", label: "Semester", type: "select", options: SEMESTERS, required: true },
  { name: "subject_name", label: "Subject Name", type: "text", required: true },
  { name: "subject_id", label: "Subject ID", type: "text", required: true },
  { name: "exam_type", label: "Exam Type", type: "text", required: true, placeholder: "Mid / Final / Quiz" },
  { name: "exam_date", label: "Exam Date", type: "date", required: true },
  { name: "start_time", label: "Start Time", type: "time", required: true },
  { name: "end_time", label: "End Time", type: "time", required: true },
  { name: "hall", label: "Hall / Venue", type: "text", required: true },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Add Exam Schedule" subtitle="Publish exam dates, times and venues">
      <LecturerForm fields={FIELDS} onSubmit={(data) => { console.log("exam", data); toast.success("Exam added"); }} />
    </FormShell>
  );
}
