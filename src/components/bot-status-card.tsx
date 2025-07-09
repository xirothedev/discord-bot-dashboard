"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { PM2APIResponse } from "@/types/monitor";
import { Bot, Play, RotateCcw, Square } from "lucide-react";
import { useState } from "react";

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

	const statusColors = {
		online: "bg-green-500/20 text-green-400 border-green-500/30",
		stopped: "bg-gray-500/20 text-gray-400 border-gray-500/30",
		error: "bg-red-500/20 text-red-400 border-red-500/30",
		restarting: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	};

	const statusDots = {
		online: "bg-green-500",
		stopped: "bg-gray-500",
		error: "bg-red-500",
		restarting: "bg-yellow-500 animate-pulse",
	};

	return (
		<div className="relative">
			{isLoading && (
				<div className="absolute inset-0 z-10 cursor-not-allowed rounded-lg bg-black/30 backdrop-blur-[1px]" />
			)}
			<Card
				className={`cyber-border bg-card/50 hover:cyber-glow backdrop-blur-sm transition-all duration-300 ${isLoading ? "pointer-events-none opacity-60" : ""}`}
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Bot className="h-4 w-4 text-purple-400" />
							<CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
						</div>
						<div className="flex items-center gap-2">
							<div className={`h-2 w-2 rounded-full ${statusDots[bot.status]}`}></div>
							<Badge variant="outline" className={statusColors[bot.status]}>
								{bot.status}
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="grid grid-cols-2 gap-2 text-xs">
						<div>
							<span className="text-muted-foreground">Uptime:</span>
							<div className="text-purple-400">{bot.uptime}</div>
						</div>
						<div>
							<span className="text-muted-foreground">Restarts:</span>
							<div className="text-purple-400">{bot.restarts}</div>
						</div>
						<div>
							<span className="text-muted-foreground">Memory:</span>
							<div className="text-purple-400">{bot.memory} MB</div>
						</div>
						<div>
							<span className="text-muted-foreground">CPU:</span>
							<div className="text-purple-400">{bot.cpu}%</div>
						</div>
					</div>
					<div className="flex gap-1">
						{bot.status === "stopped" ? (
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleAction("start")}
								className="flex-1 hover:border-green-500/50 hover:bg-green-500/10"
							>
								<Play className="mr-1 h-3 w-3" />
								Start
							</Button>
						) : (
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleAction("stop")}
								className="flex-1 hover:border-red-500/50 hover:bg-red-500/10"
							>
								<Square className="mr-1 h-3 w-3" />
								Stop
							</Button>
						)}
						<Button
							size="sm"
							variant="outline"
							onClick={() => handleAction("restart")}
							className="flex-1 hover:border-yellow-500/50 hover:bg-yellow-500/10"
							disabled={bot.status === "restarting" || bot.status === "stopped"}
						>
							<RotateCcw className="mr-1 h-3 w-3" />
							Restart
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
