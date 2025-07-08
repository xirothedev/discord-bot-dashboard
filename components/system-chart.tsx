"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface ChartData {
  time: string
  cpu: number
  memory: number
}

interface SystemChartProps {
  title: string
  dataKey: "cpu" | "memory"
  color: string
  unit: string
}

export function SystemChart({ title, dataKey, color, unit }: SystemChartProps) {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    // Initialize with some data
    const initialData: ChartData[] = []
    for (let i = 29; i >= 0; i--) {
      const time = new Date(Date.now() - i * 2000).toLocaleTimeString()
      initialData.push({
        time,
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
      })
    }
    setData(initialData)

    // Update data every 2 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: new Date().toLocaleTimeString(),
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="cyber-gradient border cyber-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-400">{title}</CardTitle>
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
                formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
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
  )
}
