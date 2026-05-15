import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage, DEPARTMENTS, FACULTIES, UNIVERSITIES, SEMESTERS, YEARS } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/exams")({
  component: () => (
    <LecturerFormPage
      title="Exam Schedule"
      fields={[
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "faculty", label: "Faculty", type: "select", required: true, options: FACULTIES },
        { name: "university", label: "University", type: "select", required: true, options: UNIVERSITIES },
        { name: "year", label: "Year", type: "select", required: true, options: YEARS },
        { name: "semester", label: "Semester", type: "select", required: true, options: SEMESTERS },
        { name: "subjectName", label: "Subject Name", type: "text", required: true },
        { name: "subjectId", label: "Subject ID", type: "text", required: true },
        { name: "examType", label: "Exam Type", type: "text", required: true, placeholder: "Mid / Final" },
        { name: "examDate", label: "Exam Date", type: "date", required: true },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "hall", label: "Hall / Venue", type: "text", required: true },
      ]}
    />
  ),
});
