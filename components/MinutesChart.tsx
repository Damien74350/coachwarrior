"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function MinutesChart({ data }: { data: { day: string; minutes: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff3b30" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#ff7a18" stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" vertical={false} />
          <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#13131a", border: "1px solid #2a2a38", borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Bar dataKey="minutes" fill="url(#bar)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
