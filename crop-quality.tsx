import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Upload, ScanLine, Loader2 } from "lucide-react";

export const Route = createFileRoute("/crop-quality")({
  head: () => ({
    meta: [
      { title: "AI Crop Quality — AgriChain" },
      { name: "description", content: "Snap a photo of your crop and get instant AI quality grading and disease detection." },
    ],
  }),
  component: CropQualityPage,
});

function CropQualityPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(f);
    setResult(null);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are an expert agronomist. Analyze the crop image and respond with: 1) Crop type 2) Quality grade (A/B/C) 3) Visible diseases or issues 4) 2-3 short recommendations. Use markdown headings.",
          imageDataUrl: image,
          messages: [{ role: "user", content: "Analyze this crop image." }],
        }),
      });
      const data = await res.json();
      setResult(data.text || "Analysis failed.");
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="AI vision"
      title="Crop Quality Analyzer"
      description="Upload a clear photo of leaves, fruits or grains. Get an instant grade and disease check."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-card p-6 rounded-2xl border border-border">
          <label className="block">
            <div className={`aspect-square rounded-xl border-2 border-dashed border-border grid place-items-center cursor-pointer overflow-hidden bg-secondary/40 hover:bg-secondary transition ${image ? "p-0" : "p-6"}`}>
              {image ? (
                <img src={image} alt="crop" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="size-10 mx-auto mb-2" />
                  <p className="font-medium text-foreground">Tap to upload</p>
                  <p className="text-sm">JPG/PNG up to 5 MB</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" capture="environment" hidden
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          <button
            disabled={!image || loading}
            onClick={analyze}
            className="mt-4 w-full inline-flex justify-center items-center gap-2 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-semibold shadow-soft disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <ScanLine className="size-5" />}
            {loading ? "Analyzing..." : "Analyze quality"}
          </button>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border min-h-[300px]">
          <h2 className="font-semibold mb-3">Analysis report</h2>
          {!result && !loading && <p className="text-sm text-muted-foreground">Upload an image to get started.</p>}
          {loading && <p className="text-sm text-muted-foreground">Reading the image...</p>}
          {result && (
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{result}</pre>
          )}
        </div>
      </div>
    </PageShell>
  );
}
