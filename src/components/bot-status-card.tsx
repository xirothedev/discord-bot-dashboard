"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface BotData {
  id: string
  name: string
  status: "online" | "offline" | "error" | "restarting"
  uptime: string
  memory: number
  cpu: number
  restarts: number
}

interface BotStatusCardProps {
  bot: BotData
  onAction: (botId: string, action: "start" | "stop" | "restart") => void
}

export function BotStatusCard({ bot, onAction }: BotStatusCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: "start" | "stop" | "restart") => {
    setIsLoading(true)
    await onAction(bot.id, action)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const statusConfig = {
    online: {
      color: "status-online",
      bg: "bg-green-500/10 border-green-500/30",
      badge: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    offline: {
      color: "status-offline",
      bg: "bg-red-500/10 border-red-500/30",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    error: {
      color: "status-offline",
      bg: "bg-red-500/10 border-red-500/30",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    restarting: {
      color: "status-warning",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
  }

  const config = statusConfig[bot.status]

  return (
    <Card className={cn("cyber-gradient border transition-all duration-300 hover:cyber-glow", config.bg)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Activity className={cn("w-4 h-4", config.color)} />
          <CardTitle className="text-base font-semibold">{bot.name}</CardTitle>
        </div>
        <Badge variant="outline" className={config.badge}>
          {bot.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-medium">{bot.uptime}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Memory</div>
            <div className="font-medium">{bot.memory}MB</div>
          </div>
          <div>
            <div className="text-muted-foreground">CPU</div>
            <div className="font-medium">{bot.cpu}%</div>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-muted-foreground">Restarts: {bot.restarts}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction("start")}
            disabled={isLoading || bot.status === "online"}
            className="flex-1 hover:bg-green-500/20 hover:border-green-500/50"
          >
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction("stop")}
            disabled={isLoading || bot.status === "offline"}
            className="flex-1 hover:bg-red-500/20 hover:border-red-500/50"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction("restart")}
            disabled={isLoading}
            className="flex-1 hover:bg-yellow-500/20 hover:border-yellow-500/50"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
