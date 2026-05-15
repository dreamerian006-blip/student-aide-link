import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, UNIVERSITIES, FACULTIES, DEPARTMENTS, SEMESTERS, DAYS, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/timetable")({ component: Page });

const FIELDS: Field[] = [
  { name: "subject_name", label: "Subject Name", type: "text", required: true },
  { name: "subject_id", label: "Subject ID", type: "text", required: true },
  { name: "day", label: "Day", type: "select", options: DAYS, required: true },
  { name: "time", label: "Time", type: "time", required: true },
  { name: "hall", label: "Hall", type: "text", required: true },
  { name: "lecturer", label: "Lecturer", type: "text", required: true },
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
  { name: "faculty", label: "Faculty", type: "select", options: FACULTIES, required: true },
  { name: "university", label: "University", type: "select", options: UNIVERSITIES, required: true },
  { name: "semester", label: "Semester", type: "select", options: SEMESTERS, required: true },
  { name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2025/2026" },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Add Timetable Entry" subtitle="Post a class to your students' weekly schedule">
      <LecturerForm fields={FIELDS} onSubmit={(data) => { console.log("timetable", data); toast.success("Timetable entry added"); }} />
    </FormShell>
  );
}
