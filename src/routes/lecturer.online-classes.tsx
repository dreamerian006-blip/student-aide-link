import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormShell, LecturerForm, useLecturerGuard, type Field } from "@/lib/lecturer-form";

export const Route = createFileRoute("/lecturer/online-classes")({ component: Page });

const FIELDS: Field[] = [
  { name: "subject_name", label: "Subject Name", type: "text", required: true },
  { name: "subject_id", label: "Subject ID", type: "text", required: true },
  { name: "lecturer", label: "Lecturer", type: "text", required: true },
  { name: "class_date", label: "Class Date", type: "date", required: true },
  { name: "platform", label: "Platform", type: "text", required: true, placeholder: "Zoom / Teams / Meet" },
  { name: "start_time", label: "Start Time", type: "time", required: true },
  { name: "end_time", label: "End Time", type: "time", required: true },
  { name: "meeting_link", label: "Meeting Link", type: "url", required: true },
  { name: "meeting_id", label: "Meeting ID", type: "text" },
  { name: "passcode", label: "Passcode", type: "text" },
];

function Page() {
  const { ready } = useLecturerGuard();
  if (!ready) return null;
  return (
    <FormShell title="Schedule Online Class" subtitle="Post Zoom / Teams / Meet links for students">
      <LecturerForm fields={FIELDS} onSubmit={(data) => { console.log("online-class", data); toast.success("Online class scheduled"); }} />
    </FormShell>
  );
}
