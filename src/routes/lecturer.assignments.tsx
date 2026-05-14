import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/assignments")({
  component: () => (
    <LecturerSubmitPage
      title="Assignments"
      subtitle="Post a new assignment for students"
      successMessage="Assignment submitted successfully"
      fields={[
        { name: "subject", label: "Subject", required: true },
        { name: "subjectId", label: "Subject ID", required: true },
        { name: "title", label: "Assignment Title", required: true },
        { name: "type", label: "Assignment Type", type: "select", required: true, options: ["Individual", "Group", "Project", "Lab"] },
        { name: "dueDate", label: "Due Date", type: "date", required: true },
        { name: "dueTime", label: "Due Time", type: "time", required: true },
        { name: "maxMarks", label: "Max Marks", type: "number" },
        { name: "submissionLink", label: "Submission Link", type: "url" },
        { name: "description", label: "Description", type: "textarea", required: true },
      ]}
    />
  ),
});
