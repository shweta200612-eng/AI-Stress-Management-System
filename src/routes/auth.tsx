import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Flower2,
  Loader2,
  Heart,
  Sparkles,
  Wind,
  Mail,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login — Bloom" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      nav({ to: "/" });
    }
  });
}, [nav]);

 

  // ----------------------------
  // Google Sign In
  // ----------------------------
  const signInWithGoogle = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // ----------------------------
  // Forgot Password
  // ----------------------------
  const forgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent.");
    }
  };

  // ----------------------------
  // Login / Signup
  // ----------------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
           if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (loginError) throw loginError;

        toast.success("Welcome to Bloom 🌸");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome Back 💙");
      }

      nav({ to: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-hero">

      {/* LEFT PANEL */}

      <div
  className="relative hidden md:flex flex-col justify-between p-10 text-white overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, #D9F3FF 0%, #6FC3DF 35%, #4A90E2 70%, #357ABD 100%)",
  }}
>

        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

        <Link
          to="/"
          className="relative flex items-center gap-2 font-display text-xl"
        >
          <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur grid place-items-center">
            <Flower2 className="w-5 h-5" />
          </span>

          Bloom
        </Link>

        {/* Breathing Animation */}

        <div className="relative flex justify-center my-8">
          <div className="relative w-56 h-56 grid place-items-center">

            <div className="absolute inset-0 rounded-full bg-white/15 breathe-anim" />

            <div
              className="absolute inset-4 rounded-full bg-white/25 breathe-anim"
              style={{ animationDelay: "0.5s" }}
            />

            <div
              className="absolute inset-10 rounded-full bg-white/40 breathe-anim"
              style={{ animationDelay: "1s" }}
            />

            <Heart className="w-10 h-10 relative z-10" />
          </div>
        </div>

        <div>

          <h2 className="font-display text-4xl leading-tight">
            A softer place
            <br />
            for harder days.
          </h2>

          <p className="mt-4 text-white/90 max-w-sm">
            Your moods, your music, your AI buddy — all in one calm corner
            of the internet.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs">

            <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Buddy
            </span>

            <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              Breathing
            </span>

            <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              Mood Tracking
            </span>

          </div>

        </div>
      </div>

      {/* RIGHT PANEL STARTS HERE */}
                 <div className="flex items-center justify-center p-6 md:p-8 relative">

        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl -z-10" />

        <div className="w-full max-w-sm bg-white/80 backdrop-blur rounded-3xl border border-border p-8 shadow-soft">

          <Link
            to="/"
            className="md:hidden flex items-center gap-2 font-display text-xl mb-6"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-ocean grid place-items-center shadow-soft">
              <Flower2 className="w-5 h-5 text-white" />
            </span>

            Bloom
          </Link>

          {/* Login / Signup Tabs */}

          <div className="inline-flex bg-accent rounded-full p-1 mb-6">

            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  mode === m
                    ? "bg-gradient-ocean text-white shadow-soft"
                    : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}

          </div>

          <h1 className="font-display text-3xl">

            {mode === "login"
              ? "Welcome Back!"
              : "Create your account"}

          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            {mode === "login"
              ? "Login to continue your wellness journey."
              : "Start your gentle journey with Bloom."}
          </p>

          

          {/* Google Login */}

          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full mt-6 py-3 rounded-xl border border-input bg-white hover:bg-slate-50 transition flex items-center justify-center gap-3 font-medium"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2.1 1.6-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.6-6.1 7.2l6.2 5.2C39.4 36.9 44 31.1 44 24c0-1.3-.1-2.3-.4-3.5z"/>
            </svg>

            Continue with Google

          </button>

          {/* Divider */}

          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-muted-foreground">
                OR
              </span>
            </div>

          </div>

          {/* Login Form */}

          <form onSubmit={onSubmit} className="space-y-4">

            <div>

              <label className="text-sm font-medium">
                Email
              </label>

              <div className="mt-1.5 relative">

                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-input focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

              </div>

            </div>

            <div>

              <label className="text-sm font-medium">
                Password
              </label>

              <div className="mt-1.5 relative">

                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-input focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

              </div>

              <div className="flex justify-end mt-2">

                <button
                  type="button"
                  onClick={forgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-ocean text-white font-medium shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            >

              {loading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              {mode === "login"
                ? "Login"
                : "Create Account"}

            </button>

          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">

            {mode === "login"
              ? "New to Bloom?"
              : "Already have an account?"}

            {" "}

            <button
              onClick={() =>
                setMode(mode === "login" ? "signup" : "login")
              }
              className="text-primary font-medium hover:underline"
            >
              {mode === "login"
                ? "Create an account"
                : "Login"}
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}