"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Clock, Bot, User, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LogEntry as LogEntryType } from "@/types/log"

interface LogEntryProps {
  log: LogEntryType
}

export function LogEntry({ log }: LogEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const levelConfig = {
    info: {
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    warn: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    error: {
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    debug: {
      color: "text-gray-400",
      bg: "bg-gray-500/10 border-gray-500/30",
      badge: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    },
    success: {
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/30",
      badge: "bg-green-500/20 text-green-400 border-green-500/30",
    },
  }

  const categoryConfig = {
    system: { icon: "⚙️", label: "System" },
    command: { icon: "⚡", label: "Command" },
    error: { icon: "❌", label: "Error" },
    user: { icon: "👤", label: "User" },
    api: { icon: "🔗", label: "API" },
    database: { icon: "💾", label: "Database" },
  }

  const config = levelConfig[log.level]
  const category = categoryConfig[log.category]

  return (
    <Card className={cn("border transition-all duration-200 hover:shadow-md", config.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{log.timestamp.toLocaleTimeString()}</span>
              </div>

              <Badge variant="outline" className={config.badge}>
                {log.level.toUpperCase()}
              </Badge>

              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bot className="h-3 w-3" />
                <span>{log.botName}</span>
              </div>
            </div>

            <div className="text-sm font-medium mb-1">{log.message}</div>

            {isExpanded && (
              <div className="mt-3 space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                {log.details && (
                  <div>
                    <span className="font-medium">Details:</span>
                    <pre className="mt-1 p-2 bg-muted/50 rounded text-xs overflow-x-auto">{log.details}</pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Log ID:</span> {log.id}
                  </div>
                  <div>
                    <span className="font-medium">Bot ID:</span> {log.botId}
                  </div>
                  {log.userId && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">User:</span> {log.userId}
                    </div>
                  )}
                  {log.channelId && (
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span className="font-medium">Channel:</span> {log.channelId}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
