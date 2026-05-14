import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/study-materials")({
  component: () => (
    <LecturerSubmitPage
      title="Study Materials"
      subtitle="Upload notes, slides, or past papers"
      successMessage="Study material submitted successfully"
      fields={[
        { name: "course", label: "Course / Subject", required: true },
        { name: "title", label: "Title", required: true },
        { name: "subTitle", label: "Sub-title with Year", placeholder: "e.g. Lecture 3 — 2025" },
        { name: "type", label: "Material Type", type: "select", required: true, options: ["Notes", "Slides", "Past Paper", "Video", "Assignment"] },
        { name: "link", label: "Drive / External Link", type: "url" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  ),
});
