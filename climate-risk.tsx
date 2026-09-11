import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { CloudRain, Loader2 } from "lucide-react";

export const Route = createFileRoute("/climate-risk")({
  head: () => ({
    meta: [
      { title: "Climate Risk Prediction — AgriChain" },
      { name: "description", content: "AI-driven climate risk forecast for your farm location and crop." },
    ],
  }),
  component: ClimateRiskPage,
});

function ClimateRiskPage() {
  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("");
  const [horizon, setHorizon] = useState("30");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const predict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are a climate-risk advisor for farmers. Given a location, crop and horizon (days), output a structured risk assessment with: ## Overall Risk (Low/Medium/High), ## Key Threats (rain, drought, heat, frost, pests), ## Recommended Actions. Be specific and concise.",
          messages: [{ role: "user", content: `Location: ${location}\nCrop: ${crop}\nHorizon: next ${horizon} days. Give the assessment.` }],
        }),
      });
      const data = await res.json();
      setResult(data.text || "Could not generate forecast.");
    } catch {
      setResult("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Plan ahead"
      title="Climate Risk Prediction"
      description="Get an AI-driven outlook for weather and pest risks affecting your crop."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={predict} className="bg-gradient-card p-6 rounded-2xl border border-border space-y-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required
              placeholder="e.g. Pune, Maharashtra"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Crop</label>
            <input value={crop} onChange={(e) => setCrop(e.target.value)} required
              placeholder="e.g. Sugarcane"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Forecast window</label>
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background">
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="90">Next 90 days</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-semibold shadow-soft disabled:opacity-50">
            {loading ? <Loader2 className="size-5 animate-spin" /> : <CloudRain className="size-5" />}
            {loading ? "Forecasting..." : "Predict risk"}
          </button>
        </form>

        <div className="bg-card p-6 rounded-2xl border border-border min-h-[300px]">
          <h2 className="font-semibold mb-3">Risk report</h2>
          {!result && !loading && <p className="text-sm text-muted-foreground">Fill the form to see your forecast.</p>}
          {loading && <p className="text-sm text-muted-foreground">Crunching weather patterns...</p>}
          {result && <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{result}</pre>}
        </div>
      </div>
    </PageShell>
  );
}
