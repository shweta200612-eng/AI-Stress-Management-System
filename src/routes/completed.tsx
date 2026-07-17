import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/completed")({
  component: CompletedPage,
});

function CompletedPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-3xl mx-auto py-20 px-6">

        <div className="rounded-3xl shadow-lg border p-10 text-center bg-green-50">

          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-5" />

          <h1 className="text-4xl font-bold text-green-700">
            Goal Completed!
          </h1>

          <p className="mt-5 text-lg">
            🎉 Congratulations!
          </p>

          <p className="mt-3 text-muted-foreground">
            You successfully completed today's wellness goal.
            Keep maintaining healthy habits every day.
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-8 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>
    </div>
  );
}