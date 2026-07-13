import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Bloom" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const updatePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully!");

    setTimeout(() => {
      navigate({ to: "/auth" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">

      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[150px]" />

      <div className="relative w-full max-w-md rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/30 shadow-soft p-10">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-gradient-ocean shadow-glow grid place-items-center">

            <CheckCircle className="w-10 h-10 text-white"/>

          </div>

        </div>

        <h1 className="text-3xl font-display text-center mt-6">
          Reset Password
        </h1>

        <p className="text-center text-muted-foreground mt-2 mb-8">
          Enter your new password below.
        </p>

        <form
          onSubmit={updatePassword}
          className="space-y-5"
        >

          {/* New Password */}

          <div>

            <label className="text-sm font-medium">
              New Password
            </label>

            <div className="relative mt-2">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary/40 outline-none"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword
                  ? <EyeOff className="w-5 h-5"/>
                  : <Eye className="w-5 h-5"/>}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="text-sm font-medium">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary/40 outline-none"
              />

              <button
                type="button"
                onClick={()=>setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirm
                  ? <EyeOff className="w-5 h-5"/>
                  : <Eye className="w-5 h-5"/>}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-ocean text-white font-semibold shadow-soft hover:shadow-glow transition flex items-center justify-center gap-2 disabled:opacity-60"
          >

            {loading && (
              <Loader2 className="w-5 h-5 animate-spin"/>
            )}

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>

      </div>

    </div>
  );
}