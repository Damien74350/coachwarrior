"use client";

import { useEffect, useState } from "react";
import type { AssetResponse, SearchHit } from "@/lib/types";
import AssetHeader from "./AssetHeader";
import PriceChart from "./PriceChart";
import MetricsGrid from "./MetricsGrid";
import IndicatorsPanel from "./IndicatorsPanel";
import SignalBadge from "./SignalBadge";
import ReasonsList from "./ReasonsList";
import { Loader2, AlertTriangle } from "lucide-react";

export default function AssetView({ hit }: { hit: SearchHit }) {
  const [data, setData] = useState<AssetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    const ctrl = new AbortController();
    (async () => {
      try {
        const url =
          hit.id === "__demo__"
            ? `/api/asset?demo=1`
            : `/api/asset?kind=${hit.kind}&id=${encodeURIComponent(hit.id)}`;
        const r = await fetch(url, { signal: ctrl.signal });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        setData(j);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [hit]);

  if (loading) {
    return (
      <div className="glass flex items-center gap-3 rounded-2xl p-8 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Chargement des données pour {hit.symbol}…
      </div>
    );
  }
  if (error) {
    return (
      <div className="glass flex items-start gap-3 rounded-2xl p-6 ring-1 ring-danger/30">
        <AlertTriangle className="h-5 w-5 text-danger" />
        <div>
          <div className="font-semibold text-danger">Impossible de charger {hit.symbol}</div>
          <div className="text-sm text-muted">{error}</div>
        </div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <AssetHeader s={data.summary} />
      </div>

      <div className="lg:col-span-2">
        <SignalBadge signal={data.analysis.signal} score={data.analysis.score} confidence={data.analysis.confidence} />
      </div>
      <div className="lg:col-span-1 lg:row-span-2">
        <ReasonsList analysis={data.analysis} />
      </div>

      <div className="lg:col-span-2">
        <PriceChart history={data.history} currency={data.summary.currency} />
      </div>

      <div className="lg:col-span-2">
        <MetricsGrid s={data.summary} />
      </div>
      <div className="lg:col-span-1">
        <IndicatorsPanel analysis={data.analysis} />
      </div>
    </div>
  );
}
