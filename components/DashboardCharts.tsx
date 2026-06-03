"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "./ui/Card";

const pieData = [
  { name: 'Learning', value: 400, color: '#3b82f6' },
  { name: 'Nutrition', value: 300, color: '#22c55e' },
  { name: 'Safety', value: 100, color: '#ef4444' },
  { name: 'Wellbeing', value: 200, color: '#a855f7' },
];

const lineData = [
  { name: 'Mon', flow: 40 },
  { name: 'Tue', flow: 30 },
  { name: 'Wed', flow: 60 },
  { name: 'Thu', flow: 45 },
  { name: 'Fri', flow: 90 },
  { name: 'Sat', flow: 85 },
  { name: 'Sun', flow: 120 },
];

export function EnergyFlowChart() {
  return (
    <Card className="p-4 pt-6 h-[250px] w-full mt-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Energy Flow Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="flow" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} />
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
          <YAxis hide />
          <Tooltip wrapperStyle={{ borderRadius: '8px' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function CategoryDistributionChart() {
  return (
    <Card className="p-4 h-[250px] w-full mt-4 flex flex-col">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Mojo Distribution (Actions)</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
