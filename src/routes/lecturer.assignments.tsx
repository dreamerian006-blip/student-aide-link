import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/assignments")({
  component: () => (
    <LecturerFormPage
      title="Assignments"
      fields={[
        { name: "subjectName", label: "Subject Name", type: "text", required: true },
        { name: "subjectId", label: "Subject ID", type: "text", required: true },
        { name: "title", label: "Assignment Title", type: "text", required: true },
        { name: "assignmentType", label: "Assignment Type", type: "text", required: true, placeholder: "Individual / Group" },
        { name: "dueDate", label: "Due Date", type: "date", required: true },
        { name: "dueTime", label: "Due Time", type: "time", required: true },
        { name: "submissionLink", label: "Submission Link", type: "url", placeholder: "https://…" },
        { name: "maxMarks", label: "Max Marks", type: "number", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
      ]}
    />
  ),
});
