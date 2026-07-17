import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export const Route = createFileRoute("/sketch")({
  component: SketchPage,
});

function SketchPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="font-display text-5xl">
          🎨 Sketch & Draw
        </h1>

        <p className="text-muted-foreground mt-3 mb-8">
          Express your emotions through drawing and coloring.
        </p>

        <div className="rounded-3xl border border-border bg-white p-4 shadow-soft">
          <div style={{ width: "100%", height: "600px" }}>
            <Tldraw />
          </div>
        </div>
      </section>
    </div>
  );
}