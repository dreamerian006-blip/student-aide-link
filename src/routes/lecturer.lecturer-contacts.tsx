import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/lecturer-contacts")({
  component: () => (
    <LecturerSubmitPage
      title="Lecturer Contacts"
      subtitle="Add or update lecturer contact details"
      successMessage="Lecturer contact submitted successfully"
      fields={[
        { name: "name", label: "Lecturer Name", required: true },
        { name: "role", label: "Work / Role", required: true, placeholder: "e.g. Senior Lecturer" },
        { name: "department", label: "Department", required: true },
        { name: "faculty", label: "Faculty", required: true },
        { name: "whatsapp", label: "WhatsApp Number", required: true, placeholder: "+94..." },
        { name: "email", label: "University Email", type: "email", required: true },
      ]}
    />
  ),
});
