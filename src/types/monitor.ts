export type Status = "error" | "online" | "offline" | "restarting"
export const statusList = ["error", "online", "offline", "restarting"] as const;

export interface PM2APILogsResponse {
  stdout: string[];
  stderr: string[];
}

export interface PM2APIResponse {
  name: string;
  pid: number;
  status: Status;
  memory: number; // MB
  cpu: number;
  uptime: string;
  restarts: number;
  logs: PM2APILogsResponse;
}

export interface MonitorApiResponse {
  uptime: string;
  memory: {
    total: number; // MB
    free: number;  // MB
    used: number;  // MB
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