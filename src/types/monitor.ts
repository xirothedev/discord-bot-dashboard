export type Status = "errored" | "online" | "stopped" | "restarting";
export const statusList = ["errored", "online", "offline", "restarting"] as const;

export interface PM2APIResponse {
	id: number;
	name: string;
	pid: number;
	status: Status;
	memory: number; // MB
	cpu: number;
	uptime: string;
	restarts: number;
}

export interface MonitorApiResponse {
	uptime: string;
	memory: {
		total: number; // MB
		free: number; // MB
		used: number; // MB
	};
	loadAverage: number[];
	platform: string;
	architecture: string;
	cpu: {
		count: number;
		model: string;
		speed: number;
	};
	processCount: number;
	pm2: Array<PM2APIResponse>;
}
