import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-semibold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This little page got lost in the petals.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-rose text-white px-5 py-2.5 text-sm font-medium shadow-soft">
          Take me home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">Take a breath. Try again, or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-rose text-white px-5 py-2.5 text-sm font-medium shadow-soft"
          >Try again</button>
          <a href="/" className="rounded-full border border-input bg-white px-5 py-2.5 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bloom — AI Stress Relief & Mental Wellness" },
      { name: "description", content: "Bloom is your AI-powered companion for stress relief, mood tracking, mindful games, music and gentle daily wellness." },
      { property: "og:title", content: "Bloom — AI Stress Relief & Mental Wellness" },
      { property: "og:description", content: "Bloom is your AI-powered companion for stress relief, mood tracking, mindful games, music and gentle daily wellness." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bloom — AI Stress Relief & Mental Wellness" },
      { name: "twitter:description", content: "Bloom is your AI-powered companion for stress relief, mood tracking, mindful games, music and gentle daily wellness." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/414d1d9e-5408-43ae-96d7-53f83013d288/id-preview-1ff1e696--d2e7b07a-969a-4478-bba4-7caaa6e00026.lovable.app-1782459446940.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/414d1d9e-5408-43ae-96d7-53f83013d288/id-preview-1ff1e696--d2e7b07a-969a-4478-bba4-7caaa6e00026.lovable.app-1782459446940.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
