import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage, DEPARTMENTS, FACULTIES, UNIVERSITIES } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/university-forms")({
  component: () => (
    <LecturerFormPage
      title="University Forms"
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "subtitleYear", label: "Subtitle Year", type: "text" },
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "faculty", label: "Faculty", type: "select", required: true, options: FACULTIES },
        { name: "university", label: "University", type: "select", required: true, options: UNIVERSITIES },
        { name: "academicYear", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2024/2025" },
        { name: "file", label: "File Upload", type: "file" },
        { name: "linkUrl", label: "Or Link URL", type: "url", placeholder: "https://…" },
      ]}
    />
  ),
});
