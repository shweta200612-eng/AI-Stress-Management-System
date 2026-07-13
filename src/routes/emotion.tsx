import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Camera, Mic, MicOff, CameraOff, Sparkles, Wind, AlertCircle, Activity, Brain } from "lucide-react";

export const Route = createFileRoute("/emotion")({
  head: () => ({ meta: [{ title: "Emotion Check-in — Bloom" }] }),
  component: EmotionPage,
});

type Reading = {
  stress: number; anxiety: number; energy: number; mood: string; emoji: string; advice: string[];
};

function analyze(faceStress: number, voiceStress: number, faceEnergy: number, voiceVar: number, camOn: boolean, micOn: boolean): Reading {
  const n = (camOn ? 1 : 0) + (micOn ? 1 : 0);
  const stress = Math.round(((camOn ? faceStress : 0) + (micOn ? voiceStress : 0)) / Math.max(1, n));
  const anxiety = Math.round(Math.min(100, voiceVar * 1.3 + faceStress * 0.4));
  const energy = Math.round(Math.min(100, faceEnergy * 0.6 + voiceStress * 0.5));

  if (stress < 25 && anxiety < 30)
    return { stress, anxiety, energy, mood: "Calm & grounded", emoji: "🌿", advice: [
      "Lovely — keep the rhythm. Try a 2-min gratitude note.",
      "Sip warm water. Stretch the shoulders.",
      "Save this moment in your mood log.",
    ]};
  if (stress < 50 && anxiety < 55)
    return { stress, anxiety, energy, mood: "Mildly tense", emoji: "🌸", advice: [
      "Try 4-7-8 breathing for 4 rounds.",
      "Step away from screens for 5 minutes.",
      "Play a quick Bubble Pop game to release.",
    ]};
  if (stress < 75 || anxiety < 75)
    return { stress, anxiety, energy, mood: "Notable stress", emoji: "💗", advice: [
      "Box breathing 4-4-4-4 — 6 rounds.",
      "Try the Gentle Restorative session in Exercise.",
      "Open AI Buddy and talk it out — no judgement.",
    ]};
  return { stress, anxiety, energy, mood: "High stress signal", emoji: "🆘", advice: [
    "Pause. Cool water on wrists and face.",
    "Lie down — legs up the wall for 3 minutes.",
    "If this keeps up, please reach out to someone you trust or a professional.",
  ]};
}

function EmotionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camOn, setCamOn] = useState(false);
  const [faceStress, setFaceStress] = useState(0);
  const [faceEnergy, setFaceEnergy] = useState(0);
  const [skinWarmth, setSkinWarmth] = useState(0);
  const lastFrameRef = useRef<ImageData | null>(null);
  const faceRaf = useRef(0);

  const startCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCamOn(true);
      loopFace();
    } catch { setCamOn(false); }
  };
  const stopCam = () => {
    const s = videoRef.current?.srcObject as MediaStream | null;
    s?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    cancelAnimationFrame(faceRaf.current);
    setCamOn(false);
  };

  const loopFace = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = 160; c.height = 120;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const cur = ctx.getImageData(0, 0, c.width, c.height);
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < cur.data.length; i += 16) { r += cur.data[i]; g += cur.data[i + 1]; b += cur.data[i + 2]; }
    const n = cur.data.length / 16;
    const warmth = Math.min(100, Math.max(0, (r - b) / n * 2 + 50));
    setSkinWarmth(Math.round(warmth));
    if (lastFrameRef.current) {
      let diff = 0;
      const a = cur.data, prev = lastFrameRef.current.data;
      for (let i = 0; i < a.length; i += 16) diff += Math.abs(a[i] - prev[i]);
      const motion = Math.min(100, diff / 400);
      setFaceStress((s) => Math.round(s * 0.7 + motion * 0.3));
      setFaceEnergy((e) => Math.round(e * 0.7 + Math.min(100, motion * 1.5) * 0.3));
    }
    lastFrameRef.current = cur;
    faceRaf.current = requestAnimationFrame(loopFace);
  };

  useEffect(() => () => stopCam(), []);

  const [micOn, setMicOn] = useState(false);
  const [voiceStress, setVoiceStress] = useState(0);
  const [voiceVar, setVoiceVar] = useState(0);
  const [voiceVol, setVoiceVol] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micRaf = useRef(0);
  const lastVolsRef = useRef<number[]>([]);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      audioCtxRef.current = ctx; analyserRef.current = an;
      setMicOn(true);
      loopMic();
    } catch { setMicOn(false); }
  };
  const stopMic = () => {
    cancelAnimationFrame(micRaf.current);
    audioCtxRef.current?.close();
    audioCtxRef.current = null; analyserRef.current = null;
    setMicOn(false);
  };

  const loopMic = () => {
    const an = analyserRef.current; if (!an) return;
    const data = new Uint8Array(an.fftSize);
    an.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
    const rms = Math.sqrt(sum / data.length);
    const vol = Math.min(1, rms * 4);
    setVoiceVol(Math.round(vol * 100));
    lastVolsRef.current.push(vol);
    if (lastVolsRef.current.length > 30) lastVolsRef.current.shift();
    const mean = lastVolsRef.current.reduce((a, b) => a + b, 0) / lastVolsRef.current.length;
    const variance = lastVolsRef.current.reduce((a, b) => a + (b - mean) ** 2, 0) / lastVolsRef.current.length;
    const tension = Math.min(100, mean * 80 + variance * 600);
    setVoiceVar(Math.min(100, Math.round(variance * 1200)));
    setVoiceStress((s) => Math.round(s * 0.7 + tension * 0.3));
    micRaf.current = requestAnimationFrame(loopMic);
  };

  useEffect(() => () => stopMic(), []);

  const reading = analyze(faceStress, voiceStress, faceEnergy, voiceVar, camOn, micOn);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Emotion check-in</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Interactive in-browser face & voice analysis. Nothing is recorded or sent — all signals stay on this device. Not a clinical tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Face */}
          <div className="rounded-3xl bg-white border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl flex items-center gap-2"><Camera className="w-5 h-5 text-primary" /> Face analysis</h2>
              <button onClick={camOn ? stopCam : startCam} className="text-xs px-3 py-1.5 rounded-full bg-gradient-rose text-white flex items-center gap-1">
                {camOn ? <><CameraOff className="w-3.5 h-3.5" /> Stop</> : <><Camera className="w-3.5 h-3.5" /> Start</>}
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-accent grid place-items-center relative">
              <video ref={videoRef} muted playsInline className={`w-full h-full object-cover ${camOn ? "" : "hidden"}`} />
              {!camOn && <p className="text-sm text-muted-foreground">Camera off — start to analyze facial micro-movements.</p>}
              {camOn && (
                <div className="absolute top-2 left-2 right-2 flex justify-between text-[10px] font-mono text-white bg-black/30 backdrop-blur px-2 py-1 rounded">
                  <span>tension {faceStress}</span><span>energy {faceEnergy}</span><span>warmth {skinWarmth}</span>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Meter label="Tension" value={faceStress} />
              <Meter label="Energy" value={faceEnergy} />
              <Meter label="Warmth" value={skinWarmth} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Hold still for 10 seconds for a calmer reading; rapid motion signals tension.</p>
          </div>

          {/* Voice */}
          <div className="rounded-3xl bg-white border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl flex items-center gap-2"><Mic className="w-5 h-5 text-primary" /> Voice analysis</h2>
              <button onClick={micOn ? stopMic : startMic} className="text-xs px-3 py-1.5 rounded-full bg-gradient-rose text-white flex items-center gap-1">
                {micOn ? <><MicOff className="w-3.5 h-3.5" /> Stop</> : <><Mic className="w-3.5 h-3.5" /> Start</>}
              </button>
            </div>
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 grid place-items-center relative overflow-hidden">
              <div className="relative w-32 h-32 grid place-items-center">
                <span className="absolute inset-0 rounded-full bg-primary/30" style={{ transform: `scale(${1 + voiceVol / 100})`, transition: "transform 80ms" }} />
                <span className="absolute inset-2 rounded-full bg-primary/40 breathe-anim" />
                <Mic className="w-12 h-12 text-primary relative z-10" />
              </div>
              {micOn && <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-foreground"><span>vol {voiceVol}</span><span>variance {voiceVar}</span><span>tension {voiceStress}</span></div>}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Meter label="Volume" value={voiceVol} />
              <Meter label="Variance" value={voiceVar} />
              <Meter label="Tension" value={voiceStress} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Speak naturally for ~10s. High variance + volume often signals anxiety.</p>
          </div>
        </div>

        {/* Combined reading */}
        <div className="mt-8 rounded-3xl bg-gradient-rose text-white p-8 shadow-glow">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Your reading</p>
              <h3 className="font-display text-3xl mt-1">{reading.emoji} {reading.mood}</h3>
            </div>
            <Sparkles className="w-10 h-10 opacity-80" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <ReadingBar icon={Activity} label="Stress" value={reading.stress} />
            <ReadingBar icon={Brain} label="Anxiety" value={reading.anxiety} />
            <ReadingBar icon={Wind} label="Energy" value={reading.energy} />
          </div>

          <div className="mt-6 bg-white/15 backdrop-blur rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest opacity-80 mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Advice for right now</div>
            <ul className="space-y-2">
              {reading.advice.map((t) => (<li key={t} className="text-sm flex items-start gap-2"><Wind className="w-4 h-4 mt-0.5 shrink-0" /> {t}</li>))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <Link to="/exercise" className="text-sm px-4 py-2 rounded-full bg-white text-foreground font-medium">Exercise & meditation →</Link>
            <Link to="/chat" className="text-sm px-4 py-2 rounded-full bg-white/20 backdrop-blur">Talk to AI Buddy</Link>
            <Link to="/playlist" className="text-sm px-4 py-2 rounded-full bg-white/20 backdrop-blur">Soothing playlist</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{label}</span><span>{value}</span></div>
      <div className="h-2 rounded-full bg-accent overflow-hidden"><div className="h-full bg-gradient-rose transition-all" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function ReadingBar({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><Icon className="w-3.5 h-3.5" /> {label}</div>
      <div className="text-3xl font-display mt-1">{value}<span className="text-sm opacity-80">/100</span></div>
      <div className="h-1.5 mt-2 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
