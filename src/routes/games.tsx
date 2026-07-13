import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getProgress, updateProgress, type Difficulty, type GameKey, type GameProgress } from "@/lib/wellness-store";
import { Timer, Target, Brain, Trophy, RefreshCw, Type, Hammer, Palette } from "lucide-react";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Funny Games — Bloom" }] }),
  component: GamesPage,
});

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

function DiffPicker({ value, onChange }: { value: Difficulty; onChange: (d: Difficulty) => void }) {
  return (
    <div className="inline-flex bg-white rounded-full p-1 border border-border">
      {DIFFS.map((d) => (
        <button key={d} onClick={() => onChange(d)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition ${
          value === d ? "bg-gradient-rose text-white shadow-soft" : "text-muted-foreground hover:text-foreground"
        }`}>{d}</button>
      ))}
    </div>
  );
}

function ProgressBadge({ progress, game, diff, suffix = "" }: { progress: GameProgress; game: GameKey; diff: Difficulty; suffix?: string }) {
  const p = progress[game][diff];
  return (
    <div className="text-xs text-muted-foreground flex items-center gap-3">
      <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-primary" /> Best: <b className="text-foreground">{p.best}{suffix}</b></span>
      <span>Plays: <b className="text-foreground">{p.plays}</b></span>
    </div>
  );
}

function GameCard({ title, icon: Icon, children, diff, setDiff, game, progress, suffix }: {
  title: string; icon: typeof Target; children: React.ReactNode;
  diff: Difficulty; setDiff: (d: Difficulty) => void;
  game: GameKey; progress: GameProgress; suffix?: string;
}) {
  return (
    <div className="rounded-3xl bg-white border border-border p-6 shadow-soft">
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center"><Icon className="w-5 h-5 text-primary" /></div>
          <h3 className="font-display text-xl">{title}</h3>
        </div>
        <DiffPicker value={diff} onChange={setDiff} />
      </div>
      <ProgressBadge progress={progress} game={game} diff={diff} suffix={suffix} />
      <div className="mt-4">{children}</div>
    </div>
  );
}

// --- 1. Reaction Tap ---
function ReactionGame({ diff, onScore }: { diff: Difficulty; onScore: (ms: number) => void }) {
  const [state, setState] = useState<"idle" | "wait" | "go" | "done">("idle");
  const [ms, setMs] = useState(0);
  const startRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const start = () => {
    setState("wait");
    const range = diff === "easy" ? [1500, 3500] : diff === "medium" ? [900, 2500] : [600, 1800];
    const delay = range[0] + Math.random() * (range[1] - range[0]);
    timer.current = setTimeout(() => { startRef.current = performance.now(); setState("go"); }, delay);
  };
  const click = () => {
    if (state === "wait") { clearTimeout(timer.current); setState("idle"); return; }
    if (state === "go") { const took = Math.round(performance.now() - startRef.current); setMs(took); setState("done"); onScore(took); }
  };
  const bg = state === "go" ? "bg-primary text-white" : state === "wait" ? "bg-accent" : "bg-accent";
  const label = state === "idle" ? "Tap to start" : state === "wait" ? "Wait for blue…" : state === "go" ? "TAP NOW!" : `${ms} ms — go again`;
  return (
    <div className="space-y-3">
      <button onClick={state === "idle" || state === "done" ? start : click} className={`w-full h-44 rounded-2xl font-display text-2xl transition ${bg}`}>{label}</button>
      <p className="text-xs text-muted-foreground">Lower time wins.</p>
    </div>
  );
}

// --- 2. Bubble Pop ---
function BubbleGame({ diff, onScore }: { diff: Difficulty; onScore: (n: number) => void }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; s: number }[]>([]);
  const speed = diff === "easy" ? 1400 : diff === "medium" ? 900 : 550;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    const spawn = setInterval(() => {
      setBubbles((b) => [...b, { id: Math.random(), x: Math.random() * 80 + 5, y: Math.random() * 70 + 10, s: 30 + Math.random() * 40 }]);
    }, speed);
    return () => { clearInterval(t); clearInterval(spawn); };
  }, [running, speed]);
  useEffect(() => { if (running && time <= 0) { setRunning(false); onScore(score); setBubbles([]); } }, [time, running, score, onScore]);
  const pop = (id: number) => { setBubbles((b) => b.filter((x) => x.id !== id)); setScore((s) => s + 1); };
  const start = () => { setScore(0); setTime(20); setBubbles([]); setRunning(true); };
  return (
    <div className="space-y-3">
      <div className="relative h-56 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 overflow-hidden">
        {!running && <button onClick={start} className="absolute inset-0 grid place-items-center font-display text-2xl text-foreground">{score > 0 ? `Popped ${score}! Tap to retry` : "Tap to start (20s)"}</button>}
        {running && (<>
          <div className="absolute top-2 left-3 text-xs font-mono text-foreground">⏱ {time}s · 🫧 {score}</div>
          {bubbles.map((b) => (<button key={b.id} onClick={() => pop(b.id)} style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s }} className="absolute rounded-full bg-primary/70 hover:bg-primary transition" />))}
        </>)}
      </div>
    </div>
  );
}

// --- 3. Memory Match ---
function MemoryGame({ diff, onScore }: { diff: Difficulty; onScore: (sec: number) => void }) {
  const pairs = diff === "easy" ? 4 : diff === "medium" ? 6 : 8;
  const emojis = ["🌸", "🌿", "🦋", "🍓", "🌙", "🌈", "🍵", "💗"].slice(0, pairs);
  type Card = { id: number; e: string; flipped: boolean; matched: boolean };
  const build = (): Card[] => [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, e, flipped: false, matched: false }));
  const [cards, setCards] = useState<Card[]>(build);
  const [open, setOpen] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [t0, setT0] = useState(0);
  const [done, setDone] = useState(false);
  const reset = () => { setCards(build()); setOpen([]); setStarted(false); setDone(false); };
  const flip = (id: number) => {
    if (open.length === 2) return;
    if (!started) { setStarted(true); setT0(Date.now()); }
    const c = cards.find((c) => c.id === id);
    if (!c || c.flipped || c.matched) return;
    const next = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setCards(next);
    const newOpen = [...open, id];
    setOpen(newOpen);
    if (newOpen.length === 2) {
      const [a, b] = newOpen;
      const ca = next.find((c) => c.id === a)!; const cb = next.find((c) => c.id === b)!;
      if (ca.e === cb.e) setTimeout(() => { setCards((cs) => cs.map((c) => c.id === a || c.id === b ? { ...c, matched: true } : c)); setOpen([]); }, 400);
      else setTimeout(() => { setCards((cs) => cs.map((c) => c.id === a || c.id === b ? { ...c, flipped: false } : c)); setOpen([]); }, 800);
    }
  };
  useEffect(() => { if (started && !done && cards.every((c) => c.matched)) { const sec = Math.round((Date.now() - t0) / 1000); setDone(true); onScore(sec); } }, [cards, started, done, t0, onScore]);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => (
          <button key={c.id} onClick={() => flip(c.id)} className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition ${c.flipped || c.matched ? "bg-accent" : "bg-gradient-rose text-transparent"}`}>
            {c.flipped || c.matched ? c.e : "?"}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{done ? "Cleared! Lower seconds = better." : "Lower seconds = better."}</p>
        <button onClick={reset} className="text-xs text-primary inline-flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Reset</button>
      </div>
    </div>
  );
}

// --- 4. Word Scramble ---
const WORDS = { easy: ["calm","rose","bloom","glow","hope","peace","kind"], medium: ["breathe","sunrise","gentle","flower","mindful","balance"], hard: ["serenity","mindfulness","wellbeing","gratitude","reflection","tranquil"] };
function shuffle(s: string) { return s.split("").sort(() => Math.random() - 0.5).join(""); }
function ScrambleGame({ diff, onScore }: { diff: Difficulty; onScore: (n: number) => void }) {
  const pool = WORDS[diff];
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(45);
  const [score, setScore] = useState(0);
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState("");
  const scrambled = (w: string) => { let s = shuffle(w); while (s === w) s = shuffle(w); return s; };
  const [display, setDisplay] = useState("");
  const next = () => { const w = pool[Math.floor(Math.random() * pool.length)]; setWord(w); setDisplay(scrambled(w)); setGuess(""); };
  useEffect(() => { if (!running) return; const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); }, [running]);
  useEffect(() => { if (running && time <= 0) { setRunning(false); onScore(score); } }, [time, running, score, onScore]);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (guess.toLowerCase().trim() === word) { setScore((s) => s + 1); next(); } };
  const start = () => { setScore(0); setTime(45); next(); setRunning(true); };
  return (
    <div className="space-y-3">
      {!running ? (
        <button onClick={start} className="w-full py-6 rounded-2xl bg-gradient-rose text-white font-display text-xl">{score > 0 ? `Got ${score}! Retry` : "Start (45s)"}</button>
      ) : (
        <>
          <div className="flex justify-between text-xs font-mono text-foreground"><span>⏱ {time}s</span><span>✨ {score}</span></div>
          <div className="rounded-2xl bg-accent grid place-items-center py-6 font-display text-3xl tracking-widest uppercase">{display}</div>
          <form onSubmit={submit} className="flex gap-2">
            <input value={guess} onChange={(e) => setGuess(e.target.value)} autoFocus placeholder="Unscramble…" className="flex-1 px-4 py-2 rounded-xl border border-input bg-white" />
            <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-rose text-white">Go</button>
            <button type="button" onClick={next} className="px-3 py-2 rounded-xl border border-border text-xs">Skip</button>
          </form>
        </>
      )}
    </div>
  );
}

// --- 5. Whack-a-mole ---
function WhackGame({ diff, onScore }: { diff: Difficulty; onScore: (n: number) => void }) {
  const speed = diff === "easy" ? 1100 : diff === "medium" ? 750 : 480;
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(25);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(-1);
  useEffect(() => { if (!running) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    const m = setInterval(() => setActive(Math.floor(Math.random() * 9)), speed);
    return () => { clearInterval(t); clearInterval(m); };
  }, [running, speed]);
  useEffect(() => { if (running && time <= 0) { setRunning(false); onScore(score); setActive(-1); } }, [time, running, score, onScore]);
  const hit = (i: number) => { if (i === active) { setScore((s) => s + 1); setActive(-1); } };
  const start = () => { setScore(0); setTime(25); setRunning(true); };
  return (
    <div className="space-y-3">
      {!running ? (
        <button onClick={start} className="w-full py-6 rounded-2xl bg-gradient-rose text-white font-display text-xl">{score > 0 ? `Hit ${score}! Retry` : "Start (25s)"}</button>
      ) : (
        <>
          <div className="flex justify-between text-xs font-mono text-foreground"><span>⏱ {time}s</span><span>🔨 {score}</span></div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <button key={i} onClick={() => hit(i)} className={`aspect-square rounded-2xl transition grid place-items-center text-3xl ${i === active ? "bg-gradient-rose text-white scale-105" : "bg-accent"}`}>
                {i === active ? "🌸" : ""}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- 6. Color Match ---
const COLORS = [
  { name: "RED", hex: "#ef4444" }, { name: "BLUE", hex: "#3b82f6" }, { name: "GREEN", hex: "#22c55e" },
  { name: "PINK", hex: "#ec4899" }, { name: "YELLOW", hex: "#eab308" }, { name: "PURPLE", hex: "#a855f7" },
];
function ColorGame({ diff, onScore }: { diff: Difficulty; onScore: (n: number) => void }) {
  const tickMs = diff === "easy" ? 2500 : diff === "medium" ? 1700 : 1100;
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [word, setWord] = useState(COLORS[0]);
  const [ink, setInk] = useState(COLORS[1]);
  const [match, setMatch] = useState(false);
  const next = () => {
    const w = COLORS[Math.floor(Math.random() * COLORS.length)];
    const m = Math.random() < 0.5;
    const i = m ? w : COLORS.filter((c) => c.name !== w.name)[Math.floor(Math.random() * (COLORS.length - 1))];
    setWord(w); setInk(i); setMatch(m);
  };
  useEffect(() => { if (!running) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    const r = setInterval(next, tickMs);
    return () => { clearInterval(t); clearInterval(r); };
  }, [running, tickMs]);
  useEffect(() => { if (running && time <= 0) { setRunning(false); onScore(score); } }, [time, running, score, onScore]);
  const answer = (a: boolean) => { if (a === match) setScore((s) => s + 1); else setScore((s) => Math.max(0, s - 1)); next(); };
  const start = () => { setScore(0); setTime(30); next(); setRunning(true); };
  return (
    <div className="space-y-3">
      {!running ? (
        <button onClick={start} className="w-full py-6 rounded-2xl bg-gradient-rose text-white font-display text-xl">{score > 0 ? `Score ${score}! Retry` : "Start (30s)"}</button>
      ) : (
        <>
          <div className="flex justify-between text-xs font-mono text-foreground"><span>⏱ {time}s</span><span>🎨 {score}</span></div>
          <div className="rounded-2xl bg-accent grid place-items-center py-10 font-display text-4xl font-bold" style={{ color: ink.hex }}>{word.name}</div>
          <p className="text-xs text-muted-foreground text-center">Does the WORD match the INK color?</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => answer(true)} className="py-3 rounded-xl bg-gradient-rose text-white font-medium">Match ✓</button>
            <button onClick={() => answer(false)} className="py-3 rounded-xl bg-white border border-border font-medium">No match ✗</button>
          </div>
        </>
      )}
    </div>
  );
}

function GamesPage() {
  const [progress, setProgress] = useState<GameProgress>(() => getProgress());
  const [d1, setD1] = useState<Difficulty>("easy");
  const [d2, setD2] = useState<Difficulty>("easy");
  const [d3, setD3] = useState<Difficulty>("easy");
  const [d4, setD4] = useState<Difficulty>("easy");
  const [d5, setD5] = useState<Difficulty>("easy");
  const [d6, setD6] = useState<Difficulty>("easy");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Funny Games</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Six stress-relief mini games. Pick a difficulty — your best score is saved per level.</p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <GameCard title="Reaction Tap" icon={Timer} diff={d1} setDiff={setD1} game="reaction" progress={progress} suffix=" ms">
            <ReactionGame diff={d1} onScore={(ms) => setProgress(updateProgress("reaction", d1, ms, false))} />
          </GameCard>
          <GameCard title="Bubble Pop" icon={Target} diff={d2} setDiff={setD2} game="bubble" progress={progress}>
            <BubbleGame diff={d2} onScore={(n) => setProgress(updateProgress("bubble", d2, n, true))} />
          </GameCard>
          <GameCard title="Memory Garden" icon={Brain} diff={d3} setDiff={setD3} game="memory" progress={progress} suffix=" s">
            <MemoryGame diff={d3} onScore={(sec) => setProgress(updateProgress("memory", d3, sec, false))} />
          </GameCard>
          <GameCard title="Word Scramble" icon={Type} diff={d4} setDiff={setD4} game="scramble" progress={progress}>
            <ScrambleGame diff={d4} onScore={(n) => setProgress(updateProgress("scramble", d4, n, true))} />
          </GameCard>
          <GameCard title="Whack-a-Bloom" icon={Hammer} diff={d5} setDiff={setD5} game="whack" progress={progress}>
            <WhackGame diff={d5} onScore={(n) => setProgress(updateProgress("whack", d5, n, true))} />
          </GameCard>
          <GameCard title="Color Match" icon={Palette} diff={d6} setDiff={setD6} game="color" progress={progress}>
            <ColorGame diff={d6} onScore={(n) => setProgress(updateProgress("color", d6, n, true))} />
          </GameCard>
        </div>
      </section>
    </div>
  );
}
