import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { WifiOff, Wifi, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/offline-app")({
  head: () => ({
    meta: [
      { title: "Offline Farmer App — AgriChain" },
      { name: "description", content: "Track crops, prices and notes offline. Syncs when back online." },
    ],
  }),
  component: OfflinePage,
});

type Entry = { id: string; crop: string; quantity: string; price: string; note: string; at: number; synced: boolean };

const KEY = "agrichain.offline.entries";

function OfflinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [online, setOnline] = useState(true);
  const [form, setForm] = useState({ crop: "", quantity: "", price: "", note: "" });

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setEntries(JSON.parse(raw));
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const persist = (next: Entry[]) => {
    setEntries(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.crop) return;
    persist([{ id: crypto.randomUUID(), ...form, at: Date.now(), synced: false }, ...entries]);
    setForm({ crop: "", quantity: "", price: "", note: "" });
  };

  const remove = (id: string) => persist(entries.filter((e) => e.id !== id));

  const sync = () => persist(entries.map((e) => ({ ...e, synced: true })));

  const pending = entries.filter((e) => !e.synced).length;

  return (
    <PageShell
      eyebrow="Works without internet"
      title="Offline Smart Farmer App"
      description="Log harvests, prices and field notes anytime. Data is stored on your device and syncs when you're online."
    >
      <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
        online ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
      }`}>
        {online ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
        {online ? "Online" : "Offline"} {pending > 0 && `· ${pending} pending`}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={add} className="bg-gradient-card p-6 rounded-2xl border border-border space-y-3">
          <h2 className="font-semibold">New entry</h2>
          <input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}
            placeholder="Crop (e.g. Wheat)" className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Quantity (kg)" className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price (₹/kg)" className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
          </div>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Notes" rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 rounded-lg bg-gradient-hero text-primary-foreground font-medium shadow-soft">
              <Plus className="size-4" /> Save
            </button>
            <button type="button" onClick={sync} disabled={!online || pending === 0}
              className="px-4 py-2.5 rounded-lg bg-card border border-border font-medium disabled:opacity-50">
              Sync ({pending})
            </button>
          </div>
        </form>

        <div className="bg-card p-6 rounded-2xl border border-border">
          <h2 className="font-semibold mb-3">Recent entries</h2>
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                <div className="flex-1">
                  <p className="font-medium">{e.crop} <span className="text-xs text-muted-foreground">· {e.quantity}kg @ ₹{e.price}</span></p>
                  {e.note && <p className="text-sm text-muted-foreground mt-0.5">{e.note}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(e.at).toLocaleString()} · {e.synced ? "✓ Synced" : "⏳ Pending"}
                  </p>
                </div>
                <button onClick={() => remove(e.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
