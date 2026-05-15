import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/assignments")({ component: Page });

const FIELDS: Field[] = [
  { name: "subject_name", label: "Subject Name", type: "text", required: true },
  { name: "subject_id", label: "Subject ID", type: "text", required: true },
  { name: "title", label: "Assignment Title", type: "text", required: true },
  { name: "type", label: "Assignment Type", type: "text", required: true, placeholder: "Individual / Group / Project" },
  { name: "due_date", label: "Due Date", type: "date", required: true },
  { name: "due_time", label: "Due Time", type: "time", required: true },
  { name: "submission_link", label: "Submission Link", type: "url", placeholder: "https://..." },
  { name: "max_marks", label: "Max Marks", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, fullWidth: true },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Post Assignment" subtitle="Share assignments and due dates with students">
      <LecturerForm fields={FIELDS} onSubmit={(data) => { console.log("assignment", data); toast.success("Assignment posted"); }} />
    </FormShell>
  );
}
