import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/university-forms")({
  component: () => (
    <LecturerSubmitPage
      title="University Forms"
      subtitle="Upload an official form, notice, or circular"
      successMessage="University form submitted successfully"
      fields={[
        { name: "title", label: "Form Title", required: true },
        { name: "category", label: "Category", type: "select", required: true, options: ["Form", "Notice", "Circular", "Application"] },
        { name: "department", label: "Department", required: true },
        { name: "faculty", label: "Faculty", required: true },
        { name: "link", label: "Document Link", type: "url" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  ),
});
