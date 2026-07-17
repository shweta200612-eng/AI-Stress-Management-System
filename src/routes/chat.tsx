import { createFileRoute,} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Bot, Send, Loader2, User } from "lucide-react";
import { toast } from "sonner";
export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat Buddy — Bloom" }] }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; parts: { type: "text"; text: string }[] };

const STARTERS = [
  "I'm feeling overwhelmed today",
  "Tell me a gentle joke",
  "Help me wind down before sleep",
  "Suggest a 1-minute breathing exercise",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "0", role: "assistant", parts: [{ type: "text", text: "Hi, I'm Bloom  — your wellness buddy. What's on your heart today?" }] },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text }] };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setBusy(true);
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(`Chat error ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const evt = JSON.parse(data);
            if (evt.type === "text-delta" && typeof evt.delta === "string") {
              acc += evt.delta;
              setMessages((m) => m.map((x) => x.id === assistantId ? { ...x, parts: [{ type: "text", text: acc }] } : x));
            }
          } catch {}
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setMessages((m) => m.filter((x) => x.id !== assistantId));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="flex-1 mx-auto w-full max-w-3xl px-5 py-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-rose grid place-items-center shadow-soft">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl">Bloom — your AI buddy</h1>
            <p className="text-sm text-muted-foreground">Gentle, private, here for you anytime.</p>
          </div>
        </div>

        <div ref={scroller} className="flex-1 overflow-y-auto rounded-3xl bg-white/70 backdrop-blur border border-border p-5 space-y-4 min-h-[420px]">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${m.role === "user" ? "bg-accent" : "bg-gradient-rose"}`}>
                {m.role === "user" ? <User className="w-4 h-4 text-foreground" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                m.role === "user" ? "bg-gradient-rose text-white" : "bg-transparent text-foreground"
              }`}>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {m.parts.map((p) => p.text).join("")}
                  {busy && m.role === "assistant" && m.id === messages[messages.length - 1].id && (
                    <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm align-middle" />
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-2 rounded-full bg-white border border-border hover:bg-accent/40">
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-4 flex gap-2">
          <input
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Bloom how you're feeling…"
            className="flex-1 px-5 py-3 rounded-full bg-white border border-input focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit" disabled={busy || !input.trim()}
            className="px-5 py-3 rounded-full bg-gradient-rose text-white font-medium shadow-soft hover:shadow-glow transition disabled:opacity-50 flex items-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </section>
    </div>
  );
}
