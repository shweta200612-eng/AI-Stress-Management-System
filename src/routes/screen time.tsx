import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/screen time")({
  component: ScreenTimeRecommendation,
});

function ScreenTimeRecommendation() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold">
          📵 Reduce Screen Time 
        </h1>

        <p className="text-muted-foreground mt-2">
          Reducing screen time helps lower stress, improve sleep quality,
          increase focus, and support better mental well-being.
        </p>

        <div className="mt-8 space-y-6">

          {/* Benefits */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🌟 Benefits of Reducing Screen Time
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Reduces stress and mental fatigue.</li>
              <li>Improves sleep quality by limiting blue light exposure.</li>
              <li>Enhances concentration and productivity.</li>
              <li>Decreases eye strain and headaches.</li>
              <li>Encourages healthier daily habits.</li>
              <li>Creates more time for family, hobbies, and exercise.</li>
            </ul>
          </div>

          {/* How to Reduce */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              📱 How to Reduce Screen Time
            </h2>

            <ol className="list-decimal ml-6 mt-4 space-y-2">
              <li>Turn off unnecessary notifications.</li>
              <li>Set a daily screen time limit.</li>
              <li>Avoid using your phone during meals.</li>
              <li>Keep your phone away while studying.</li>
              <li>Take a 5-minute break after every 30–45 minutes of screen use.</li>
              <li>Replace scrolling with reading or walking.</li>
            </ol>
          </div>

          {/* Signs */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              ⚠ Signs You Need Less Screen Time
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Frequent headaches or eye strain.</li>
              <li>Difficulty sleeping at night.</li>
              <li>Poor concentration while studying.</li>
              <li>Feeling anxious without your phone.</li>
              <li>Spending more than 6–8 hours on screens daily.</li>
            </ul>
          </div>

          {/* Healthy Alternatives */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🌿 Healthy Alternatives
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Go for a short walk.</li>
              <li>Read a book.</li>
              <li>Practice meditation.</li>
              <li>Listen to relaxing music.</li>
              <li>Talk with family or friends.</li>
              <li>Play indoor or outdoor games.</li>
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
              "The less time you spend on your screen, the more time you have to
              enjoy real life."
            </blockquote>
          </div>

          {/* Challenge */}
          <div className="rounded-2xl border p-6 shadow bg-yellow-50">
            <h2 className="text-2xl font-semibold text-yellow-700">
              🎯 Today's Challenge
            </h2>

            <p className="mt-3">
              Stay away from your phone for one full hour. Use that time to
              exercise, read, meditate, or spend quality time with family.
            </p>
          </div>

          {/* Complete */}
          <div className="rounded-2xl border p-6 shadow text-center">
            <h2 className="text-2xl font-semibold">
              ✅ Complete Today's Goal
            </h2>

            <p className="mt-2">
              Successfully reduced your screen time today? Mark this task as
              completed and continue building healthier digital habits.
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