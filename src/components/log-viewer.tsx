"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "@/components/log-entry";
import { LogFilters } from "@/components/log-filters";
import { Download, Pause, Play, Trash2 } from "lucide-react";
import type { LogEntry as LogEntryType, LogFilter } from "@/types/log";

interface LogViewerProps {
  bots: Array<{ id: string; name: string; status: string }>;
}

export function LogViewer({ bots }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const [filters, setFilters] = useState<LogFilter>({});
  const [activeTab, setActiveTab] = useState("all");
  const [isStreaming, setIsStreaming] = useState(true);
  const [maxLogs] = useState(1000); // Limit logs for performance

  // Generate sample logs
  useEffect(() => {
    const generateSampleLogs = () => {
      const sampleMessages = [
        "Bot started successfully",
        "Connected to Discord gateway",
        "Command executed: /play music",
        "User joined voice channel",
        "Database connection established",
        "API rate limit warning",
        "Error processing command",
        "Memory usage threshold exceeded",
        "Scheduled task completed",
        "WebSocket connection lost",
        "Attempting to reconnect...",
        "Reconnection successful",
        "New guild member detected",
        "Message deleted by moderator",
        "Backup process initiated",
      ];

      const levels: LogEntryType["level"][] = [
        "info",
        "warn",
        "error",
        "debug",
        "success",
      ];
      const categories: LogEntryType["category"][] = [
        "system",
        "command",
        "error",
        "user",
        "api",
        "database",
      ];

      const initialLogs: LogEntryType[] = [];

      for (let i = 0; i < 50; i++) {
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const message =
          sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        initialLogs.push({
          id: `log-${Date.now()}-${i}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
          botId: bot.id,
          botName: bot.name,
          level,
          category,
          message,
          details:
            level === "error"
              ? `Stack trace:\n  at Function.execute (/app/commands/play.js:45:12)\n  at CommandHandler.handle (/app/handlers/command.js:23:8)`
              : undefined,
          userId:
            Math.random() > 0.5
              ? `user_${Math.floor(Math.random() * 1000)}`
              : undefined,
          channelId:
            Math.random() > 0.5
              ? `channel_${Math.floor(Math.random() * 100)}`
              : undefined,
          guildId:
            Math.random() > 0.5
              ? `guild_${Math.floor(Math.random() * 50)}`
              : undefined,
        });
      }

      setLogs(
        initialLogs.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        )
      );
    };

    generateSampleLogs();
  }, [bots]);

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const bot = bots[Math.floor(Math.random() * bots.length)];
      const levels: LogEntryType["level"][] = [
        "info",
        "warn",
        "error",
        "debug",
        "success",
      ];
      const categories: LogEntryType["category"][] = [
        "system",
        "command",
        "error",
        "user",
        "api",
        "database",
      ];
      const messages = [
        "New command received",
        "Processing user request",
        "Database query executed",
        "Cache updated",
        "Heartbeat received",
        "Event processed",
      ];

      const newLog: LogEntryType = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        botId: bot.id,
        botName: bot.name,
        level: levels[Math.floor(Math.random() * levels.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        userId:
          Math.random() > 0.7
            ? `user_${Math.floor(Math.random() * 1000)}`
            : undefined,
        channelId:
          Math.random() > 0.7
            ? `channel_${Math.floor(Math.random() * 100)}`
            : undefined,
      };

      setLogs((prev) => {
        const updated = [newLog, ...prev];
        return updated.slice(0, maxLogs); // Keep only recent logs
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, bots, maxLogs]);

  // Filter logs based on current filters
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    if (activeTab !== "all") {
      filtered = filtered.filter((log) => log.botId === activeTab);
    }

    if (filters.botId) {
      filtered = filtered.filter((log) => log.botId === filters.botId);
    }

    if (filters.level) {
      filtered = filtered.filter((log) => log.level === filters.level);
    }

    if (filters.category) {
      filtered = filtered.filter((log) => log.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          log.botName.toLowerCase().includes(searchLower) ||
          log.details?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [logs, filters, activeTab]);

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bot-logs-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogCountByBot = (botId: string) => {
    return logs.filter((log) => log.botId === botId).length;
  };

  const getLogCountByLevel = (level: LogEntryType["level"]) => {
    return filteredLogs.filter((log) => log.level === level).length;
  };

  return (
    <div className="space-y-4">
      <LogFilters
        filters={filters}
        onFiltersChange={setFilters}
        botOptions={bots}
      />

      <Card className="cyber-gradient border cyber-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-purple-400">
              System Logs ({filteredLogs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                >
                  Info: {getLogCountByLevel("info")}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                >
                  Warn: {getLogCountByLevel("warn")}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-500/20 text-red-400 border-red-500/30"
                >
                  Error: {getLogCountByLevel("error")}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStreaming(!isStreaming)}
                className={`hover:bg-purple-500/10 hover:border-purple-500/50 ${
                  isStreaming
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {isStreaming ? (
                  <Pause className="h-3 w-3 mr-1" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                {isStreaming ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                className="hover:bg-purple-500/10 hover:border-purple-500/50 bg-transparent"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
                className="hover:bg-red-500/10 hover:border-red-500/50 bg-transparent"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-muted/20">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
              >
                All Logs ({logs.length})
              </TabsTrigger>
              {bots.map((bot) => (
                <TabsTrigger
                  key={bot.id}
                  value={bot.id}
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                >
                  {bot.name} ({getLogCountByBot(bot.id)})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[600px] w-full">
                <div className="space-y-2 pr-4">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No logs found matching the current filters.
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <LogEntry key={log.id} log={log} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
