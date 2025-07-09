import { LogViewer } from "@/components/log-viewer";

export default function LoggerPage() {
	return (
		<div className="bg-background min-h-screen p-6">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-purple-400">System Logs</h2>
				</div>
				<LogViewer />
			</div>
		</div>
	);
}
