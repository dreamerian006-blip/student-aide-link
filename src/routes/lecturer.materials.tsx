import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, UNIVERSITIES, FACULTIES, DEPARTMENTS, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/materials")({ component: Page });

const TYPES = ["Notes", "Slides", "Past Paper", "Video", "Assignment"];

const FIELDS: Field[] = [
  { name: "course_subject", label: "Course / Subject", type: "text", required: true },
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
  { name: "faculty", label: "Faculty", type: "select", options: FACULTIES, required: true },
  { name: "university", label: "University", type: "select", options: UNIVERSITIES, required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle_year", label: "Sub-title with Year", type: "text", placeholder: "e.g. Year 2 - Lecture 5" },
  { name: "material_type", label: "Study Materials Type", type: "select", options: TYPES, required: true },
  { name: "description", label: "Description", type: "textarea", fullWidth: true },
  { name: "file", label: "File Upload", type: "file" },
  { name: "link_url", label: "Or Link (Google Drive, etc.)", type: "url", placeholder: "https://..." },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Upload Study Materials" subtitle="Share notes, slides, past papers and more">
      <LecturerForm fields={FIELDS} onSubmit={(data) => {
        if (!data.file && !data.link_url) { toast.error("Provide a file or link"); return; }
        console.log("material", data); toast.success("Material uploaded");
      }} />
    </FormShell>
  );
}
