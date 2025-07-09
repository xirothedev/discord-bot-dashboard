import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

const versionSchema = z.object({
	pm2: z.string(),
	node: z.string(),
});

export function useVersion() {
	return useQuery({
		queryKey: ["version"],
		queryFn: async () => {
			const res = await axios.get("/api/version");
			const parsed = versionSchema.safeParse(res.data);
			if (!parsed.success) throw new Error("Invalid version API response");
			return parsed.data;
		},
		refetchOnWindowFocus: false,
	});
}
