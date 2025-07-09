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
		<div className="bg-background p-8">
			<h1 className="mb-6 text-2xl font-bold text-purple-400">Settings</h1>
			<div className="max-w-md space-y-8">
				{/* Theme Switcher */}
				<div className="bg-card flex items-center justify-between rounded-lg border p-4">
					<span className="font-medium">Dark Mode</span>
					<Switch
						checked={isClient && theme === "dark" ? true : false}
						onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
						aria-label="Toggle dark mode"
					/>
				</div>
			</div>
		</div>
	);
}
