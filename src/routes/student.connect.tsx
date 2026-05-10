import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { MessageCircle, QrCode, LogOut, LayoutDashboard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student/connect")({
  component: StudentConnect,
});

function StudentConnect() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { role: "student" } });
  }, [loading, user, navigate]);

  const waNumber = "94770000000";
  const waMessage = encodeURIComponent("Hi CampusEase AI, I need help");
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(waLink)}&bgcolor=ffffff&color=4F32C7&margin=10`;

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
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Connect
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Chat with your <span className="gradient-text">Campus AI</span></h1>
          <p className="mt-3 text-muted-foreground">Open WhatsApp instantly or scan the QR with your phone.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp button card */}
          <div className="glass-strong relative rounded-3xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">CampusEase AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Online · responds in seconds</p>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <Bubble from="bot">Hi! I'm your campus AI 👋 Ask me anything about classes, exams or assignments.</Bubble>
              <Bubble from="me">When is my next lecture?</Bubble>
              <Bubble from="bot">Tomorrow at 9:00 AM — CS401 Software Engineering, Hall B.</Bubble>
            </div>

            <a href={waLink} target="_blank" rel="noreferrer" className="btn-hero flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold">
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>

          {/* QR card */}
          <div className="glass-strong rounded-3xl p-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              <QrCode className="h-3.5 w-3.5" /> Scan with your phone
            </div>
            <h2 className="text-lg font-semibold">QR to AI Bot</h2>
            <p className="mt-1 text-sm text-muted-foreground">Point your camera here to open WhatsApp</p>

            <div className="mx-auto mt-6 inline-block rounded-3xl bg-white p-4 shadow-md">
              <img src={qrSrc} alt="QR code to open WhatsApp AI assistant" className="h-60 w-60" />
            </div>

            <p className="mt-6 text-xs text-muted-foreground">Powered by WhatsApp · CampusEase AI</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Bubble({ from, children }: { from: "me" | "bot"; children: React.ReactNode }) {
  const me = from === "me";
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-white/80 text-foreground rounded-bl-sm border border-border"}`}>
        {children}
      </div>
    </div>
  );
}
