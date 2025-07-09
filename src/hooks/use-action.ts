import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface ActionPayload {
	action: "start" | "stop" | "restart";
	pm_id: number;
}

export function useAction(options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) {
	return useMutation({
		mutationFn: async (payload: ActionPayload) => {
			const res = await axios.post("/api/actions", payload);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Do action successful!");
		},
		onError: (error: AxiosError<string>) => {
			toast.error("Error", {
				description: error?.response?.data || error.message || "An error occurred!",
			});
		},
	});
}
