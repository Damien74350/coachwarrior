"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="glass rounded-2xl p-6 ring-1 ring-danger/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 text-danger" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-danger">Une erreur est survenue</h2>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface p-3 text-xs text-muted">
{error.message}
{error.digest ? `\n\n(digest: ${error.digest})` : ""}
            </pre>
            <button
              onClick={() => reset()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
            >
              <RotateCcw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
