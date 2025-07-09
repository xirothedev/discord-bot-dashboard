"use client";

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
} from "@/components/ui/sidebar";
import { useVersion } from "@/hooks/use-version";
import { Activity, Bot, FileClock, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
	{
		title: "Dashboard",
		icon: Activity,
		url: "/",
	},
	{
		title: "Logger",
		icon: FileClock,
		url: "/logger",
	},
	{
		title: "Settings",
		icon: Settings,
		url: "/settings",
	},
];

const state = {
	loading: { color: "#FDC700", content: "System loading..." },
	error: { color: "#FB2C36", content: "System error" },
	online: { color: "#05DF72", content: "System online" },
};

export function AppSidebar() {
	const { data, isLoading, isError } = useVersion();
	const pathname = usePathname();

	return (
		<Sidebar className="cyber-border">
			<SidebarHeader className="border-b border-border/50 p-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-purple-700">
						<Bot className="h-4 w-4 text-white" />
					</div>
					<div>
						<h2 className="text-lg font-bold text-purple-400">Dashboard</h2>
						<p className="text-xs text-muted-foreground">Collect data from PM2</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="font-semibold text-purple-400">Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.url}
										className="hover:bg-purple-500/10 data-[active=true]:bg-purple-500/20 data-[active=true]:text-purple-400"
									>
										<a href={item.url}>
											<item.icon className="h-4 w-4" />
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
					<div className="mb-1 flex items-center gap-2">
						<div
							className="h-2 w-2 animate-pulse rounded-full"
							style={{
								backgroundColor: isLoading
									? state.loading.color
									: isError
										? state.error.color
										: state.online.color,
							}}
						></div>
						<span
							style={{
								color: isLoading
									? state.loading.color
									: isError
										? state.error.color
										: state.online.color,
							}}
						>
							{isLoading ? state.loading.content : isError ? state.error.content : state.online.content}
						</span>
					</div>
					{data && (
						<div>
							PM2 v{data.pm2} • Node.js {data.node}
						</div>
					)}
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
