"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="glass-strong rounded-3xl p-10 text-center">
      <h2 className="text-2xl font-black">Oups — un round perdu.</h2>
      <p className="mt-2 text-muted">Tente une autre attaque.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-xl flame-gradient text-black font-bold">Recharger</button>
        <Link href="/" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold">Accueil</Link>
      </div>
    </div>
  );
}
