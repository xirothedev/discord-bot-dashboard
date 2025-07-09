"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MetricCard } from "@/components/metric-card"
import { BotStatusCard } from "@/components/bot-status-card"
import { SystemChart } from "@/components/system-chart"
import { Server, Cpu, MemoryStick, Activity, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogViewer } from "@/components/log-viewer"

interface BotData {
  id: string
  name: string
  status: "online" | "offline" | "error" | "restarting"
  uptime: string
  memory: number
  cpu: number
  restarts: number
}

export default function Dashboard() {
  const [bots, setBots] = useState<BotData[]>([
    {
      id: "1",
      name: "MusicBot",
      status: "online",
      uptime: "2d 14h 32m",
      memory: 156,
      cpu: 12,
      restarts: 3,
    },
    {
      id: "2",
      name: "ModerationBot",
      status: "online",
      uptime: "5d 8h 15m",
      memory: 89,
      cpu: 8,
      restarts: 1,
    },
    {
      id: "3",
      name: "UtilityBot",
      status: "offline",
      uptime: "0m",
      memory: 0,
      cpu: 0,
      restarts: 7,
    },
    {
      id: "4",
      name: "GameBot",
      status: "error",
      uptime: "12m",
      memory: 234,
      cpu: 45,
      restarts: 12,
    },
  ])

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 34,
    memoryUsage: 67,
    totalMemory: "16 GB",
    usedMemory: "10.7 GB",
    uptime: "7d 12h 45m",
    processes: 24,
  })

  const handleBotAction = async (botId: string, action: "start" | "stop" | "restart") => {
    setBots((prev) =>
      prev.map((bot) => {
        if (bot.id === botId) {
          if (action === "start") {
            return { ...bot, status: "online" as const }
          } else if (action === "stop") {
            return { ...bot, status: "offline" as const, uptime: "0m", memory: 0, cpu: 0 }
          } else if (action === "restart") {
            return { ...bot, status: "restarting" as const, restarts: bot.restarts + 1 }
          }
        }
        return bot
      }),
    )

    // Simulate restart completion
    if (action === "restart") {
      setTimeout(() => {
        setBots((prev) => prev.map((bot) => (bot.id === botId ? { ...bot, status: "online" as const } : bot)))
      }, 2000)
    }
  }

  // Update system metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const onlineBots = bots.filter((bot) => bot.status === "online").length
  const totalBots = bots.length

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-purple-500/10" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-purple-400">Discord Bot Dashboard</h1>
                <p className="text-sm text-muted-foreground">Monitor and manage your PM2 processes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-500/10 hover:border-purple-500/50 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 space-y-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="CPU Usage"
                value={`${systemMetrics.cpuUsage}%`}
                progress={systemMetrics.cpuUsage}
                status={systemMetrics.cpuUsage > 80 ? "error" : systemMetrics.cpuUsage > 60 ? "warning" : "success"}
                icon={<Cpu />}
              />
              <MetricCard
                title="Memory Usage"
                value={`${systemMetrics.memoryUsage}%`}
                subtitle={`${systemMetrics.usedMemory} / ${systemMetrics.totalMemory}`}
                progress={systemMetrics.memoryUsage}
                status={
                  systemMetrics.memoryUsage > 85 ? "error" : systemMetrics.memoryUsage > 70 ? "warning" : "success"
                }
                icon={<MemoryStick />}
              />
              <MetricCard
                title="Active Bots"
                value={`${onlineBots}/${totalBots}`}
                subtitle="Bots online"
                status={onlineBots === totalBots ? "success" : onlineBots > 0 ? "warning" : "error"}
                icon={<Activity />}
              />
              <MetricCard
                title="System Uptime"
                value={systemMetrics.uptime}
                subtitle={`${systemMetrics.processes} processes`}
                status="info"
                icon={<Server />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemChart title="CPU Usage" dataKey="cpu" color="#a855f7" unit="%" />
              <SystemChart title="Memory Usage" dataKey="memory" color="#06b6d4" unit="%" />
            </div>

            {/* Bot Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-purple-400">Bot Management</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Offline</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Error</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {bots.map((bot) => (
                  <BotStatusCard key={bot.id} bot={bot} onAction={handleBotAction} />
                ))}
              </div>
            </div>

            {/* Logging System */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-purple-400">System Logs</h2>
              </div>
              <LogViewer bots={bots} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
