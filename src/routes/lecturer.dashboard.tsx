import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import {
  Calendar, BookOpen, FileText, Users, Video, ClipboardList, FileSignature,
  LogOut, Upload, GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/lecturer/dashboard")({
  component: LecturerDashboard,
});

type Tile = { icon: any; title: string; desc: string; tone: number; to?: string };

const TILES: Tile[] = [
  { icon: Calendar, title: "Semester Timetable", desc: "Weekly classes & rooms", tone: 1, to: "/timetable-submit" },
  { icon: ClipboardList, title: "Exam Schedule", desc: "Upcoming exams & venues", tone: 2, to: "/exam-submit" },
  { icon: FileText, title: "Assignments", desc: "Tasks & due dates", tone: 3, to: "/assignment-submit" },
  { icon: BookOpen, title: "Study Materials", desc: "Slides, notes & PDFs", tone: 1, to: "/study-materials-submit" },
  { icon: Users, title: "Lecturer Contacts", desc: "Reach out to your faculty", tone: 2, to: "/lecturer-contacts-submit" },
  { icon: Video, title: "Online Classes", desc: "Zoom & Teams links", tone: 3, to: "/online-class-submit" },
  { icon: FileSignature, title: "University Forms", desc: "Access and submit university documents", tone: 1, to: "/university-forms-submit" },
];

const TONE_BG: Record<number, string> = {
  1: "linear-gradient(135deg, oklch(0.6 0.22 270), oklch(0.65 0.2 285))",
  2: "linear-gradient(135deg, oklch(0.6 0.22 255), oklch(0.7 0.18 230))",
  3: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.6 0.22 250))",
};

function LecturerDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split("@")[0] : null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "var(--grad-hero)" }} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-hero">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></span>
        </Link>
        <div className="flex items-center gap-2">
          {displayName && <span className="hidden sm:inline text-sm font-medium text-foreground/80">{displayName}</span>}
          <button onClick={() => signOut().then(() => navigate({ to: "/" }))} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/80">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Lecturer Dashboard</p>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1a1a1a" }}>
            {displayName ? `Welcome, ${displayName}` : "Welcome to CampusEase"}
          </h1>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            Access your academic resources below
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {TILES.map((t) => (
            <button
              key={t.title}
              onClick={() => t.to && navigate({ to: t.to })}
              className="glass-strong group relative overflow-hidden rounded-2xl p-5 text-left transition hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md" style={{ background: TONE_BG[t.tone] }}>
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{t.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
