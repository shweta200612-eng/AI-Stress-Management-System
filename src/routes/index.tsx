import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { MOODS, addMood, type Mood } from "@/lib/wellness-store";
import { JOKES, MOTIVATIONAL_QUOTES } from "@/lib/funbits";
import { hasActiveSession } from "@/lib/session";
import {
  Gamepad2, Quote, Music2, Sparkles, Bot, BookHeart, BellRing, Wind,
  Smile, Heart, ArrowRight, Headphones, Drama, Laugh, Shuffle, Dumbbell, Flower2, Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom — AI Stress Relief & Mental Wellness" },
      { name: "description", content: "Bloom is your AI-powered companion for stress relief, mood tracking, mindful games, music, dance and gentle daily wellness." },
      { property: "og:title", content: "Bloom — AI Stress Relief & Mental Wellness" },
      { property: "og:description", content: "AI companion, mood-based Bollywood playlists, funny games, dance tutorials, breathing, and emotion check-ins." },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Gamepad2, title: "Funny Games", desc: "Six quick mini games with difficulty & progress.", to: "/games" as const, tint: "from-sky-50 to-blue-100" },
  { icon: Quote, title: "Motivational Quotes", desc: "Hand-picked words to soften your day.", to: "/" as const, tint: "from-sky-50 to-cyan-100" },
  { icon: Music2, title: "Bollywood Playlists", desc: "20 mood-matched Bollywood songs per feeling.", to: "/playlist" as const, tint: "from-sky-50 to-blue-100" },
  { icon: Drama, title: "Funny Jokes", desc: "50 tiny giggles on tap — laughter heals.", to: "/" as const, tint: "from-sky-50 to-blue-100" },
  { icon: Dumbbell, title: "Exercise Sessions", desc: "Workouts tuned to your current stress level.", to: "/exercise" as const, tint: "from-blue-50 to-sky-100" },
  { icon: Flower2, title: "Meditation", desc: "Guided sessions — gratitude, 4-7-8, body scan.", to: "/exercise" as const, tint: "from-sky-50 to-cyan-50" },
  { icon: Sparkles, title: "Dancing Tutorials", desc: "10 styles — hip hop, classical, K-Pop & more.", to: "/dance" as const, tint: "from-sky-100 to-blue-200" },
  { icon: Bot, title: "AI Chat Buddy", desc: "A kind, private companion that listens anytime.", to: "/chat" as const, tint: "from-sky-50 to-blue-100" },
  { icon: Smile, title: "Emotion Check-in", desc: "Face & voice based vibe check with advice.", to: "/emotion" as const, tint: "from-sky-50 to-blue-100" },
];

function Home() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<Mood | null>(null);
  const [jokeIdx, setJokeIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const dailyQuote = useMemo(() => MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length], []);
  useEffect(() => {
    setJokeIdx(Math.floor(Math.random() * JOKES.length));
    setQuoteIdx(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
    hasActiveSession().then((active) => {
      if (!active) navigate({ to: "/auth" });
    });
  }, [navigate]);
  const nextJoke = () => setJokeIdx((i) => (i + 1 + Math.floor(Math.random() * (JOKES.length - 1))) % JOKES.length);
  const nextQuote = () => setQuoteIdx((i) => (i + 1 + Math.floor(Math.random() * (MOTIVATIONAL_QUOTES.length - 1))) % MOTIVATIONAL_QUOTES.length);

  const pickMood = (m: Mood) => { setMood(m); addMood(m); };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero -z-10" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent blur-3xl opacity-50 -z-10" />
        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full bg-primary blur-3xl opacity-30 -z-10" />

        <div className="mx-auto max-w-6xl px-5 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-medium">
              <Heart className="w-3.5 h-3.5" /> AI Wellness Companion
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-display font-semibold leading-[1.05]">
              Breathe softly.<br />
              <span className="text-primary">Bloom slowly.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Bloom is your pocket-sized sanctuary — playful games, mood-matched music,
              an AI buddy, breathing rituals, and gentle check-ins for the stress you carry.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-rose text-white font-medium shadow-soft hover:shadow-glow transition">
                Get started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link to="/games" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur border border-border hover:bg-white transition">
                <Gamepad2 className="w-4 h-4" /> Try a game
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-primary" /> 1-min breathing</div>
              <div className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" /> Mood playlists</div>
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI chat</div>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-rose opacity-20 blur-2xl" />
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-accent/30 breathe-anim" />
              <div className="absolute inset-4 rounded-full bg-accent/50 breathe-anim" style={{ animationDelay: "0.5s" }} />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-accent to-primary/70 breathe-anim" style={{ animationDelay: "1s" }} />
              <div className="absolute inset-14 rounded-full bg-gradient-rose breathe-anim shadow-glow" style={{ animationDelay: "1.5s" }} />
              <div className="relative z-10 text-center text-white">
                <div className="text-xs uppercase tracking-widest opacity-80 mb-1">Inhale… Exhale…</div>
                <div className="text-2xl font-display font-semibold">Breathe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* JOKE + QUOTE CARDS */}
      <section className="mx-auto max-w-6xl px-5 mb-16 grid md:grid-cols-2 gap-6">
        {/* Joke card */}
        <div className="rounded-3xl bg-gradient-to-br from-accent/40 to-primary/20 p-8 border border-border shadow-soft flex flex-col">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-medium">
            <Laugh className="w-3.5 h-3.5" /> Daily giggle · 50 jokes
          </div>
          <p key={jokeIdx} className="mt-4 font-display text-xl md:text-2xl leading-snug text-foreground flex-1 float-anim">
            "{JOKES[jokeIdx]}"
          </p>
          <button onClick={nextJoke} className="mt-6 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-rose text-white text-sm shadow-soft hover:shadow-glow transition">
            <Shuffle className="w-4 h-4" /> Another joke
          </button>
        </div>

        {/* Motivational quote card */}
        <div className="rounded-3xl bg-white p-8 border border-border shadow-soft flex flex-col">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-medium">
            <Quote className="w-3.5 h-3.5" /> Motivational quote
          </div>
          <p key={quoteIdx} className="mt-4 font-display text-xl md:text-2xl leading-snug text-foreground flex-1">
            "{MOTIVATIONAL_QUOTES[quoteIdx].text}"
          </p>
          <div className="mt-3 text-sm text-muted-foreground">— {MOTIVATIONAL_QUOTES[quoteIdx].author ?? "Unknown"}</div>
          <button onClick={nextQuote} className="mt-6 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-border text-sm hover:bg-accent/40">
            <Shuffle className="w-4 h-4" /> Another quote
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display">Little rituals for big feelings</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Gentle tools, designed to meet you where you are today.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className="group relative rounded-3xl bg-white p-6 border border-border hover:-translate-y-1 hover:shadow-glow transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.tint} grid place-items-center mb-4`}>
                <f.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              <ArrowRight className="w-4 h-4 mt-4 text-primary opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* DAILY QUOTE BAND */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-rose px-8 py-14 text-center text-white shadow-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <Quote className="w-10 h-10 mx-auto opacity-80 float-anim" />
          <p className="mt-6 font-display text-2xl md:text-3xl leading-snug max-w-3xl mx-auto">"{dailyQuote.text}"</p>
          <p className="mt-4 text-sm opacity-80">— {dailyQuote.author ?? "Unknown"}</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display">How Bloom works</h2>
          <p className="text-muted-foreground mt-3">Three soft steps. No pressure, no streaks to break.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", icon: Smile, title: "Tell us your mood", desc: "Tap a feeling — or let our face & voice check-in read your vibe." },
            { n: "02", icon: Activity, title: "Get a tiny ritual", desc: "A song, an exercise, a dance, a breath — picked for this moment." },
            { n: "03", icon: BookHeart, title: "See your bloom", desc: "Track gentle progress, reminders for study & sleep, and self-care wins." },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl bg-white p-8 border border-border shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono tracking-widest text-primary">{s.n}</span>
                <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <BellRing className="w-8 h-8 mx-auto text-primary" />
          <h2 className="mt-4 text-3xl md:text-4xl font-display">Ready to begin?</h2>
          <p className="text-muted-foreground mt-3">Create a free account to save your moods, progress, and reminders.</p>
          <Link to="/auth" className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-rose text-white font-medium shadow-soft hover:shadow-glow transition">
            Get started — it's free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        <p>Bloom · Made with care. Not a substitute for professional help.</p>
      </footer>
    </div>
  );
}
