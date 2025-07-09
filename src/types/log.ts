export interface LogFilter {
	botId?: string;
	search?: string;
	type?: "stdout" | "stderr";
}

export interface LogApiLogEntry {
	content: string;
	type: "stdout" | "stderr";
}

export interface LogApiResponse {
	pm_id: number;
	name: string;
	pid: number;
	logs: LogApiLogEntry[];
}
