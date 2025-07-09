"use client"

import { Activity, Bot, Server, Settings, Shield, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Dashboard",
    icon: Activity,
    url: "#",
    isActive: true,
  },
  {
    title: "Bot Management",
    icon: Bot,
    url: "#",
  },
  {
    title: "Server Stats",
    icon: Server,
    url: "#",
  },
  {
    title: "Process Monitor",
    icon: Zap,
    url: "#",
  },
  {
    title: "Security",
    icon: Shield,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="cyber-border">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-purple-400">BotControl</h2>
            <p className="text-xs text-muted-foreground">PM2 Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-400 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="hover:bg-purple-500/10 data-[active=true]:bg-purple-500/20 data-[active=true]:text-purple-400"
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div>PM2 v5.3.0 • Node.js v18.17.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
