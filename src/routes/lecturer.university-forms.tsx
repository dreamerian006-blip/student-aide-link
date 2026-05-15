import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, UNIVERSITIES, FACULTIES, DEPARTMENTS, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/university-forms")({ component: Page });

const FIELDS: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle_year", label: "Subtitle Year", type: "text" },
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
  { name: "faculty", label: "Faculty", type: "select", options: FACULTIES, required: true },
  { name: "university", label: "University", type: "select", options: UNIVERSITIES, required: true },
  { name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2025/2026" },
  { name: "file", label: "File Upload", type: "file" },
  { name: "link_url", label: "Or Link", type: "url", placeholder: "https://..." },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Upload University Form" subtitle="Share official documents and circulars">
      <LecturerForm fields={FIELDS} onSubmit={(data) => {
        if (!data.file && !data.link_url) { toast.error("Provide a file or link"); return; }
        console.log("university-form", data); toast.success("Form uploaded");
      }} />
    </FormShell>
  );
}
