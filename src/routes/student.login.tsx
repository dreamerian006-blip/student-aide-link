import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/student/login")({
  component: StudentLogin,
});

function StudentLogin() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId.trim()) return;
    setLoading(true);
    try {
      localStorage.setItem("ce_student_name", "Queen");
      localStorage.setItem("ce_student_id", studentId.trim());
    } catch {}
    setTimeout(() => navigate({ to: "/student/connect" }), 350);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--grad-hero)" }}
      />

      <div className="relative z-10 mx-auto max-w-md px-6 py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="rounded-3xl p-[1.5px]" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
          <div className="glass-strong rounded-[calc(1.5rem-1.5px)] p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl btn-hero">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Login</h1>
                <p className="text-xs text-muted-foreground">Enter your Student ID to continue</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Student ID</span>
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  placeholder="e.g. CS2024001"
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-hero flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
