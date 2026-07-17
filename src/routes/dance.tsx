import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { DANCE_STYLES, DANCE_VIDEOS, type DanceStyle } from "@/lib/funbits";
import { Sparkles, Music2 } from "lucide-react";

export const Route = createFileRoute("/dance")({
  head: () => ({ meta: [{ title: "Dance Tutorials — Bloom" }] }),
  component: DancePage,
});

function DancePage() {
  const [style, setStyle] = useState<DanceStyle | "all">("all");
  const videos = style === "all" ? DANCE_VIDEOS : DANCE_VIDEOS.filter((v) => v.style === style);
  console.log("DANCE_VIDEOS:", DANCE_VIDEOS);
  console.log("Length:", DANCE_VIDEOS.length);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Dance tutorials</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Move it out — 10 styles, pick what feels fun today. Dancing releases endorphins and softens stress.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => setStyle("all")} className={`px-4 py-2 rounded-full text-sm border transition ${
            style === "all" ? "bg-gradient-rose text-white border-transparent" : "bg-white border-border hover:bg-accent/40"
          }`}>✨ All</button>
          {DANCE_STYLES.map((s) => (
            <button key={s.id} onClick={() => setStyle(s.id)} className={`px-4 py-2 rounded-full text-sm border transition ${
              style === s.id ? "bg-gradient-rose text-white border-transparent" : "bg-white border-border hover:bg-accent/40"
            }`}>{s.emoji} {s.label}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => {
            const meta = DANCE_STYLES.find((s) => s.id === v.style)!;
            return (
              <div key={v.id} className="rounded-3xl bg-white border border-border p-3 shadow-soft hover:shadow-glow transition">
                <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.ytId}`} title={v.title}
                    loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-display text-base truncate">{v.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{meta.emoji} {meta.label} · {v.level}</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        {videos.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <Music2 className="w-8 h-8 mx-auto mb-2" /> No videos for this style yet.
          </div>
        )}
      </section>
    </div>
  );
}
