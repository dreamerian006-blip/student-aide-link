import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { Upload, FileText, LogOut, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lecturer/upload")({
  component: LecturerUpload,
});

function LecturerUpload() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ name: string; size: number; type: string }[]>([]);
  const [category, setCategory] = useState("Study Material");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "lecturer" } });
  }, [loading, user, navigate]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size, type: f.type }));
    setFiles((prev) => [...list, ...prev]);
    toast.success(`${list.length} file(s) staged`);
  }
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: f.size, type: f.type }));
    setFiles((prev) => [...list, ...prev]);
    if (list.length) toast.success(`${list.length} file(s) staged`);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "var(--grad-hero)" }} />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></Link>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/80">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <button onClick={() => signOut().then(() => navigate({ to: "/" }))} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/80">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Lecturer <span className="gradient-text">Upload Hub</span></h1>
          <p className="mt-2 text-muted-foreground">Share materials, assignments, schedules and notices with your students.</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {["Study Material", "Assignment", "Timetable", "Exam Schedule", "Notice"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${category === c ? "btn-hero" : "glass hover:bg-white/80"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="glass-strong rounded-3xl border-2 border-dashed border-primary/30 p-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl btn-hero">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold">Drop files here</h3>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse — PDF, DOCX, PPTX, images</p>
          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Upload className="h-4 w-4" /> Choose files
            <input type="file" multiple className="hidden" onChange={onPick} />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Recent uploads · {category}</h2>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="glass flex items-center justify-between rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB · {category}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
