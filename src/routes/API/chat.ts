import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Bloom, a warm, gentle AI wellness companion for a stress-management app.
You speak with kindness, brevity, and emotional intelligence. Always:
- Validate the user's feelings first in 1 short sentence.
- Offer ONE concrete micro-practice (breathing, grounding, journaling prompt, mini-game suggestion, song mood, stretch).
- Keep replies under 120 words. Use soft language, occasional ✨🌸💕 emojis sparingly.
- Never give medical or crisis diagnoses. If user mentions self-harm or crisis, gently encourage contacting a local helpline or trusted person.`;

export const Route = createFileRoute("/API/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse();
      },
    },
  },
});
