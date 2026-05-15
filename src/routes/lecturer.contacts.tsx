import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, UNIVERSITIES, FACULTIES, DEPARTMENTS, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/contacts")({ component: Page });

const FIELDS: Field[] = [
  { name: "lecturer_name", label: "Lecturer Name", type: "text", required: true },
  { name: "occupation", label: "Occupation", type: "text", required: true },
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
  { name: "faculty", label: "Faculty", type: "select", options: FACULTIES, required: true },
  { name: "university", label: "University", type: "select", options: UNIVERSITIES, required: true },
  { name: "whatsapp_number", label: "WhatsApp Number", type: "tel", required: true, placeholder: "+94 7X XXX XXXX" },
  { name: "email", label: "University Mail Address", type: "email", required: true },
  { name: "photo", label: "Photo", type: "file" },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Add Lecturer Contact" subtitle="Share contact details with your students">
      <LecturerForm fields={FIELDS} onSubmit={(data) => { console.log("contact", data); toast.success("Contact added"); }} />
    </FormShell>
  );
}
