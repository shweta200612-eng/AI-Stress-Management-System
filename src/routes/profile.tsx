import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { hasActiveSession } from "@/lib/session";
import { getProfile, saveProfile, type Profile } from "@/lib/wellness-store";
import { toast } from "sonner";
import { Loader2, UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Your profile — Bloom" }] }),
  component: ProfilePage,
});

const EMPTY: Profile = {
  fullName: "", age: "", gender: "", occupation: "", routineType: "",
  workStudyHours: "", sleepDuration: "", waterIntake: "", exerciseFrequency: "",
  screenTime: "", educationLevel: "", hobbies: "",
};

function ProfilePage() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [p, setP] = useState<Profile>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    hasActiveSession().then((active) => {
      if (!active) { nav({ to: "/auth" }); return; }
      setAuthed(true);
      const existing = getProfile();
      if (existing) setP(existing);
    });
  }, [nav]);

  const upd = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.fullName.trim()) { toast.error("Please share your name 🌸"); return; }
    setSaving(true);
    saveProfile(p);
    toast.success("Profile saved 💕");
    setTimeout(() => nav({ to: "/dashboard" }), 300);
  };

  if (authed === null) return <div className="min-h-screen grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-rose grid place-items-center mx-auto shadow-soft">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl mt-4">Tell us about you</h1>
          <p className="text-muted-foreground mt-2">A few gentle questions so Bloom can personalize your rituals.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-border shadow-soft p-6 md:p-8 space-y-6">
          <Section title="Basics">
            <Field label="Full name"><input value={p.fullName} onChange={(e) => upd("fullName", e.target.value)} className={inputCls} required placeholder="e.g. Aisha Khan" /></Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Age"><input type="number" min={1} max={120} value={p.age} onChange={(e) => upd("age", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} /></Field>
              <Field label="Gender">
                <select value={p.gender} onChange={(e) => upd("gender", e.target.value)} className={inputCls}>
                  <option value="">Select…</option>
                  <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                </select>
              </Field>
              <Field label="Education level">
                <select value={p.educationLevel} onChange={(e) => upd("educationLevel", e.target.value)} className={inputCls}>
                  <option value="">Select…</option>
                  <option>High school</option><option>Undergraduate</option><option>Postgraduate</option><option>Doctorate</option><option>Other</option>
                </select>
              </Field>
            </div>
            <Field label="Occupation"><input value={p.occupation} onChange={(e) => upd("occupation", e.target.value)} className={inputCls} placeholder="Student, designer, doctor…" /></Field>
          </Section>

          <Section title="Daily routine">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Routine type">
                <select value={p.routineType} onChange={(e) => upd("routineType", e.target.value)} className={inputCls}>
                  <option value="">Select…</option>
                  <option>Morning person</option><option>Balanced</option><option>Night owl</option><option>Shift / irregular</option>
                </select>
              </Field>
              <Field label="Working / study hours per day">
                <input type="number" min={0} max={24} value={p.workStudyHours} onChange={(e) => upd("workStudyHours", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Sleep duration (hours)">
                <input type="number" min={0} max={24} step="0.5" value={p.sleepDuration} onChange={(e) => upd("sleepDuration", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Water intake (glasses)">
                <input type="number" min={0} max={30} value={p.waterIntake} onChange={(e) => upd("waterIntake", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Exercise frequency (per week)">
                <select value={p.exerciseFrequency} onChange={(e) => upd("exerciseFrequency", e.target.value)} className={inputCls}>
                  <option value="">Select…</option>
                  <option>Rarely</option><option>1–2 times</option><option>3–4 times</option><option>5+ times</option><option>Daily</option>
                </select>
              </Field>
              <Field label="Screen time (hours/day)">
                <input type="number" min={0} max={24} value={p.screenTime} onChange={(e) => upd("screenTime", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
              </Field>
            </div>
          </Section>

          <Section title="A little about you">
            <Field label="Hobbies & interests"><textarea value={p.hobbies} onChange={(e) => upd("hobbies", e.target.value)} rows={3} className={inputCls} placeholder="Reading, painting, gardening, dancing…" /></Field>
          </Section>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => nav({ to: "/dashboard" })} className="px-5 py-2.5 rounded-full bg-white border border-border text-sm">Skip for now</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full bg-gradient-rose text-white text-sm shadow-soft inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save & continue
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white border border-input focus:outline-none focus:ring-2 focus:ring-primary/40";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg text-foreground mb-3">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><div className="text-sm font-medium mb-1.5">{label}</div>{children}</label>);
}
