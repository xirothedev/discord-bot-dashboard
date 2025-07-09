import { MonitorApiResponse } from "@/types/monitor";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const REFETCH_INTERVAL_TIME = 1000;

export function useMonitor() {
	return useQuery<MonitorApiResponse>({
		queryKey: ["monitor"],
		queryFn: async () => {
			const res = await axios.get<MonitorApiResponse>("/api/monitor");
			return res.data;
		},
		refetchInterval: REFETCH_INTERVAL_TIME,
		refetchOnWindowFocus: true,
	});
}
