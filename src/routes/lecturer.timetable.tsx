import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage, DAYS, DEPARTMENTS, FACULTIES, UNIVERSITIES, SEMESTERS } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/timetable")({
  component: () => (
    <LecturerFormPage
      title="Semester Timetable"
      fields={[
        { name: "subjectName", label: "Subject Name", type: "text", required: true },
        { name: "subjectId", label: "Subject ID", type: "text", required: true },
        { name: "day", label: "Day", type: "select", required: true, options: DAYS },
        { name: "time", label: "Time", type: "time", required: true },
        { name: "hall", label: "Hall", type: "text", required: true },
        { name: "lecturer", label: "Lecturer", type: "text", required: true },
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "faculty", label: "Faculty", type: "select", required: true, options: FACULTIES },
        { name: "university", label: "University", type: "select", required: true, options: UNIVERSITIES },
        { name: "semester", label: "Semester", type: "select", required: true, options: SEMESTERS },
        { name: "academicYear", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2024/2025" },
      ]}
    />
  ),
});
