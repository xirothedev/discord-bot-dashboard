import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface ChartData {
	time: string;
	cpu: number;
	memory: number;
}

interface SystemChartProps {
	title: string;
	dataKey: "cpu" | "memory";
	color: string;
	unit: string;
	data?: ChartData[];
}

function Spinner() {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
			<style>{`
			@keyframes spin { 100% { transform: rotate(360deg); } }
			.spinner {
				border: 4px solid hsl(var(--border));
				border-top: 4px solid hsl(var(--primary));
				border-radius: 50%;
				width: 40px;
				height: 40px;
				animation: spin 1s linear infinite;
			}
			`}</style>
			<div className="spinner" />
		</div>
	);
}

export function SystemChart({ title, dataKey, color, unit, data }: SystemChartProps) {
	return (
		<Card className="cyber-gradient cyber-border border">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-purple-400">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-64">
					{!data ? (
						<Spinner />
					) : (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data}>
								<XAxis
									dataKey="time"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
									domain={[0, 100]}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
										color: "hsl(var(--foreground))",
									}}
									formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
								/>
								<Line
									type="monotone"
									dataKey={dataKey}
									stroke={color}
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4, fill: color }}
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
