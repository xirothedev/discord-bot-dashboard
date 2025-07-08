interface BotData {
  id: string;
  name: string;
  status: "online" | "offline" | "error" | "restarting";
  uptime: string;
  memory: number;
  cpu: number;
  restarts: number;
}