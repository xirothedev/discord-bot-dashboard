"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ChartData {
  time: string;
  cpu: number;
  memory: number;
}

interface SystemChartProps {
  title: string;
  dataKey: "cpu" | "memory";
  color: string;
  unit: string;
  data: ChartData[];
}

export function SystemChart({
  title,
  dataKey,
  color,
  unit,
  data,
}: SystemChartProps) {
  return (
    <Card className="cyber-gradient border cyber-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [
                  `${value.toFixed(1)}${unit}`,
                  title,
                ]}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
