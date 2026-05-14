import { createFileRoute } from "@tanstack/react-router";
import { LecturerSubmitPage } from "@/lib/lecturer-submit-page";

export const Route = createFileRoute("/lecturer/online-classes")({
  component: () => (
    <LecturerSubmitPage
      title="Online Classes"
      subtitle="Schedule a Zoom, Teams, or Meet session"
      successMessage="Online class submitted successfully"
      fields={[
        { name: "subject", label: "Subject", required: true },
        { name: "subjectId", label: "Subject ID", required: true },
        { name: "date", label: "Class Date", type: "date", required: true },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "platform", label: "Platform", type: "select", required: true, options: ["Zoom", "Microsoft Teams", "Google Meet", "Other"] },
        { name: "meetingLink", label: "Meeting Link", type: "url", required: true },
        { name: "meetingId", label: "Meeting ID" },
        { name: "passcode", label: "Passcode" },
      ]}
    />
  ),
});
