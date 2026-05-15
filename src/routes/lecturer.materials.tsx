import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage, DEPARTMENTS, FACULTIES, UNIVERSITIES } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/materials")({
  component: () => (
    <LecturerFormPage
      title="Study Materials"
      fields={[
        { name: "courseSubject", label: "Course / Subject", type: "text", required: true },
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "faculty", label: "Faculty", type: "select", required: true, options: FACULTIES },
        { name: "university", label: "University", type: "select", required: true, options: UNIVERSITIES },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "subtitleYear", label: "Sub-title with Year", type: "text" },
        { name: "materialType", label: "Study Materials Type", type: "select", required: true, options: ["Notes", "Slides", "Past Paper", "Video", "Assignment"] },
        { name: "description", label: "Description", type: "textarea" },
        { name: "file", label: "File Upload", type: "file" },
        { name: "linkUrl", label: "Or Link URL", type: "url", placeholder: "https://drive.google.com/…" },
      ]}
    />
  ),
});
