// Lightweight localStorage helpers for moods, game progress, reminders, profile.
export type Mood = "calm" | "happy" | "stressed" | "sad" | "anxious" | "tired" | "energized";

export const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "happy", label: "Happy", emoji: "🌸" },
  { id: "stressed", label: "Stressed", emoji: "💢" },
  { id: "sad", label: "Sad", emoji: "💧" },
  { id: "anxious", label: "Anxious", emoji: "🌀" },
  { id: "tired", label: "Tired", emoji: "🌙" },
  { id: "energized", label: "Energized", emoji: "✨" },
];

const safeGet = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const safeSet = (k: string, v: unknown) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

export type MoodEntry = { mood: Mood; at: number; note?: string };
export const getMoodLog = () => safeGet<MoodEntry[]>("bloom.mood", []);
export const addMood = (m: Mood, note?: string) => {
  const log = getMoodLog();
  log.unshift({ mood: m, at: Date.now(), note });
  safeSet("bloom.mood", log.slice(0, 200));
};

export type Reminder = { id: string; type: "study" | "sleep"; time: string; label: string; enabled: boolean };
export const getReminders = () => safeGet<Reminder[]>("bloom.reminders", [
  { id: "s1", type: "study", time: "18:00", label: "Evening study sprint", enabled: true },
  { id: "z1", type: "sleep", time: "22:30", label: "Wind down for sleep", enabled: true },
]);
export const saveReminders = (r: Reminder[]) => safeSet("bloom.reminders", r);

export type GameKey = "reaction" | "bubble" | "memory" | "scramble" | "whack" | "color";
export type Difficulty = "easy" | "medium" | "hard";
export type GameProgress = Record<GameKey, Record<Difficulty, { best: number; plays: number }>>;

const emptyDiff = () => ({ easy: { best: 0, plays: 0 }, medium: { best: 0, plays: 0 }, hard: { best: 0, plays: 0 } });
const emptyProgress = (): GameProgress => ({
  reaction: emptyDiff(), bubble: emptyDiff(), memory: emptyDiff(),
  scramble: emptyDiff(), whack: emptyDiff(), color: emptyDiff(),
});

export const getProgress = (): GameProgress => {
  const p = safeGet<Partial<GameProgress>>("bloom.progress", {});
  const base = emptyProgress();
  return { ...base, ...p } as GameProgress;
};
export const updateProgress = (g: GameKey, d: Difficulty, score: number, higherIsBetter = true) => {
  const p = getProgress();
  const cur = p[g][d];
  const better = higherIsBetter ? score > cur.best : (cur.best === 0 || score < cur.best);
  p[g][d] = { best: better ? score : cur.best, plays: cur.plays + 1 };
  safeSet("bloom.progress", p);
  return p;
};

export type Profile = {
  fullName: string;
  age: number | "";
  gender: string;
  occupation: string;
  routineType: string; // morning person / night owl etc
  workStudyHours: number | "";
  sleepDuration: number | "";
  waterIntake: number | ""; // glasses
  exerciseFrequency: string; // per week
  screenTime: number | ""; // hours
  educationLevel: string;
  hobbies: string;
  createdAt?: number;
};

export const getProfile = (): Profile | null => safeGet<Profile | null>("bloom.profile", null);
export const saveProfile = (p: Profile) => safeSet("bloom.profile", { ...p, createdAt: p.createdAt ?? Date.now() });
