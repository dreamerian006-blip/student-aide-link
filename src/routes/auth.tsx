import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Users, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  role: z.enum(["lecturer", "student"]).default("student"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const isLecturer = role === "lecturer";
  const Icon = isLecturer ? Users : GraduationCap;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, role },
          },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: isLecturer ? "/lecturer/upload" : "/student/connect" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--grad-hero)" }} />

      <div className="relative z-10 mx-auto max-w-md px-6 py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl btn-hero">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{isLecturer ? "Lecturer" : "Student"} Portal</h1>
              <p className="text-xs text-muted-foreground">{mode === "login" ? "Welcome back" : "Create your account"}</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
            <button onClick={() => setMode("login")} className={`rounded-lg py-2 text-sm font-medium transition ${mode === "login" ? "bg-white shadow text-foreground" : "text-muted-foreground"}`}>Login</button>
            <button onClick={() => setMode("signup")} className={`rounded-lg py-2 text-sm font-medium transition ${mode === "signup" ? "bg-white shadow text-foreground" : "text-muted-foreground"}`}>Sign up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Full name">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input-field" placeholder="Jane Doe" />
              </Field>
            )}
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@university.lk" />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field" placeholder="••••••••" />
            </Field>

            <button type="submit" disabled={loading} className="btn-hero flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Switching role?{" "}
            <Link to="/auth" search={{ role: isLecturer ? "student" : "lecturer" }} className="font-medium text-primary hover:underline">
              Continue as {isLecturer ? "student" : "lecturer"}
            </Link>
          </p>
        </div>
      </div>

      <style>{`.input-field { width:100%; border-radius:0.75rem; border:1px solid var(--color-border); background:oklch(1 0 0 / 0.7); padding:0.75rem 1rem; font-size:0.875rem; outline:none; transition:border-color .15s, box-shadow .15s; } .input-field:focus { border-color: var(--color-ring); box-shadow: 0 0 0 3px oklch(0.6 0.2 270 / 0.15); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
