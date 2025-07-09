"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { PM2APIResponse } from "@/types/monitor";
import { useAction } from "@/hooks/use-action";

interface BotStatusCardProps {
	bot: PM2APIResponse;
}

export function BotStatusCard({ bot }: BotStatusCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { mutate } = useAction();

	const handleAction = (action: "start" | "stop" | "restart") => {
		setIsLoading(true);
		mutate({ action, pm_id: bot.id });
		setTimeout(() => setIsLoading(false), 1000);
	};

	const statusConfig = {
		online: {
			color: "status-online",
			bg: "bg-green-500/10 border-green-500/30",
			badge: "bg-green-500/20 text-green-400 border-green-500/30",
		},
		stopped: {
			color: "status-offline",
			bg: "bg-red-500/10 border-red-500/30",
			badge: "bg-red-500/20 text-red-400 border-red-500/30",
		},
		error: {
			color: "status-offline",
			bg: "bg-red-500/10 border-red-500/30",
			badge: "bg-red-500/20 text-red-400 border-red-500/30",
		},
		restarting: {
			color: "status-warning",
			bg: "bg-yellow-500/10 border-yellow-500/30",
			badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
		},
	};

	const config = statusConfig[bot.status];

	return (
		<Card className={cn("cyber-gradient hover:cyber-glow border transition-all duration-300", config.bg)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<div className="flex items-center gap-2">
					<Activity className={cn("h-4 w-4", config.color)} />
					<CardTitle className="text-base font-semibold">{bot.name}</CardTitle>
				</div>
				<Badge variant="outline" className={config.badge}>
					{bot.status.toUpperCase()}
				</Badge>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-3 gap-4 text-sm">
					<div>
						<div className="text-muted-foreground">Uptime</div>
						<div className="font-medium">{bot.status === "stopped" ? 0 : bot.uptime}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Memory</div>
						<div className="font-medium">{bot.memory}MB</div>
					</div>
					<div>
						<div className="text-muted-foreground">CPU</div>
						<div className="font-medium">{bot.cpu}%</div>
					</div>
				</div>

				<div className="text-sm">
					<div className="text-muted-foreground">Restarts: {bot.restarts}</div>
				</div>

				<div className="flex gap-2 pt-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleAction("start")}
						disabled={isLoading || bot.status === "online"}
						className="flex-1 hover:border-green-500/50 hover:bg-green-500/20"
					>
						<Play className="mr-1 h-3 w-3" />
						Start
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleAction("stop")}
						disabled={isLoading || bot.status === "stopped"}
						className="flex-1 hover:border-red-500/50 hover:bg-red-500/20"
					>
						<Square className="mr-1 h-3 w-3" />
						Stop
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleAction("restart")}
						disabled={isLoading}
						className="flex-1 hover:border-yellow-500/50 hover:bg-yellow-500/20"
					>
						<RotateCcw className="mr-1 h-3 w-3" />
						Restart
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
