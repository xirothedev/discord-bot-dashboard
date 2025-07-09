"use client";

import { LogFilters } from "@/components/log-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogs } from "@/hooks/use-logs";
import { LogApiLogEntry, LogFilter } from "@/types/log";
import { Download } from "lucide-react";
import { Suspense, useMemo, useState } from "react";

export function LogViewer() {
	const { data, isLoading } = useLogs({});
	const [filters, setFilters] = useState<LogFilter>({});

	const filteredLogs = useMemo(() => {
		if (!data) return [];
		const filtered: LogApiLogEntry[] = [];
		data.forEach((bot) => {
			if (filters.botId && bot.pm_id.toString() !== filters.botId) return;
			const logs = bot.logs.filter((log) => {
				if (filters.type && log.type !== filters.type) return false;
				if (filters.search && !log.content.includes(filters.search)) return false;
				return true;
			});
			filtered.push(...logs.map((l) => ({ ...l, pm_id: bot.pm_id, name: bot.name, pid: bot.pid })));
		});
		return filtered;
	}, [data, filters]);

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

	return (
		<Suspense fallback={<Loading />}>
			<div className="space-y-4">
				<LogFilters
					filters={filters}
					onFiltersChange={setFilters}
					bots={data?.map((bot) => ({ id: bot.pm_id, name: bot.name }))}
				/>

				<Card className="cyber-gradient cyber-border border">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-semibold text-purple-400">
								System Logs ({filteredLogs.length})
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
								{isLoading ? (
									<div className="space-y-2">
										{Array.from({ length: 30 }).map((_, i) => (
											<div key={i} className="bg-muted h-4 w-full animate-pulse rounded"></div>
										))}
									</div>
								) : filteredLogs.length === 0 ? (
									<div className="text-muted-foreground py-8 text-center">
										No logs found matching the current filters.
									</div>
								) : (
									filteredLogs.map((log, index) => {
										return (
											<p key={index} className="mb-1 text-sm font-medium">
												[{log.type}] {log.content}
											</p>
										);
									})
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</Suspense>
	);
}

const Loading = () => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				{Array.from({ length: 30 }).map((_, i) => (
					<div key={i} className="bg-muted h-4 w-full animate-pulse rounded"></div>
				))}
			</div>
		</div>
	);
};
