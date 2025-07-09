import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LogFilter, LogApiResponse } from "@/types/log";

const PAGE_SIZE = 200;

interface UseLogsOptions {
	page?: number;
	limit?: number;
}

export function useLogs({ page, limit }: UseLogsOptions) {
	return useQuery<LogApiResponse[] | undefined>({
		queryKey: ["logs"],
		queryFn: async () => {
			const res = await axios.get<LogApiResponse[] | undefined>("/api/logs", {
				params: { page: page ?? 1, limit: limit ?? PAGE_SIZE },
			});

			return res.data;
		},
	});
}
