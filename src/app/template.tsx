"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<SidebarProvider defaultOpen={false}>
				<AppSidebar />
				<SidebarInset>
					<div className="bg-background min-h-screen">
						{/* Header */}
						<header className="border-border/50 bg-card/50 sticky top-0 z-10 border-b backdrop-blur-sm">
							<div className="flex h-16 items-center gap-4 px-6">
								<SidebarTrigger className="cursor-pointer hover:bg-purple-500/10" />
								<div className="flex-1">
									<h1 className="text-2xl font-bold text-purple-400">Discord Bot Dashboard</h1>
									<p className="text-muted-foreground text-sm">
										Monitor and manage your PM2 processes
									</p>
								</div>
								<Button
									variant="outline"
									onClick={(e) => {
										e.preventDefault();

										window.location.reload();
									}}
									size="sm"
									className="bg-transparent hover:border-purple-500/50 hover:bg-purple-500/10"
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									Refresh
								</Button>
							</div>
						</header>
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</QueryClientProvider>
	);
}
