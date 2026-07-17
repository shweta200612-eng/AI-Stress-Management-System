import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/5min breathing")({
  component: BreathingRecommendation,
});

function BreathingRecommendation() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold">
          🌬 Practice 5-Minute Breathing
        </h1>

        <p className="text-muted-foreground mt-2">
          Deep breathing is one of the quickest ways to reduce stress, calm your
          mind, and improve focus. Just five minutes of mindful breathing can
          make a noticeable difference.
        </p>

        <div className="mt-8 space-y-6">

          {/* Benefits */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🌟 Benefits of Deep Breathing
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Reduces stress and anxiety.</li>
              <li>Lowers heart rate and blood pressure.</li>
              <li>Improves concentration and focus.</li>
              <li>Increases oxygen supply to the brain.</li>
              <li>Promotes relaxation and emotional balance.</li>
              <li>Improves sleep quality.</li>
            </ul>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              🧘 How to Practice
            </h2>

            <ol className="list-decimal ml-6 mt-4 space-y-2">
              <li>Sit comfortably with your back straight.</li>
              <li>Close your eyes and relax your shoulders.</li>
              <li>Inhale slowly through your nose for 4 seconds.</li>
              <li>Hold your breath for 4 seconds.</li>
              <li>Exhale gently through your mouth for 6 seconds.</li>
              <li>Repeat this cycle for 5 minutes.</li>
            </ol>
          </div>

          {/* Best Time */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              ⏰ Best Time to Practice
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>After waking up.</li>
              <li>Before studying or working.</li>
              <li>During stressful situations.</li>
              <li>Before going to sleep.</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border p-6 shadow">
            <h2 className="text-2xl font-semibold">
              💡 Helpful Tips
            </h2>

            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Find a quiet place.</li>
              <li>Breathe gently without forcing it.</li>
              <li>Keep your attention on your breath.</li>
              <li>If your mind wanders, slowly bring your focus back.</li>
              <li>Practice every day for better results.</li>
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
              "Take a deep breath. It's the first step toward feeling calmer and
              stronger."
            </blockquote>
          </div>

          {/* Challenge */}
          <div className="rounded-2xl border p-6 shadow bg-yellow-50">
            <h2 className="text-2xl font-semibold text-yellow-700">
              🎯 Today's Challenge
            </h2>

            <p className="mt-3">
              Complete one uninterrupted 5-minute breathing session today.
              Notice how your body and mind feel before and after the exercise.
            </p>
          </div>

          {/* Completion */}
          <div className="rounded-2xl border p-6 shadow text-center">
            <h2 className="text-2xl font-semibold">
              ✅ Complete Today's Session
            </h2>

            <p className="mt-2">
              Finished your breathing exercise? Mark it as completed and keep
              building your healthy daily routine.
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