import { MonitorApiResponse } from "@/types/monitor";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMonitor() {
  return useQuery<MonitorApiResponse>({
    queryKey: ["monitor"],
    queryFn: async () => {
      const res = await axios.get("/api/monitor");
      return res.data;
    },
    refetchInterval: 1000,
  });
}