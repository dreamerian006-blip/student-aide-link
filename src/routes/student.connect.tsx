import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, LogOut, Sparkles, Send, X, ArrowRight } from "lucide-react";
import qrImage from "@/assets/campusease-qr.png";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/student/connect")({
  component: StudentConnect,
});

const WA_LINK = "https://wa.me/14155238886?text=join%20condition-hand";

type Msg = { from: "me" | "bot"; text: string };

function StudentConnect() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm your campus AI 👋 Ask me anything about classes, exams or assignments." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayName: string =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    (user?.email ? user.email.split("@")[0] : "");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatOpen]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("ce_student_name");
      localStorage.removeItem("ce_student_id");
    } catch {}
    navigate({ to: "/" });
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "me", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Got it! Connect on WhatsApp for full AI replies — just scan the QR above." },
      ]);
    }, 700);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--grad-hero)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--grad-hero)" }}
      />

      <header className="relative z-10 mx-auto flex max-w-2xl items-center justify-between px-5 py-5">
        <Link to="/" className="text-base font-semibold tracking-tight">
          CampusEase<span className="text-primary">.lk</span>
        </Link>
        <div className="flex items-center gap-3">
          {displayName && (
            <span className="hidden sm:inline text-sm font-medium text-foreground">
              {displayName}
            </span>
          )}
          <button
            onClick={() => { void handleLogout(); }}
            className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/80"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-5 pb-24">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> AI Connect
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {displayName ? `Hi ${displayName}, ` : "Welcome, "}
            Connect with <span className="gradient-text">CampusEase AI</span>
          </h1>
        </div>

        {/* Gradient-bordered glass card */}
        <div
          className="rounded-3xl p-[1.5px]"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <div className="rounded-[calc(1.5rem-1.5px)] bg-white/60 p-6 backdrop-blur-xl sm:p-8">
            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-white p-3 shadow-md">
                <img
                  src={qrImage}
                  alt="Scan to chat with CampusEase AI on WhatsApp"
                  width={220}
                  height={220}
                  style={{ width: 220, height: "auto", borderRadius: 16 }}
                  className="block"
                />
              </div>

              {/* Steps */}
              <div className="mt-6 w-full">
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center">
                  <Step n={1} label="Scan QR" />
                  <Arrow />
                  <Step n={2} label="Send message" />
                  <Arrow />
                  <Step n={3} label="Ask anything" />
                </div>
              </div>

              {/* Chat on Web button */}
              <button
                onClick={() => setChatOpen(true)}
                className="btn-hero mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold sm:w-auto sm:px-8"
              >
                <MessageCircle className="h-4 w-4" /> Chat on Web
              </button>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Or open WhatsApp directly
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Chat sheet */}
      {chatOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center">
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", padding: 1.5 }}
          >
            <div className="rounded-t-[calc(1.5rem-1.5px)] bg-white/95 backdrop-blur-xl sm:rounded-[calc(1.5rem-1.5px)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold leading-none">CampusEase AI</div>
                    <div className="text-[11px] text-muted-foreground">Online</div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="rounded-full p-1.5 hover:bg-secondary" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={scrollRef} className="h-80 space-y-2 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                        m.from === "me"
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm border border-border bg-white text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                <button type="submit" className="btn-hero flex h-10 w-10 items-center justify-center rounded-full" aria-label="Send">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-medium shadow-sm sm:flex-col sm:gap-1 sm:bg-transparent sm:px-2 sm:shadow-none">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
      >
        {n}
      </span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function Arrow() {
  return <span className="hidden text-muted-foreground sm:inline">→</span>;
}
