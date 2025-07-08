export interface LogEntry {
  id: string
  timestamp: Date
  botId: string
  botName: string
  level: "info" | "warn" | "error" | "debug" | "success"
  category: "system" | "command" | "error" | "user" | "api" | "database"
  message: string
  details?: string
  userId?: string
  channelId?: string
  guildId?: string
}

export interface LogFilter {
  botId?: string
  level?: LogEntry["level"]
  category?: LogEntry["category"]
  search?: string
  startDate?: Date
  endDate?: Date
}
