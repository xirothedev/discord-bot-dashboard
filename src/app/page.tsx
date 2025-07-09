"use client";

import { BotStatusCard } from "@/components/bot-status-card";
import { MetricCard } from "@/components/metric-card";
import { ChartData, SystemChart } from "@/components/system-chart";
import { useMonitor } from "@/hooks/use-monitor";
import { MonitorApiResponse, PM2APIResponse } from "@/types/monitor";
import { Activity, Cpu, MemoryStick, Server } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
	const [bots, setBots] = useState<PM2APIResponse[]>([]);
	const { data } = useMonitor();

	const [systemMetrics, setSystemMetrics] = useState<MonitorApiResponse | null>(null);

	// Add chartData state for CPU and memory
	const [chartData, setChartData] = useState<ChartData[]>([]);

	useEffect(() => {
		if (data) {
			setSystemMetrics(data);
			if (Array.isArray(data.pm2)) {
				setBots(data.pm2);
			}
			// Calculate cpu and memory usage
			const cpu =
				Array.isArray(data.loadAverage) && data.loadAverage.length > 0 && data.cpu.count
					? Number(((data.loadAverage[0] * 100) / data.cpu.count).toFixed(2))
					: 0;
			const memory =
				data.memory && data.memory.total
					? Number(((data.memory.used / data.memory.total) * 100).toFixed(2))
					: 0;
			setChartData((prev) => [
				...prev,
				{
					time: new Date().toLocaleTimeString(),
					cpu,
					memory,
				},
			]);
		}
	}, [data]);

	const onlineBots = bots.filter((bot) => bot.status === "online").length;
	const totalBots = bots.length;

	const cpuUsage = systemMetrics
		? Array.isArray(systemMetrics.loadAverage) && systemMetrics.loadAverage.length > 0
			? Number(((systemMetrics.loadAverage[0] * 100) / systemMetrics.cpu.count).toFixed(2))
			: 0
		: 0;
	const memoryUsage = systemMetrics
		? Number(((systemMetrics.memory.used / systemMetrics.memory.total) * 100).toFixed(2))
		: 0;
	const usedMemory = systemMetrics ? `${systemMetrics.memory.used} MB` : "-";
	const totalMemory = systemMetrics ? `${systemMetrics.memory.total} MB` : "-";
	const uptime = systemMetrics ? systemMetrics.uptime : "-";
	const processCount = systemMetrics ? systemMetrics.processCount : 0;

	return (
		<main className="space-y-6 p-6">
			{/* System Overview */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<MetricCard
					title="CPU Usage"
					value={`${cpuUsage}%`}
					progress={cpuUsage}
					status={cpuUsage > 80 ? "errored" : cpuUsage > 60 ? "warning" : "success"}
					icon={<Cpu />}
				/>
				<MetricCard
					title="Memory Usage"
					value={`${memoryUsage}%`}
					subtitle={`${usedMemory} / ${totalMemory}`}
					progress={memoryUsage}
					status={memoryUsage > 85 ? "errored" : memoryUsage > 70 ? "warning" : "success"}
					icon={<MemoryStick />}
				/>
				<MetricCard
					title="Active Bots"
					value={`${onlineBots}/${totalBots}`}
					subtitle="Bots online"
					status={onlineBots === totalBots ? "success" : onlineBots > 0 ? "warning" : "errored"}
					icon={<Activity />}
				/>
				<MetricCard
					title="System Uptime"
					value={uptime}
					subtitle={`${processCount} processes`}
					status="info"
					icon={<Server />}
				/>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<SystemChart title="CPU Usage" dataKey="cpu" color="#a855f7" unit="%" data={chartData} />
				<SystemChart title="Memory Usage" dataKey="memory" color="#06b6d4" unit="%" data={chartData} />
			</div>

			{/* Bot Management */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-purple-400">Bot Management</h2>
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-green-500"></div>
							<span>Online</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-red-500"></div>
							<span>Offline</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-yellow-500"></div>
							<span>Error</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{bots.map((bot) => (
						<BotStatusCard key={bot.pid} bot={bot} />
					))}
				</div>
			</div>
		</main>
	);
}
