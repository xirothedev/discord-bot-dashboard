"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [theme]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background p-8">
          <h1 className="text-2xl font-bold mb-6 text-purple-400">Settings</h1>
          <div className="space-y-8 max-w-md">
            {/* Theme Switcher */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <span className="font-medium">Dark Mode</span>
              <Switch
                checked={isClient && theme === "dark" ? true : false}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                aria-label="Toggle dark mode"
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
