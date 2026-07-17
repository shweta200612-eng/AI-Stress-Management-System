import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/quotes")({
  component: QuotesPage,
});

function QuotesPage() {
  const quotes = [
    {
      quote: "Every day is a new beginning. Take a deep breath and start again.",
      author: "Bloom",
    },
    {
      quote: "Your mind is stronger than your stress.",
      author: "Bloom",
    },
    {
      quote: "Small progress is still progress.",
      author: "Bloom",
    },
    {
      quote: "Believe in yourself even when life feels difficult.",
      author: "Bloom",
    },
    {
      quote: "Don't stop until you're proud of yourself.",
      author: "Unknown",
    },
    {
      quote: "Success begins with a positive mindset.",
      author: "Bloom",
    },
    {
      quote: "Be kind to yourself. You are doing your best.",
      author: "Bloom",
    },
    {
      quote: "Focus on progress, not perfection.",
      author: "Bloom",
    },
    {
      quote: "Stay patient. Great things take time.",
      author: "Unknown",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">

        <h1 className="font-display text-5xl">
          💬 Motivational Quotes
        </h1>

        <p className="text-muted-foreground mt-3 mb-10">
          Read inspiring quotes to reduce stress and stay motivated every day.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {quotes.map((item, index) => (

            <div
              key={index}
              className="rounded-3xl bg-white border border-border shadow-soft p-8 hover:shadow-lg transition"
            >

              <div className="text-5xl mb-4">
                💙
              </div>

              <p className="text-lg italic leading-8">
                "{item.quote}"
              </p>

              <p className="mt-6 text-right text-primary font-semibold">
                — {item.author}
              </p>

            </div>

          ))}

        </div>

      </section>
    </div>
  );
}