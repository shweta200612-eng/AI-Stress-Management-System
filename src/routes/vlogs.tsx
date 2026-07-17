import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/vlogs")({
  component: VlogsPage,
});

function VlogsPage() {
  const videos = [
    {
      title: "Finding Peace Through Travel",
      ytId: "kG3KjKlGU_Q",
    },
    {
      title: "Nature's Therapy & Full Time Laugh",
      ytId: "SRw1V3oQ8BE",
    },
    {
      title: "Smile & Unwind",
      ytId: "ENBNDkfBlls",
    },
    {
      title: "Adventure for the Soul",
      ytId: "1-sgwVhqY1k",
    },
    {
      title: "Moments That Matter",
      ytId: "zLydqaHIwDQ",
    },
    {
      title: "Escape the Everyday",
      ytId: "Y6_Fi4kAL6A",
    },
    {
      title: "Escape the Everyday",
      ytId: "uVjKvxpxbXw",
    },
    {
      title: "Escape the Everyday",
      ytId: "0394hg6bhMU",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">

        <h1 className="font-display text-5xl">
          🎥 Stress Relief Vlogs
        </h1>

        <p className="text-muted-foreground mt-3 mb-10">
          Watch inspiring stories, motivation, meditation and stress relief videos.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {videos.map((video) => (

            <div
              key={video.title}
              className="rounded-3xl bg-white border border-border shadow-soft overflow-hidden"
            >

              <iframe
                className="w-full h-56"
                src={`https://www.youtube.com/embed/${video.ytId}`}
                title={video.title}
                allowFullScreen
              />

              <div className="p-5">

                <h2 className="font-display text-xl">
                  {video.title}
                </h2>
              </div>

            </div>

          ))}

        </div>

      </section>
    </div>
  );
}