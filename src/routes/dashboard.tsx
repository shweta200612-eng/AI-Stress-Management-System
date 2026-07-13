import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionEmail, hasActiveSession, signOutAll } from "@/lib/session";
import {
  MOODS, getMoodLog, getProgress, getProfile,
  type Mood, type MoodEntry, type GameProgress, type Profile,
} from "@/lib/wellness-store";
import { JOKES } from "@/lib/funbits";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import {
  Activity, TrendingDown, Smile, Moon, Droplet, Dumbbell, Flower2, Apple, Sparkles,
  Trophy, Award, Flame, Heart, Wind, BookOpen, ChevronRight, LogOut, UserCircle2,
  Loader2, AlertCircle, CheckCircle2, Shuffle, Quote,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bloom Wellness" }] }),
  component: Dashboard,
});

/* ------------- helpers ------------- */
type Range = "7d" | "30d" | "3m";

function makeStressTrend(range: Range, moods: MoodEntry[]) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const out: { label: string; score: number }[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400_000);
    const start = d.setHours(0, 0, 0, 0);
    const end = start + 86400_000;
    const dayMoods = moods.filter((m) => m.at >= start && m.at < end);
    let score: number;
    if (dayMoods.length) {
      score = Math.round(
        dayMoods.reduce((acc, m) => acc + moodToScore(m.mood), 0) / dayMoods.length
      );
    } else {
      // smooth pseudo-sample trending down
      score = Math.round(55 + Math.sin(i / 3) * 12 - (days - i) * 0.2);
    }
    out.push({
      label: d.toLocaleDateString(undefined, days > 30 ? { month: "short" } : { month: "short", day: "numeric" }),
      score: Math.max(8, Math.min(95, score)),
    });
  }
  return out;
}

function moodToScore(m: Mood): number {
  switch (m) {
    case "happy": return 22;
    case "calm": return 30;
    case "tired": return 55;
    case "sad": return 65;
    case "anxious": return 78;
    case "stressed": return 88;
    default: return 50;
  }
}

function stressBand(score: number) {
  if (score < 35) return { label: "Low", color: "#86efac", ring: "from-emerald-300 to-green-400", text: "text-emerald-600" };
  if (score < 60) return { label: "Moderate", color: "#fbbf24", ring: "from-amber-300 to-orange-400", text: "text-amber-600" };
  if (score < 80) return { label: "High", color: "#fb923c", ring: "from-orange-400 to-rose-500", text: "text-orange-600" };
  return { label: "Severe", color: "#ef4444", ring: "from-rose-500 to-red-600", text: "text-red-600" };
}

const CONTRIBUTORS = [
  { name: "Exam Pressure", value: 40, color: "#ec4899" },
  { name: "Poor Sleep", value: 25, color: "#a78bfa" },
  { name: "Screen Time", value: 15, color: "#f9a8d4" },
  { name: "Homework Load", value: 10, color: "#c4b5fd" },
  { name: "Family Issues", value: 10, color: "#fb7185" },
];

const HABITS = [
  { name: "Water Intake", value: 80, icon: Droplet, color: "#60a5fa" },
  { name: "Exercise", value: 70, icon: Dumbbell, color: "#f472b6" },
  { name: "Meditation", value: 60, icon: Flower2, color: "#a78bfa" },
  { name: "Sleep Goal", value: 90, icon: Moon, color: "#818cf8" },
  { name: "Healthy Eating", value: 75, icon: Apple, color: "#34d399" },
];

const INSIGHTS = [
  { icon: CheckCircle2, text: "You're less stressed on days when sleep exceeds 7 hours.", color: "text-emerald-500" },
  { icon: Activity, text: "Regular exercise reduces your stress by up to 15%.", color: "text-teal-600" },
  { icon: AlertCircle, text: "High screen time is increasing your stress levels.", color: "text-amber-500" },
  { icon: Droplet, text: "Drinking more water improves your mood consistency.", color: "text-teal-600" },
];

const RECOMMENDATIONS = [
  { icon: Activity, text: "Take a 10-minute walk today", to: "/exercise" },
  { icon: Moon, text: "Reduce screen time by 1 hour", to: "/" },
  { icon: Wind, text: "Practice 5-minute breathing", to: "/exercise" },
  { icon: BookOpen, text: "Go to bed 30 minutes earlier", to: "/" },
  { icon: Droplet, text: "Drink 2 more glasses of water", to: "/" },
];

const ACHIEVEMENTS = [
  { emoji: "🏆", title: "7-Day Streak", color: "from-amber-200 to-orange-300" },
  { emoji: "🧘", title: "First Meditation", color: "from-violet-200 to-purple-300" },
  { emoji: "🌙", title: "Sleep Goal Achiever", color: "from-teal-100 to-cyan-200" },
  { emoji: "📉", title: "Stress Reduced by 20%", color: "from-teal-100 to-cyan-100" },
  { emoji: "💖", title: "Healthy Habit Champion", color: "from-teal-100 to-cyan-200" },
];

const SLEEP_DATA = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(Date.now() - (6 - i) * 86400_000);
  const sleep = 6 + Math.sin(i) * 1.2 + 0.4;
  const stress = 70 - sleep * 5 + Math.cos(i) * 6;
  return {
    label: d.toLocaleDateString(undefined, { weekday: "short" }),
    sleep: Number(sleep.toFixed(1)),
    stress: Math.round(Math.max(15, Math.min(85, stress))),
  };
});

/* ------------- component ------------- */
function Dashboard() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [range, setRange] = useState<Range>("7d");
  const [jokeIdx, setJokeIdx] = useState(0);

  useEffect(() => {
    Promise.all([hasActiveSession(), getSessionEmail()]).then(([active, userEmail]) => {
      if (active) {
        setSession(true);
        setEmail(userEmail);
        setProfile(getProfile());
        setMoods(getMoodLog());
        setProgress(getProgress());
      }
      setChecking(false);
    });
    setJokeIdx(Math.floor(Math.random() * JOKES.length));
  }, []);

  const trend = useMemo(() => makeStressTrend(range, moods), [range, moods]);
  const currentScore = trend[trend.length - 1]?.score ?? 42;
  const prevScore = trend[Math.max(0, trend.length - 8)]?.score ?? currentScore + 6;
  const weeklyChange = prevScore ? Math.round(((currentScore - prevScore) / prevScore) * 100) : 0;
  const band = stressBand(currentScore);

  const last7 = moods.filter((m) => m.at > Date.now() - 7 * 86400_000);
  const moodCounts = MOODS.map((m) => ({
    ...m,
    n: last7.filter((x) => x.mood === m.id).length,
  }));
  const todayMood = moods[0];
  const mostFrequent = moodCounts.reduce((a, b) => (b.n > a.n ? b : a), moodCounts[0]);
  const totalPlays = progress
    ? Object.values(progress).reduce((acc, g) => acc + Object.values(g).reduce((a, d) => a + d.plays, 0), 0)
    : 0;

  const signOut = async () => { await signOutAll(); nav({ to: "/" }); };

  if (checking) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="grid place-items-center py-32">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-rose grid place-items-center mx-auto shadow-soft">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl mt-6">Your dashboard awaits 🌸</h1>
          <p className="text-muted-foreground mt-3">Sign in to view your stress insights, mood trends, and personalized wellness data.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth" className="px-6 py-3 rounded-full bg-gradient-rose text-white font-medium shadow-soft hover:shadow-glow transition">Sign in</Link>
            <Link to="/" className="px-6 py-3 rounded-full bg-card border border-border">Back home</Link>
          </div>
        </section>
      </div>
    );
  }

  const greetName = profile?.fullName?.split(" ")[0] || email?.split("@")[0] || "friend";
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">

        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">{greet}, {greetName}! <span className="inline-block">👋</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Take a deep breath and focus on your well-being.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profile" className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-accent/40 transition">
              <UserCircle2 className="w-4 h-4" /> Profile
            </Link>
            <button onClick={signOut} className="text-sm inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-accent/40 transition">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Top stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Stress Score" tone="rose">
            <div className="flex items-end gap-2">
              <div className="text-4xl font-display font-semibold" style={{ color: band.color }}>{currentScore}</div>
              <div className="text-sm text-muted-foreground mb-1">/100</div>
            </div>
            <div className={`text-xs font-medium mt-1 ${band.text}`}>{band.label}</div>
          </StatCard>
          <StatCard label="Stress Level" tone="amber" icon={<Smile className="w-5 h-5" />}>
            <div className="text-2xl font-display" style={{ color: band.color }}>{band.label}</div>
            <div className="text-xs text-muted-foreground mt-1">You're doing okay</div>
          </StatCard>
          <StatCard label="Weekly Change" tone="emerald" icon={<TrendingDown className="w-5 h-5" />}>
            <div className={`text-2xl font-display ${weeklyChange <= 0 ? "text-emerald-500" : "text-teal-600"}`}>
              {weeklyChange <= 0 ? "↓" : "↑"} {Math.abs(weeklyChange)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">{weeklyChange <= 0 ? "Better than last week" : "Up vs last week"}</div>
          </StatCard>
          <StatCard label="Risk Level" tone="emerald" icon={<Heart className="w-5 h-5" />}>
            <div className="text-2xl font-display text-emerald-500">{currentScore < 60 ? "Low" : currentScore < 80 ? "Medium" : "High"}</div>
            <div className="text-xs text-muted-foreground mt-1">Keep it up!</div>
          </StatCard>
        </div>

        {/* Two-column main */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stress trend (2 cols) */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="font-display text-xl">Your Stress Journey</h2>
                <p className="text-xs text-muted-foreground">Stress score over time</p>
              </div>
              <div className="inline-flex bg-accent/40 rounded-full p-1 text-xs">
                {(["7d", "30d", "3m"] as Range[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-full transition ${range === r ? "bg-gradient-rose text-white shadow-soft" : "text-muted-foreground"}`}
                  >
                    {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "3 Months"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ left: -20, top: 5, right: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(222,99,138,0.12)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f7b9c4", background: "var(--card)" }} />
                  <Area type="monotone" dataKey="score" stroke="#4A90E2" strokeWidth={2.5} fill="url(#stressGrad)" dot={{ r: 3, fill: "#4A90E2" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span>Your stress level has <b className="text-emerald-600">{weeklyChange <= 0 ? "decreased" : "increased"} by {Math.abs(weeklyChange)}%</b> compared to last week.</span>
            </div>
          </Card>

          {/* Contributors pie */}
          <Card>
            <h2 className="font-display text-xl mb-1">Stress Contributors</h2>
            <p className="text-xs text-muted-foreground mb-3">Top stress triggers</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CONTRIBUTORS} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {CONTRIBUTORS.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f7b9c4", background: "var(--card)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {CONTRIBUTORS.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />{c.name}</span>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-teal-900/30 dark:to-cyan-900/20">
              <div className="text-[10px] uppercase tracking-widest text-primary font-medium">Top Trigger</div>
              <div className="font-display text-base">Exam Pressure</div>
            </div>
          </Card>
        </div>

        {/* Sleep + habits + insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sleep analysis */}
          <Card>
            <h2 className="font-display text-xl mb-3">Sleep Analysis</h2>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <SleepStat icon={Moon} value="7.2 hrs" label="Average Sleep" />
              <SleepStat icon={Sparkles} value="Good" label="Sleep Quality" />
              <SleepStat icon={Activity} value="85%" label="Consistency" />
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Sleep Hours vs Stress Score</p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SLEEP_DATA} margin={{ left: -25, top: 5, right: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.15)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #c4b5fd", background: "var(--card)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" name="Sleep (hrs)" dataKey="sleep" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" name="Stress" dataKey="stress" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Habits */}
          <Card>
            <h2 className="font-display text-xl mb-4">Healthy Habit Progress</h2>
            <div className="grid grid-cols-3 gap-3">
              {HABITS.map((h) => <HabitRing key={h.name} {...h} />)}
            </div>
          </Card>

          {/* AI Insights */}
          <Card>
            <h2 className="font-display text-xl mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Insights</h2>
            <ul className="space-y-2">
              {INSIGHTS.map((i, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-accent/30 hover:bg-accent/50 transition">
                  <i.icon className={`w-4 h-4 mt-0.5 shrink-0 ${i.color}`} />
                  <span className="text-sm leading-snug">{i.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Mood row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's mood */}
          <Card className="lg:col-span-1 text-center">
            <h2 className="font-display text-xl mb-3">Today's Mood</h2>
            {todayMood ? (
              <>
                <div className="text-6xl my-3">{MOODS.find((m) => m.id === todayMood.mood)?.emoji}</div>
                <div className="font-display text-2xl capitalize">{todayMood.mood}</div>
                <div className="text-sm text-muted-foreground mt-1">You're feeling {todayMood.mood} today!</div>
              </>
            ) : (
              <>
                <div className="text-6xl my-3">🌸</div>
                <Link to="/" className="text-sm px-4 py-2 rounded-full bg-gradient-rose text-white inline-block mt-2">Log your mood</Link>
              </>
            )}
            <div className="mt-4 p-3 rounded-2xl bg-accent/40 text-left">
              <div className="text-[10px] uppercase tracking-widest text-primary font-medium">Most frequent this month</div>
              <div className="font-display text-lg capitalize">{mostFrequent?.label || "Calm"} {mostFrequent?.emoji || "😌"}</div>
            </div>
          </Card>

          {/* Weekly mood */}
          <Card className="lg:col-span-2">
            <h2 className="font-display text-xl mb-4">Weekly Mood Trend</h2>
            <div className="grid grid-cols-7 gap-2">
              {moodCounts.map((m) => (
                <div key={m.id} className="text-center">
                  <div className="h-28 flex items-end justify-center">
                    <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent transition-all hover:opacity-80" style={{ height: `${Math.max(8, Math.min(100, m.n * 25))}%` }} />
                  </div>
                  <div className="text-2xl mt-2">{m.emoji}</div>
                  <div className="text-[10px] text-muted-foreground capitalize">{m.label}</div>
                  <div className="text-[10px] font-medium">{m.n}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommendations + Quick action + Joke */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-accent/40 to-primary/20 border-primary/30">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-medium">
              <Wind className="w-3.5 h-3.5" /> Quick Action
            </div>
            <h3 className="font-display text-xl mt-2">Feeling overwhelmed?</h3>
            <p className="text-sm text-muted-foreground mt-1">Try a 1-minute breathing exercise.</p>
            <Link to="/exercise" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-rose text-white text-sm shadow-soft hover:shadow-glow transition">
              <Wind className="w-4 h-4" /> Breathe Now
            </Link>
            <div className="mt-6 p-4 rounded-2xl bg-card/70 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-primary font-medium flex items-center justify-between">
                <span>Daily Giggle</span>
                <button onClick={() => setJokeIdx((i) => (i + 1) % JOKES.length)} className="hover:text-foreground"><Shuffle className="w-3 h-3" /></button>
              </div>
              <p className="text-sm mt-2 leading-snug">"{JOKES[jokeIdx]}"</p>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="font-display text-xl mb-3">Personalized Recommendations</h2>
            <ul className="space-y-2">
              {RECOMMENDATIONS.map((r, i) => (
                <Link
                  key={i}
                  to={r.to}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-accent/30 hover:bg-accent/60 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-rose grid place-items-center shrink-0">
                    <r.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm flex-1">{r.text}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </ul>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <h2 className="font-display text-xl mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Achievements & Streaks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} className="text-center group">
                <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${a.color} grid place-items-center text-3xl shadow-soft group-hover:scale-105 transition`}>
                  {a.emoji}
                </div>
                <div className="text-xs font-medium mt-2">{a.title}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-border">
            <StreakBox icon={Flame} label="Current Streak" value={`${Math.max(1, last7.length)} days`} color="text-teal-600" />
            <StreakBox icon={Award} label="Longest Streak" value="14 days" color="text-amber-500" />
            <StreakBox icon={Trophy} label="Total Achievements" value={`${ACHIEVEMENTS.length + Math.min(7, totalPlays)}`} color="text-violet-500" />
          </div>
        </Card>

      </section>
    </div>
  );
}

/* ------------- subcomponents ------------- */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-soft transition hover:shadow-glow ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ label, children, icon, tone }: { label: string; children: React.ReactNode; icon?: React.ReactNode; tone?: string }) {
  const toneBg: Record<string, string> = {
    rose: "from-cyan-50 to-teal-100",
    amber: "from-amber-100 to-orange-200",
    emerald: "from-emerald-100 to-green-200",
  };
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-soft hover:shadow-glow transition relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</div>
        {icon && (
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${toneBg[tone || "rose"]} grid place-items-center text-foreground`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function SleepStat({ icon: Icon, value, label }: { icon: typeof Moon; value: string; label: string }) {
  return (
    <div className="text-center p-2 rounded-2xl bg-accent/30">
      <Icon className="w-4 h-4 mx-auto text-[#a78bfa]" />
      <div className="font-display text-base mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function HabitRing({ name, value, color, icon: Icon }: { name: string; value: number; color: string; icon: typeof Droplet }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-accent/50" />
          <circle
            cx="32" cy="32" r="28" stroke={color} strokeWidth="6" fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <Icon className="w-3.5 h-3.5 mx-auto" style={{ color }} />
            <div className="text-sm font-display font-semibold leading-none mt-0.5">{value}%</div>
          </div>
        </div>
      </div>
      <div className="text-[11px] mt-2 font-medium">{name}</div>
    </div>
  );
}

function StreakBox({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) {
  return (
    <div className="text-center p-3 rounded-2xl bg-accent/30">
      <Icon className={`w-5 h-5 mx-auto ${color}`} />
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      <div className="font-display text-lg">{value}</div>
    </div>
  );
}
