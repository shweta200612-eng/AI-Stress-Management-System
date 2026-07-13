import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSessionEmail } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Moon, Sun } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
   { to: "/exercise", label: "Exercise" },
  { to: "/chat", label: "AI Buddy" },
  { to: "/emotion", label: "Emotion" },
] as const;

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    getSessionEmail().then(setEmail);
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      getSessionEmail().then(setEmail);
    });
    const stored = localStorage.getItem("bloom-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    return () => sub.subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bloom-theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl shrink-0">
          <span className="w-9 h-9 rounded-full bg-gradient-rose grid place-items-center shadow-soft">
            <Flower2 className="w-5 h-5 text-white" />
          </span>
          <span className="font-semibold">Bloom</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={"exact" in l && l.exact ? { exact: true } : undefined}
              className="text-foreground/80 hover:text-primary transition"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full grid place-items-center bg-accent/60 hover:bg-accent transition"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {email ? (
            <Link to="/profile" className="text-xs w-9 h-9 grid place-items-center rounded-full bg-gradient-rose text-white font-semibold shadow-soft" title={email}>
              {email[0]?.toUpperCase()}
            </Link>
          ) : (
            <Link to="/auth" className="text-sm px-4 py-2 rounded-full bg-gradient-rose text-white font-medium shadow-soft hover:shadow-glow transition">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
