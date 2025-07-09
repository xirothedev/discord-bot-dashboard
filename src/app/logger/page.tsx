import { AppSidebar } from "@/components/app-sidebar";
import { LogViewer } from "@/components/log-viewer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LoggerPage() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="min-h-screen bg-background p-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-purple-400">System Logs</h2>
						</div>
						<LogViewer />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
