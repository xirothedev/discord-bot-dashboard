"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	progress?: number;
	trend?: "up" | "down" | "stable";
	status?: "success" | "warning" | "errored";
	icon?: React.ReactNode;
	className?: string;
}

export function MetricCard({ title, value, subtitle, progress, status, icon, className }: MetricCardProps) {
	const statusColors = {
		success: "text-green-400 border-green-500/30 bg-green-500/5",
		warning: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
		errored: "text-red-400 border-red-500/30 bg-red-500/5",
		info: "text-purple-400 border-purple-500/30 bg-purple-500/5",
	};

	return (
		<Card
			className={cn(
				"cyber-gradient hover:cyber-glow border transition-all duration-300",
				statusColors[status],
				className,
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
				{icon && <div className={cn("h-4 w-4", statusColors[status].split(" ")[0])}>{icon}</div>}
			</CardHeader>
			<CardContent>
				<div className="mb-1 text-2xl font-bold">{value}</div>
				{subtitle && <p className="text-muted-foreground mb-2 text-xs">{subtitle}</p>}
				{progress !== undefined && (
					<div className="space-y-1">
						<Progress
							value={progress}
							className="h-2"
							style={{
								background: "hsl(var(--muted))",
							}}
						/>
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>Usage</span>
							<span>{progress}%</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
