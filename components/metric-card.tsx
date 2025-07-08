"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  progress?: number
  trend?: "up" | "down" | "stable"
  status?: "success" | "warning" | "error" | "info"
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  progress,
  trend,
  status = "info",
  icon,
  className,
}: MetricCardProps) {
  const statusColors = {
    success: "text-green-400 border-green-500/30 bg-green-500/5",
    warning: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
    error: "text-red-400 border-red-500/30 bg-red-500/5",
    info: "text-purple-400 border-purple-500/30 bg-purple-500/5",
  }

  const progressColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-purple-500",
  }

  return (
    <Card
      className={cn(
        "cyber-gradient border transition-all duration-300 hover:cyber-glow",
        statusColors[status],
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className={cn("w-4 h-4", statusColors[status].split(" ")[0])}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>}
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress
              value={progress}
              className="h-2"
              style={{
                background: "hsl(var(--muted))",
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usage</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
