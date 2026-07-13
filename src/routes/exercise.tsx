import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { EXERCISE_SESSIONS, MEDITATION_SESSIONS, YOGA_POSES, type StressLevel } from "@/lib/funbits";
import { Dumbbell, Flower2, Activity } from "lucide-react";

export const Route = createFileRoute("/exercise")({
  head: () => ({ meta: [{ title: "Exercise & Meditation — Bloom" }] }),
  component: ExercisePage,
});

const LEVELS: { id: StressLevel; label: string; desc: string; emoji: string }[] = [
{ id: "low", label: "Low", desc: "Feeling calm and relaxed", emoji: "😌" },
{ id: "medium", label: "Medium", desc: "A bit tense or restless", emoji: "😐" },
{ id: "high", label: "High", desc: "Very stressed or overwhelmed", emoji: "😰" },
];

function ExercisePage() {
  const [level, setLevel] = useState<StressLevel>("medium");
  const ex = EXERCISE_SESSIONS.find((e) => e.level === level)!;
  const med = MEDITATION_SESSIONS.find((m) => m.level === level)!;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Exercise & Meditation</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Sessions tuned to your current stress level — pick how you feel.</p>
        </div>

        {/* Stress selector */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {LEVELS.map((l) => (
            <button key={l.id} onClick={() => setLevel(l.id)} className={`text-left p-5 rounded-3xl border transition ${
              level === l.id ? "bg-gradient-rose text-white border-transparent shadow-soft" : "bg-white border-border hover:bg-accent/40"
            }`}>
              <div className="text-2xl">{l.emoji}</div>
              <div className="font-display text-lg mt-1">{l.label}</div>
              <div className={`text-xs mt-1 ${level === l.id ? "text-white/90" : "text-muted-foreground"}`}>{l.desc}</div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Exercise */}
          <div className="rounded-3xl bg-white border border-border p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center"><Dumbbell className="w-5 h-5 text-primary" /></div>
              <div>
                <h2 className="font-display text-2xl">{ex.emoji} {ex.title}</h2>
                <p className="text-xs text-muted-foreground">{ex.duration} · {level} stress</p>
              </div>
            </div>
            <ol className="space-y-3 mt-4">
              {ex.steps.map((s, i) => (
                <li key={s.name} className="flex gap-3 p-3 rounded-2xl bg-accent/40">
                  <div className="w-8 h-8 rounded-full bg-gradient-rose text-white grid place-items-center text-sm font-display shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between"><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-muted-foreground">{s.time}</div></div>
                    <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Meditation */}
          <div className="rounded-3xl bg-gradient-to-br from-accent/40 to-primary/15 border border-border p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white grid place-items-center"><Flower2 className="w-5 h-5 text-primary" /></div>
              <div>
                <h2 className="font-display text-2xl">{med.emoji} {med.title}</h2>
                <p className="text-xs text-muted-foreground">{med.duration} · guided</p>
              </div>
            </div>
            <ol className="space-y-2 mt-4">
              {med.script.map((line, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-primary font-mono text-xs mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-foreground leading-relaxed">{line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Yoga poses */}
        <div className="mt-10 rounded-3xl bg-white border border-border p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center"><Activity className="w-5 h-5 text-primary" /></div>
            <h2 className="font-display text-2xl">Yoga poses for any stress level</h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {YOGA_POSES.map((y) => (
              <li key={y.name} className="p-4 rounded-2xl bg-accent/40">
                <div className="flex justify-between gap-2"><div className="font-medium text-sm"> {y.name}</div><div className="text-xs text-muted-foreground">{y.duration}</div></div>
              <iframe
  width="100%"
  height="200"
  src={`https://www.youtube.com/embed/${y.ytId}`}
  title={y.name}
  allowFullScreen/>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
