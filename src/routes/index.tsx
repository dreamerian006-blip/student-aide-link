import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Users, Sparkles, MessageCircle, Calendar, FileText } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusEase.lk — AI Powered Campus Assistant" },
      { name: "description", content: "Your AI-powered campus companion for lecturers and students. Manage timetables, materials, assignments and more." },
      { property: "og:title", content: "CampusEase.lk — AI Powered Campus Assistant" },
      { property: "og:description", content: "AI-powered campus companion for lecturers and students." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: "var(--grad-hero)" }} />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "var(--grad-hero)" }} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl btn-hero">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusEase<span className="text-primary">.lk</span></span>
        </div>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Powered Campus Assistant
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="gradient-text">CampusEase</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            One smart hub for everything campus — timetables, exams, materials, lecturer chats and an AI assistant in your pocket.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/auth"
              search={{ role: "lecturer" }}
              className="btn-hero inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold sm:w-auto"
            >
              <Users className="h-5 w-5" /> For Lecturers
            </Link>
            <Link
              to="/auth"
              search={{ role: "student" }}
              className="glass-strong inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-foreground hover:bg-white sm:w-auto"
            >
              <GraduationCap className="h-5 w-5 text-primary" /> For Students
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <section id="features" className="mt-24 grid gap-6 sm:grid-cols-3">
          {[
            { icon: MessageCircle, title: "AI Assistant", desc: "Chat with your campus AI bot via WhatsApp." },
            { icon: Calendar, title: "Smart Schedules", desc: "Timetables, exams and online classes in one place." },
            { icon: FileText, title: "Study Materials", desc: "Lecturer uploads, assignments and forms instantly." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl btn-hero">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
