import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };
type Body = { system?: string; messages: Msg[]; imageDataUrl?: string };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "AI not configured" }, { status: 500 });
        }
        const { system, messages, imageDataUrl } = (await request.json()) as Body;

        const lastUser = messages[messages.length - 1];
        const userContent: any = imageDataUrl
          ? [
              { type: "text", text: lastUser?.content || "Analyze this image." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ]
          : lastUser?.content || "";

        const finalMessages = [
          ...(system ? [{ role: "system", content: system }] : []),
          ...messages.slice(0, -1),
          { role: "user", content: userContent },
        ];

        try {
          const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: finalMessages,
            }),
          });
          if (!r.ok) {
            const t = await r.text();
            if (r.status === 429) return Response.json({ error: "Rate limited, please retry." }, { status: 429 });
            if (r.status === 402) return Response.json({ error: "AI credits exhausted." }, { status: 402 });
            return Response.json({ error: t }, { status: 500 });
          }
          const data = await r.json();
          const text = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ text });
        } catch (e) {
          return Response.json({ error: e instanceof Error ? e.message : "unknown" }, { status: 500 });
        }
      },
    },
  },
});
