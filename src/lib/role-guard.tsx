import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth, type Role } from "@/lib/use-auth";

export function useRoleGuard(allowed: "student" | "lecturer") {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/" });
      return;
    }
    if (role && role !== allowed) {
      toast.error("Unauthorized");
      navigate({ to: role === "lecturer" ? "/lecturer/dashboard" : "/student/dashboard" });
    }
  }, [user, role, loading, allowed, navigate]);

  return { user, role: role as Role, loading, allowed };
}
