"use client";

import { LogFilters } from "@/components/log-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMonitor } from "@/hooks/use-monitor";
import { LogContent, LogFilter } from "@/types/log";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export function LogViewer() {
	const { data } = useMonitor();
	const [logs, setLogs] = useState<LogContent[]>([]);
	const [filters, setFilters] = useState<LogFilter>({});

	useEffect(() => {
		if (!data) return;
		const allLogs: LogContent[] = [];

		if (data.pm2) {
			data.pm2.forEach((bot) => {
				if (bot.logs?.stderr) {
					bot.logs.stderr.forEach((stde) => {
						allLogs.push({
							botId: bot.pid.toString(),
							botName: bot.name,
							content: stde,
							type: "stderr",
						});
					});
				}
				if (bot.logs?.stdout) {
					bot.logs.stdout.forEach((stdo) => {
						allLogs.push({
							botId: bot.pid.toString(),
							botName: bot.name,
							content: stdo,
							type: "stdout",
						});
					});
				}
			});
		}

		const filteredLogs = allLogs.filter((log) => {
			if (filters.botId && log.botId !== filters.botId) return false;
			if (filters.type && log.type !== filters.type) return false;
			if (filters.search && !log.content.includes(filters.search)) return false;
			return true;
		});

		setLogs(filteredLogs.reverse());
	}, [data, filters]);

	const exportLogs = () => {
		const dataStr = JSON.stringify(logs, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `bot-logs-${new Date().toISOString().split("T")[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-4">
			<LogFilters
				filters={filters}
				onFiltersChange={setFilters}
				bots={data?.pm2.map((bot) => ({ id: bot.pid, name: bot.name }))}
			/>

			<Card className="cyber-gradient cyber-border border">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-semibold text-purple-400">
							System Logs ({logs.length})
						</CardTitle>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1 text-xs"></div>
							<Button
								variant="outline"
								size="sm"
								onClick={exportLogs}
								className="bg-transparent hover:border-purple-500/50 hover:bg-purple-500/10"
							>
								<Download className="mr-1 h-3 w-3" />
								Export
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<ScrollArea className="h-[600px] w-full">
						<div className="space-y-2 pr-4">
							{logs.length === 0 ? (
								<div className="py-8 text-center text-muted-foreground">
									No logs found matching the current filters.
								</div>
							) : (
								logs.map((log, index) => {
									return (
										<p key={index} className="mb-1 text-sm font-medium">
											{log.content}
										</p>
									);
								})
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
