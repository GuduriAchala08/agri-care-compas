import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ShieldCheck, Mic, WifiOff, ScanLine, CloudRain, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriChain — Smart Agriculture Supply Chain" },
      { name: "description", content: "End-to-end agriculture supply chain with microinsurance, voice assistant, offline app, AI crop quality and climate risk." },
      { property: "og:title", content: "AgriChain — Smart Agriculture Supply Chain" },
      { property: "og:description", content: "Empowering farmers with insurance, AI and offline tools." },
    ],
  }),
  component: Home,
});

const features = [
  { to: "/microinsurance", icon: ShieldCheck, title: "Microinsurance", desc: "Affordable crop & weather cover with instant quotes.", color: "text-success" },
  { to: "/voice-assistant", icon: Mic, title: "Voice Assistant", desc: "Ask anything in your language. Hands-free help while you work.", color: "text-primary" },
  { to: "/offline-app", icon: WifiOff, title: "Offline Farmer App", desc: "Log crops, prices and notes — syncs when you're back online.", color: "text-accent-foreground" },
  { to: "/crop-quality", icon: ScanLine, title: "AI Crop Quality", desc: "Snap a photo. Instantly grade quality and spot diseases.", color: "text-primary" },
  { to: "/climate-risk", icon: CloudRain, title: "Climate Risk", desc: "Forecast weather risks for your farm and plan ahead.", color: "text-warning" },
] as const;

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 -z-10" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
            <Sprout className="size-3.5" /> Farm to fork, transparent and smart
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
            A smarter <span className="text-primary">agriculture supply chain</span> for every farmer.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insurance, AI quality checks, climate forecasts, voice help and offline tools — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/crop-quality" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition">
              Try Crop AI <ArrowRight className="size-4" />
            </Link>
            <Link to="/microinsurance" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-card border border-border font-medium hover:bg-secondary transition">
              Get Insurance Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group bg-gradient-card p-6 rounded-2xl border border-border hover:shadow-soft transition relative overflow-hidden"
            >
              <div className={`size-12 rounded-xl bg-secondary grid place-items-center mb-4 ${f.color}`}>
                <f.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <ArrowRight className="absolute top-6 right-6 size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
