"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PricePoint } from "@/lib/types";
import { sma } from "@/lib/indicators";
import { fmtMoney } from "@/lib/format";

type Range = "1M" | "3M" | "6M" | "1Y" | "ALL";
const ranges: { id: Range; days: number | null; label: string }[] = [
  { id: "1M", days: 30, label: "1M" },
  { id: "3M", days: 90, label: "3M" },
  { id: "6M", days: 180, label: "6M" },
  { id: "1Y", days: 365, label: "1A" },
  { id: "ALL", days: null, label: "Tout" },
];

export default function PriceChart({ history, currency }: { history: PricePoint[]; currency: string }) {
  const [range, setRange] = useState<Range>("3M");

  const sliced = useMemo(() => {
    const r = ranges.find((x) => x.id === range)!;
    if (r.days === null) return history;
    return history.slice(-r.days);
  }, [history, range]);

  const data = useMemo(() => {
    const prices = sliced.map((p) => p.c);
    const s20 = sma(prices, 20);
    const s50 = sma(prices, 50);
    return sliced.map((p, i) => ({
      date: p.date,
      c: p.c,
      sma20: isNaN(s20[i]) ? null : s20[i],
      sma50: isNaN(s50[i]) ? null : s50[i],
    }));
  }, [sliced]);

  const first = sliced[0]?.c ?? 0;
  const last = sliced[sliced.length - 1]?.c ?? 0;
  const isUp = last >= first;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Évolution du prix</div>
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                range === r.id ? "bg-surfaceAlt text-white" : "text-muted hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} minTickGap={40} />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => fmtMoney(v, currency, 0)}
              width={70}
            />
            <Tooltip
              contentStyle={{ background: "#13131a", border: "1px solid #2a2a38", borderRadius: 12 }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(v: number) => fmtMoney(v, currency)}
            />
            <Area type="monotone" dataKey="c" stroke={color} fill="url(#priceFill)" strokeWidth={2} name="Prix" />
            <Line type="monotone" dataKey="sma20" stroke="#7c5cff" strokeWidth={1.5} dot={false} name="SMA20" />
            <Line type="monotone" dataKey="sma50" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="SMA50" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full" style={{ background: color }} /> Prix</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-accent" /> SMA 20</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-accent2" /> SMA 50</span>
      </div>
    </div>
  );
}
