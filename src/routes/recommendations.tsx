import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/recommendations")({
  component: Recommendations,
});

function Recommendations() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold">
          🚶 Take a 10-Minute Walk Today
        </h1>

        <p className="text-muted-foreground mt-2">
          Walking is one of the easiest and most effective ways to reduce stress,
          improve mood, and refresh your mind.
        </p>

        <div className="mt-8 space-y-6">

          {/* Benefits */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🌟 Benefits of Walking
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Reduces stress and anxiety.</li>
              <li>Improves mood by releasing endorphins.</li>
              <li>Boosts energy levels.</li>
              <li>Improves concentration and memory.</li>
              <li>Supports heart health.</li>
              <li>Helps improve sleep quality.</li>
            </ul>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              👣 How to Start
            </h2>

            <ol className="list-decimal ml-6 mt-4 space-y-2">
              <li>Wear comfortable shoes.</li>
              <li>Choose a safe walking route.</li>
              <li>Walk at a comfortable pace.</li>
              <li>Focus on your breathing.</li>
              <li>Enjoy nature or your surroundings.</li>
              <li>Drink water before and after your walk.</li>
            </ol>
          </div>

          {/* Best Time */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              ⏰ Best Time to Walk
            </h2>

            <p className="mt-3">
              Morning and evening walks are ideal. Morning walks increase energy
              for the day, while evening walks help reduce stress after work or
              study.
            </p>
          </div>

          {/* Duration */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              ⏱ Recommended Duration
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>10 minutes for beginners.</li>
              <li>20–30 minutes for better health benefits.</li>
              <li>Walk at least 5 days each week.</li>
            </ul>
          </div>
{/* AI Chat Buddy */}
<Link
  to="/chat"
  className="block rounded-2xl border p-6 shadow bg-green-50 hover:shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer"
>
  <h2 className="text-2xl font-semibold text-green-700">
    🤖 AI Chat Buddy
  </h2>

  <p className="mt-3 text-foreground">
    If your stress level is high, taking a short walk outdoors can help
    calm your mind. Walking for just 10 minutes may improve focus and
    reduce mental fatigue.
  </p>
  <p className="mt-4 text-blue-600 font-medium">
    💬 Click here to chat with Bloom AI →
  </p>
</Link>
          {/* Motivation */}
          <div className="rounded-2xl border p-6 shadow bg-blue-50">
            <h2 className="text-2xl font-semibold text-blue-700">
              💙 Daily Motivation
            </h2>

            <blockquote className="italic mt-3">
              "A short walk today can make a big difference in your mood tomorrow."
            </blockquote>
          </div>

          {/* Completion */}
          <div className="rounded-2xl border p-6 shadow text-center">
            <h2 className="text-2xl font-semibold">
              ✅ Complete Your Walk
            </h2>

            <p className="mt-2">
              After completing your 10-minute walk, mark it as completed to keep
              track of your healthy habits.
            </p>

             <Link
  to="/completed"
  className="inline-block mt-5 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
>
  Mark as Completed
</Link>
          </div>

        </div>
      </div>
    </div>
  );
}