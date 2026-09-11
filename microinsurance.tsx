import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/microinsurance")({
  head: () => ({
    meta: [
      { title: "Microinsurance — AgriChain" },
      { name: "description", content: "Affordable microinsurance for crops, livestock and weather risk." },
    ],
  }),
  component: MicroinsurancePage,
});

const PLANS = [
  { id: "crop", name: "Crop Cover", base: 0.025, desc: "Yield loss from drought, flood or pests." },
  { id: "weather", name: "Weather Index", base: 0.018, desc: "Payout when rainfall/temperature triggers hit." },
  { id: "livestock", name: "Livestock", base: 0.04, desc: "Cover for cattle, goats and poultry." },
] as const;

function MicroinsurancePage() {
  const [plan, setPlan] = useState<typeof PLANS[number]["id"]>("crop");
  const [sumInsured, setSum] = useState(50000);
  const [acres, setAcres] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  const selected = PLANS.find((p) => p.id === plan)!;
  const premium = Math.round(sumInsured * selected.base * (1 + Math.log2(acres + 1) * 0.1));

  return (
    <PageShell
      eyebrow="Protect your harvest"
      title="Microinsurance for smallholder farmers"
      description="Get crop, weather-index and livestock cover. Quotes in seconds, claims via SMS."
    >
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {PLANS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`text-left p-5 rounded-2xl border transition ${
              plan === p.id
                ? "border-primary bg-secondary shadow-soft"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <ShieldCheck className={`size-6 mb-3 ${plan === p.id ? "text-primary" : "text-muted-foreground"}`} />
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-card p-6 rounded-2xl border border-border space-y-5">
          <div>
            <label className="text-sm font-medium">Sum insured (₹)</label>
            <input
              type="range" min={10000} max={500000} step={5000}
              value={sumInsured} onChange={(e) => setSum(+e.target.value)}
              className="w-full mt-2 accent-primary"
            />
            <p className="text-2xl font-bold mt-1">₹{sumInsured.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Land area (acres)</label>
            <input
              type="number" min={0.5} step={0.5} value={acres}
              onChange={(e) => setAcres(+e.target.value || 1)}
              className="w-full mt-2 px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>
        </div>

        <div className="bg-gradient-hero p-6 rounded-2xl text-primary-foreground shadow-soft flex flex-col justify-between">
          <div>
            <p className="text-sm opacity-90">Estimated annual premium</p>
            <p className="text-5xl font-bold mt-2">₹{premium.toLocaleString("en-IN")}</p>
            <p className="mt-2 text-sm opacity-90">{selected.name} — {(selected.base * 100).toFixed(1)}% base rate</p>
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="mt-6 w-full py-3 rounded-lg bg-card text-foreground font-semibold hover:bg-secondary transition"
          >
            {submitted ? "Application received ✓" : "Apply now"}
          </button>
        </div>
      </div>

      {submitted && (
        <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/30 flex gap-3 items-start">
          <CheckCircle2 className="size-5 text-success mt-0.5" />
          <div>
            <p className="font-medium">We'll text you within 24 hours.</p>
            <p className="text-sm text-muted-foreground">A field agent will verify and activate your cover.</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
