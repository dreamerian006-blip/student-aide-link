import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/exam-schedule")({
  component: () => (
    <LecturerSubmitPage
      title="Exam Schedule"
      subtitle="Publish an upcoming exam"
      successMessage="Exam schedule submitted successfully"
      fields={[
        { name: "subject", label: "Subject", required: true },
        { name: "subjectId", label: "Subject ID", required: true },
        { name: "examType", label: "Exam Type", type: "select", required: true, options: ["Mid Semester", "End Semester", "Quiz", "Practical"] },
        { name: "date", label: "Exam Date", type: "date", required: true },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "venue", label: "Hall / Venue", required: true },
      ]}
    />
  ),
});
