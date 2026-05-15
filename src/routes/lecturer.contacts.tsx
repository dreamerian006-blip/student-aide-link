import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage, DEPARTMENTS, FACULTIES, UNIVERSITIES } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/contacts")({
  component: () => (
    <LecturerFormPage
      title="Lecturer Contacts"
      fields={[
        { name: "lecturerName", label: "Lecturer Name", type: "text", required: true },
        { name: "occupation", label: "Occupation", type: "text", required: true },
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "faculty", label: "Faculty", type: "select", required: true, options: FACULTIES },
        { name: "university", label: "University", type: "select", required: true, options: UNIVERSITIES },
        { name: "whatsapp", label: "WhatsApp Number", type: "tel", required: true, placeholder: "+94…" },
        { name: "email", label: "University Mail Address", type: "email", required: true },
        { name: "photo", label: "Photo", type: "file" },
      ]}
    />
  ),
});
