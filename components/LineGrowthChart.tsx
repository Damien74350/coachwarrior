"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function LineGrowthChart({ data, dataKey, xKey, color = "#ff3b30" }: {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
}) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#13131a", border: "1px solid #2a2a38", borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#area-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
