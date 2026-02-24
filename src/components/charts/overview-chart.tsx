"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

const sample = [
  { week: "W1", value: 1200 },
  { week: "W2", value: 1800 },
  { week: "W3", value: 1600 },
  { week: "W4", value: 2200 }
];

export function OverviewChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={sample}>
          <XAxis dataKey="week" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
