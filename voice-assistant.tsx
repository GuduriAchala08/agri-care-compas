import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Mic, MicOff, Volume2 } from "lucide-react";

export const Route = createFileRoute("/voice-assistant")({
  head: () => ({
    meta: [
      { title: "Voice Assistant — AgriChain" },
      { name: "description", content: "Ask farming questions hands-free with our AI voice assistant." },
    ],
  }),
  component: VoiceAssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function VoiceAssistantPage() {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-IN";
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setText(t);
      ask(t);
    };
    r.onend = () => setListening(false);
    recognitionRef.current = r;
  }, []);

  const speak = (txt: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  };

  const ask = async (q: string) => {
    if (!q.trim()) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setText("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are a friendly farming assistant for smallholder farmers in India. Give concise, practical answers in 2-3 sentences. Use simple words.",
          messages: next,
        }),
      });
      const data = await res.json();
      const reply = data.text || "Sorry, I couldn't answer that.";
      setMessages([...next, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const r = recognitionRef.current;
    if (!r) {
      alert("Voice recognition not supported in this browser. Try Chrome.");
      return;
    }
    if (listening) { r.stop(); setListening(false); }
    else { r.start(); setListening(true); }
  };

  return (
    <PageShell
      eyebrow="Hands-free help"
      title="Voice Assistant for farmers"
      description="Tap the mic and ask anything — from sowing dates to mandi prices."
    >
      <div className="grid md:grid-cols-[1fr,2fr] gap-6">
        <div className="bg-gradient-card p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
          <button
            onClick={toggleMic}
            className={`size-32 rounded-full grid place-items-center transition shadow-glow ${
              listening ? "bg-destructive animate-pulse" : "bg-gradient-hero"
            }`}
          >
            {listening ? <MicOff className="size-12 text-primary-foreground" /> : <Mic className="size-12 text-primary-foreground" />}
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            {listening ? "Listening..." : "Tap to speak"}
          </p>
          <div className="mt-4 w-full">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(text)}
              placeholder="Or type a question..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border min-h-[400px] flex flex-col">
          <div className="flex-1 space-y-3 overflow-auto">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Try: "When should I sow wheat?" or "How to prevent leaf blight?"
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  {m.role === "assistant" && (
                    <button onClick={() => speak(m.content)} className="mt-1 text-xs opacity-70 hover:opacity-100 inline-flex items-center gap-1">
                      <Volume2 className="size-3" /> Replay
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm text-muted-foreground">Thinking...</p>}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
