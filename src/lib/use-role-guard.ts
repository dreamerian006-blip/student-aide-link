import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth, type Role } from "@/lib/use-auth";

export function useRoleGuard(required: Exclude<Role, null>) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/" });
      return;
    }
    if (role && role !== required) {
      toast.error("Unauthorized");
      navigate({ to: role === "lecturer" ? "/lecturer/dashboard" : "/student/dashboard" });
    }
  }, [user, role, loading, required, navigate]);

  return { allowed: !loading && !!user && role === required, loading };
}
