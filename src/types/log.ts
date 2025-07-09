export interface LogFilter {
	botId?: string;
	search?: string;
	type?: "stdout" | "stderr";
}

export interface LogContent {
	botId: string;
	botName: string;
	content: string;
	type: string;
}
