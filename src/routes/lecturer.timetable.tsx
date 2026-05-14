import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/timetable")({
  component: () => (
    <LecturerSubmitPage
      title="Semester Timetable"
      subtitle="Add a class slot for the semester schedule"
      successMessage="Timetable entry submitted successfully"
      fields={[
        { name: "course", label: "Course / Subject", required: true, placeholder: "e.g. CS2024 — Algorithms" },
        { name: "subjectId", label: "Subject ID", required: true, placeholder: "e.g. CS2024" },
        { name: "day", label: "Day", type: "select", required: true, options: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "hall", label: "Hall / Room", required: true, placeholder: "e.g. LT-3" },
        { name: "lecturer", label: "Lecturer", required: true },
      ]}
    />
  ),
});
