import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/drink water")({
  component: WaterRecommendation,
});

function WaterRecommendation() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold">
          💧 Drink 2 More Glasses of Water
        </h1>

        <p className="text-muted-foreground mt-2">
          Staying hydrated is essential for both physical and mental health.
          Drinking two extra glasses of water each day can improve your energy,
          concentration, mood, and overall well-being.
        </p>

        <div className="mt-8 space-y-6">

          {/* Benefits */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🌟 Benefits of Drinking More Water
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Improves concentration and memory.</li>
              <li>Reduces fatigue and increases energy.</li>
              <li>Helps regulate body temperature.</li>
              <li>Supports healthy digestion.</li>
              <li>Improves skin hydration and appearance.</li>
              <li>Reduces headaches caused by dehydration.</li>
            </ul>
          </div>

          {/* How to Stay Hydrated */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🥤 How to Stay Hydrated
            </h2>

            <ol className="list-decimal ml-6 mt-4 space-y-2">
              <li>Start your day with one glass of water.</li>
              <li>Carry a reusable water bottle.</li>
              <li>Drink water before every meal.</li>
              <li>Set reminders to drink water every hour.</li>
              <li>Eat water-rich fruits like watermelon and oranges.</li>
              <li>Drink extra water after exercise.</li>
            </ol>
          </div>

          {/* Signs */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              ⚠ Signs of Dehydration
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Dry mouth and lips.</li>
              <li>Dark yellow urine.</li>
              <li>Headaches.</li>
              <li>Feeling tired or dizzy.</li>
              <li>Poor concentration.</li>
              <li>Dry skin.</li>
            </ul>
          </div>

          {/* Daily Goal */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🎯 Today's Hydration Goal
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Drink 8–10 glasses of water today.</li>
              <li>Add 2 extra glasses compared to yesterday.</li>
              <li>Make it a habit to drink a glass of water early in the morning after completing your morning routine..</li>
              <li>Drink another glass before bedtime.</li>
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
              "Every glass of water you drink is a step toward a healthier,
              happier you."
            </blockquote>
          </div>

          {/* Challenge */}
          <div className="rounded-2xl border p-6 shadow bg-yellow-50">
            <h2 className="text-2xl font-semibold text-yellow-700">
              🏆 Today's Challenge
            </h2>

            <p className="mt-3">
              Drink two additional glasses of water today and notice the
              difference in your energy and concentration levels.
            </p>
          </div>

          {/* Completion */}
          <div className="rounded-2xl border p-6 shadow text-center">
            <h2 className="text-2xl font-semibold">
              ✅ Complete Today's Goal
            </h2>

            <p className="mt-2">
              Finished your hydration goal? Mark today's task as completed and
              continue building a healthy daily habit.
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