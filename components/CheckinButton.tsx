"use client";

import { useEffect, useState } from "react";
import { ScanLine, X, MapPin, CheckCircle2, Smartphone } from "lucide-react";

export function CheckinButton({ size = "default" }: { size?: "default" | "small" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"scan" | "success">("scan");

  useEffect(() => {
    if (!open) return;
    setStep("scan");
    const t = setTimeout(() => setStep("success"), 2200);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-xl flame-gradient text-black font-black shadow-glow pulse-glow ${
          size === "small" ? "px-3 py-2 text-sm" : "px-5 py-3"
        }`}
      >
        <ScanLine size={size === "small" ? 16 : 20} />
        Check-in au club
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="glass-strong rounded-3xl p-6 sm:p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10">
              <X size={18} />
            </button>

            {step === "scan" ? (
              <div className="text-center">
                <div className="mx-auto w-56 h-56 rounded-2xl bg-black ring-2 ring-flame/40 relative overflow-hidden">
                  <div className="absolute inset-4 grid grid-cols-7 grid-rows-7 gap-0.5">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={(i * 7 + (i % 13)) % 3 === 0 ? "bg-white" : ""} />
                    ))}
                  </div>
                  <div className="absolute inset-x-4 h-0.5 bg-flame shadow-glow" style={{ animation: "scan 1.6s ease-in-out infinite" }} />
                </div>
                <p className="mt-5 font-black text-lg">Scanne le QR à l'entrée</p>
                <p className="text-xs text-muted mt-1 flex items-center justify-center gap-1.5">
                  <MapPin size={12} className="text-flame" /> Entrée principale détectée
                </p>
                <p className="text-[11px] text-muted mt-3">2 secondes, c'est tout. Tes minutes commencent à compter.</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="mx-auto w-20 h-20 rounded-full grid place-items-center flame-gradient text-black mb-3">
                  <CheckCircle2 size={40} />
                </div>
                <p className="text-2xl font-black">Check-in validé ⚡</p>
                <p className="text-sm text-muted mt-1">Iron Republic Paris · Entrée principale</p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Mini label="Streak" value="48j" />
                  <Mini label="Aujourd'hui" value="+1pt/min" />
                  <Mini label="Bonus actif" value="×2" />
                </div>

                <div className="mt-5 rounded-xl bg-flame/10 ring-1 ring-flame/30 p-3 text-left">
                  <p className="text-xs font-bold text-flame flex items-center gap-1.5"><Smartphone size={12} /> Apple Health connecté</p>
                  <p className="text-[11px] text-muted mt-0.5">La sortie est détectée auto. Pas besoin de re-scanner.</p>
                </div>

                <button onClick={() => setOpen(false)} className="mt-5 w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-bold text-sm">
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 12px; }
          50% { top: calc(100% - 14px); }
        }
      `}</style>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <p className="text-[9px] uppercase tracking-wider text-muted">{label}</p>
      <p className="text-sm font-black mt-0.5">{value}</p>
    </div>
  );
}
