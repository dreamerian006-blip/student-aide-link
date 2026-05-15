import { createFileRoute } from "@tanstack/react-router";
import { LecturerFormPage } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/online-classes")({
  component: () => (
    <LecturerFormPage
      title="Online Classes"
      fields={[
        { name: "subjectName", label: "Subject Name", type: "text", required: true },
        { name: "subjectId", label: "Subject ID", type: "text", required: true },
        { name: "lecturer", label: "Lecturer", type: "text", required: true },
        { name: "classDate", label: "Class Date", type: "date", required: true },
        { name: "platform", label: "Platform", type: "select", required: true, options: ["Zoom", "Microsoft Teams", "Google Meet", "Other"] },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "meetingLink", label: "Meeting Link", type: "url", required: true, placeholder: "https://…" },
        { name: "meetingId", label: "Meeting ID", type: "text" },
        { name: "passcode", label: "Passcode", type: "text" },
      ]}
    />
  ),
});
