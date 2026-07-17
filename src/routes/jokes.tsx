import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/jokes")({
  component: JokesPage,
});

function JokesPage() {
  const jokes = [
    {
      title: "Study Break Laugh",
      joke: "Why did the student eat his homework? Because the teacher said it was a piece of cake! 😂",
    },
    {
      title: "Coding Humor",
      joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐞",
    },
    {
      title: "Stress Buster",
      joke: "My stress and I have a great relationship... it never leaves me alone! 😄",
    },
    {
      title: "Exam Special",
      joke: "Exams are like horror movies... you know something scary is coming! 📚😂",
    },
    {
      title: "Funny Campus",
      joke: "Student: 'Can I be punished for something I didn't do?' Teacher: 'No.' Student: 'Great! I didn't do my homework.' 😆",
    },
    {
      title: "Smile Therapy",
      joke: "Laughter is the shortest distance between two people. 😊",
    },
    {
      title: "Monday Mood",
      joke: "Coffee understands me better than people do. ☕😂",
    },
    {
      title: "Happy Mind",
      joke: "Don't worry if Plan A fails. There are 25 more letters! 😄",
    },
    {
      title: "Positive Vibes",
      joke: "Smile today... your future self will thank you! 🌸",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-12">

        <h1 className="font-display text-5xl">
          😂 Funny Jokes
        </h1>

        <p className="text-muted-foreground mt-3 mb-10">
          Enjoy funny jokes and brighten your day with laughter.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {jokes.map((item, index) => (

            <div
              key={index}
              className="rounded-3xl bg-white border border-border shadow-soft p-8 hover:shadow-glow transition"
            >

              <div className="text-5xl mb-5">
                😂
              </div>

              <h2 className="font-display text-xl">
                {item.title}
              </h2>

              <p className="mt-4 text-muted-foreground leading-7">
                {item.joke}
              </p>

            </div>

          ))}

        </div>

      </section>
    </div>
  );
}